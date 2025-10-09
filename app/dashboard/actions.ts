// app/dashboard/actions.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Stripe from 'stripe'
import { Resend } from 'resend' // <-- Dodaj ten import, jeśli go nie masz

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY) // <-- Dodaj tę linię

export async function cancelBooking(formData: FormData) {
    const session = await auth();
    const bookingId = formData.get('bookingId') as string;

    if (!session?.user?.id || !bookingId) {
        throw new Error('Brak autoryzacji lub ID rezerwacji.');
    }

    // ZMIANA TUTAJ: Pobieramy więcej danych, aby użyć ich w e-mailu
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            room: { select: { name: true } },
            timeSlot: { select: { date: true, startTime: true } }
        }
    });

    if (!booking || booking.userId !== session.user.id) {
        throw new Error('Nie masz uprawnień do anulowania tej rezerwacji.');
    }

    // Anulowanie rezerwacji i zwalnianie terminu (bez zmian)
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
    });
    await prisma.timeSlot.update({
        where: { id: booking.timeSlotId },
        data: { isBooked: false }
    });

    // NOWA CZĘŚĆ: Wyślij e-mail z potwierdzeniem anulowania
    try {
        await resend.emails.send({
            from: 'Booking <onboarding@resend.dev>',
            to: booking.customerEmail,
            subject: `Potwierdzenie anulowania rezerwacji: ${booking.room.name}`,
            text: `Cześć ${booking.customerName},\n\nTwoja rezerwacja na ${booking.timeSlot.date.toLocaleDateString('pl-PL')} o godzinie ${booking.timeSlot.startTime} została pomyślnie anulowana.\n\nZapraszamy ponownie!`,
        });
    } catch (emailError) {
        console.error("Błąd wysyłania e-maila o anulowaniu:", emailError);
        // Nawet jeśli e-mail się nie wyśle, kontynuujemy, bo rezerwacja jest już anulowana
    }

    revalidatePath('/dashboard');
}

// Funkcja retryPayment pozostaje bez zmian
export async function retryPayment(formData: FormData) {
    // ... (bez zmian)
    const session = await auth();
    const bookingId = formData.get('bookingId') as string;

    if (!session?.user?.id || !bookingId) {
        throw new Error('Brak autoryzacji lub ID rezerwacji.');
    }

    // Pobierz pełne dane rezerwacji
    const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: session.user.id, status: 'PENDING' },
        include: { room: true, timeSlot: true }
    });

    if (!booking) {
        throw new Error('Nie znaleziono oczekującej rezerwacji do opłacenia.');
    }

    // Stwórz nową sesję płatności w Stripe
    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'p24'],
        line_items: [{
            price_data: {
                currency: 'pln',
                product_data: {
                    name: `Rezerwacja pokoju: ${booking.room.name}`,
                    description: `Termin: ${booking.timeSlot.date.toLocaleDateString('pl-PL')} o ${booking.timeSlot.startTime}`,
                },
                unit_amount: Math.round(booking.totalPrice * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking_success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking_cancelled=true`,
        metadata: {
            bookingId: booking.id,
        },
    });

    // Zaktualizuj rezerwację o ID nowej sesji Stripe
    await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: stripeSession.id },
    });

    // Przekieruj użytkownika do płatności
    if (stripeSession.url) {
        redirect(stripeSession.url);
    }
}

export async function updateUserProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Brak autoryzacji.');
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            phone,
        }
    });

    revalidatePath('/dashboard');
}