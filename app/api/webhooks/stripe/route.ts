// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        console.log(`Webhook otrzymany dla rezerwacji o ID: ${bookingId}`);

        if (bookingId) {
            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CONFIRMED' },
                include: {
                    room: true,
                    timeSlot: true,
                }
            });


            console.log('Dane rezerwacji do wysłania e-maila:', updatedBooking);

            try {
                await resend.emails.send({
                    from: 'Escape Room <onboarding@resend.dev>',
                    to: updatedBooking.customerEmail,
                    subject: `Potwierdzenie rezerwacji pokoju: ${updatedBooking.room.name}`,
                    text: `Cześć ${updatedBooking.customerName},\n\nTwoja rezerwacja na ${updatedBooking.timeSlot.date.toLocaleDateString('pl-PL')} o godzinie ${updatedBooking.timeSlot.startTime} została potwierdzona.\n\nDziękujemy!`,
                });

                console.log(`E-mail pomyślnie przekazany do Resend dla: ${updatedBooking.customerEmail}`);

            } catch (emailError) {
                console.error("Błąd podczas próby wysłania e-maila:", emailError);
            }
        }
    }

    return new NextResponse(null, { status: 200 })
}