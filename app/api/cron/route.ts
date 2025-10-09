import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
    // Proste zabezpieczenie, żeby nikt obcy nie mógł uruchomić tej funkcji
    const cronSecret = request.headers.get('authorization')?.replace('Bearer ', '');
    if (cronSecret !== process.env.CRON_SECRET) {
        return new NextResponse('Brak autoryzacji.', { status: 401 });
    }

    try {
        // Obliczamy, jaki dzień będzie jutro
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const startOfTomorrow = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), 0, 0, 0));
        const endOfTomorrow = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), 23, 59, 59));

        // Szukamy w bazie wszystkich POTWIERDZONYCH rezerwacji na jutro
        const upcomingBookings = await prisma.booking.findMany({
            where: {
                status: 'CONFIRMED',
                timeSlot: {
                    date: {
                        gte: startOfTomorrow,
                        lte: endOfTomorrow,
                    },
                },
            },
            include: {
                room: true,
                timeSlot: true,
            },
        });

        // Jeśli nie ma rezerwacji, kończymy pracę
        if (upcomingBookings.length === 0) {
            return NextResponse.json({ message: 'Nie znaleziono rezerwacji na jutro do przypomnienia.' });
        }

        // Dla każdej znalezionej rezerwacji, wysyłamy e-mail
        for (const booking of upcomingBookings) {
            await resend.emails.send({
                from: 'Przypomnienie <onboarding@resend.dev>',
                to: booking.customerEmail,
                subject: `Przypomnienie o rezerwacji: ${booking.room.name}`,
                text: `Cześć ${booking.customerName},\n\nTo przyjazne przypomnienie o Twojej nadchodzącej rezerwacji pokoju "${booking.room.name}" jutro, czyli ${booking.timeSlot.date.toLocaleDateString('pl-PL', { timeZone: 'UTC' })}, o godzinie ${booking.timeSlot.startTime}.\n\nDo zobaczenia!`,
            });
        }

        return NextResponse.json({ success: true, sentEmails: upcomingBookings.length });

    } catch (error) {
        console.error("Błąd w zadaniu CRON:", error);
        return new NextResponse('Wystąpił błąd serwera.', { status: 500 });
    }
}