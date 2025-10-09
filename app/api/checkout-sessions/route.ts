// app/api/checkout-sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Musisz być zalogowany" }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, date, time, playerCount, customerName, customerEmail, customerPhone, notes, roomName, price } = body;

    // Używamy bezpiecznego tworzenia daty z poprzednich lekcji
    const targetDate = new Date(`${date}T12:00:00Z`);

    try {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            return NextResponse.json({ error: "Pokój nie istnieje" }, { status: 404 });
        }


        const [hours, minutes] = time.split(':');
        const startDateUTC = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), parseInt(hours), parseInt(minutes)));
        const endDateUTC = new Date(startDateUTC.getTime() + room.duration * 60000);
        const endTime = `${endDateUTC.getUTCHours().toString().padStart(2, '0')}:${endDateUTC.getUTCMinutes().toString().padStart(2, '0')}`;

        const timeSlot = await prisma.timeSlot.create({
            data: { roomId, date: targetDate, startTime: time, endTime, isBooked: true },
        });

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                roomId,
                timeSlotId: timeSlot.id,
                playerCount: parseInt(playerCount),
                totalPrice: price,
                status: 'PENDING',
                customerName, customerEmail, customerPhone, notes,
            },
        });

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'p24'],
            line_items: [{
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: `Rezerwacja pokoju: ${roomName}`,
                        description: `Termin: ${date} o godzinie ${time}`,
                    },
                    unit_amount: Math.round(price * 100), // Cena w groszach
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking_success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${room.slug}?booking_cancelled=true`,
            metadata: {
                bookingId: booking.id, // Przekazujemy ID naszej rezerwacji do Stripe
            },
        });

        await prisma.booking.update({
            where: { id: booking.id },
            data: { stripeSessionId: stripeSession.id },
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error("Błąd tworzenia sesji Stripe:", error);
        return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 });
    }
}