import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cancelBooking, retryPayment, updateUserProfile } from "./actions";
import type { Booking, Room, TimeSlot } from "@prisma/client";

type BookingWithDetails = Booking & {
    room: Room;
    timeSlot: TimeSlot;
};

async function getUserBookings(userId: string): Promise<BookingWithDetails[]> {
    const bookings = await prisma.booking.findMany({
        where: { userId: userId, NOT: { status: 'CANCELLED' } },
        include: { room: true, timeSlot: true },
        // Sortujemy najpierw po dacie (rosnąco), potem po godzinie (rosnąco)
        orderBy: [
            { timeSlot: { date: 'asc' } },
            { timeSlot: { startTime: 'asc' } }
        ]
    });
    // @ts-ignore
    return bookings;
}

export default async function DashboardPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/api/auth/signin?callbackUrl=/dashboard');
    }

    const resolvedSearchParams = await searchParams;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const allBookings = await getUserBookings(session.user.id); // Pobieramy WSZYSTKIE rezerwacje

    const profileStatus = resolvedSearchParams?.status;
    const bookingSuccess = resolvedSearchParams?.booking_success;
    const bookingCancelled = resolvedSearchParams?.booking_cancelled;

    // --- NOWA LOGIKA: Dzielimy rezerwacje na przyszłe i przeszłe ---
    const now = new Date();
    // Ustawiamy godzinę na 00:00:00.000, aby porównywać tylko daty
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const upcomingBookings = allBookings.filter(booking =>
        new Date(booking.timeSlot.date) >= startOfToday
    );
    const pastBookings = allBookings.filter(booking =>
        new Date(booking.timeSlot.date) < startOfToday
    ).sort((a, b) => new Date(b.timeSlot.date).getTime() - new Date(a.timeSlot.date).getTime()); // Sortuj historię od najnowszej

    // Funkcja do renderowania pojedynczej karty rezerwacji (aby uniknąć powtarzania kodu)
    const renderBookingCard = (booking: BookingWithDetails) => (
        <div key={booking.id} className="bg-white p-6 border-[3px] border-black rounded-[20px] sm:flex justify-between items-center space-y-4 sm:space-y-0">
            <div>
                <h2 className="text-20-medium">{booking.room.name}</h2>
                <p className="text-16-medium text-black-300 mt-1">
                    {new Date(booking.timeSlot.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                    , godz. {booking.timeSlot.startTime}
                </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
                {booking.status === 'PENDING' && new Date(booking.timeSlot.date) >= startOfToday && ( // Pokaż "Zapłać" tylko dla przyszłych
                    <form action={retryPayment}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button type="submit" className="font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full">Zapłać</button>
                    </form>
                )}
                <span className={`px-4 py-2 rounded-full font-semibold text-white ${
                    booking.status === 'CONFIRMED' ? 'bg-green-500' :
                        booking.status === 'PENDING' ? 'bg-yellow-500' :
                            'bg-gray-500' // Dodajemy styl dla COMPLETED lub innych statusów
                }`}>
                    {booking.status === 'CONFIRMED' ? 'Potwierdzona' :
                        booking.status === 'PENDING' ? 'Oczekująca' :
                            booking.status} {/* Pokaż status słownie */}
                </span>
                {booking.status !== 'CANCELLED' && new Date(booking.timeSlot.date) >= startOfToday && ( // Pokaż "Anuluj" tylko dla przyszłych
                    <form action={cancelBooking}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button type="submit" className="font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full">Anuluj</button>
                    </form>
                )}
            </div>
        </div>
    );

    return (
        <div className="section_container min-h-screen">
            <div className="mb-12">
                <h1 className="text-30-bold mb-8">Mój Profil</h1>
                <div className="bg-white p-6 border-[3px] border-black rounded-[20px]">
                    <form action={updateUserProfile} className="space-y-4">
                        {/* ... formularz profilu bez zmian ... */}
                    </form>
                    {profileStatus === 'success' && (<p className="text-center text-green-500 font-semibold mt-4">Zmiany w profilu zapisano pomyślnie!</p>)}
                    {profileStatus === 'error' && (<p className="text-center text-red-500 font-semibold mt-4">Wystąpił błąd podczas zapisywania zmian.</p>)}
                </div>
            </div>

            {/* Komunikaty o statusie rezerwacji */}
            {bookingSuccess && (<div className="bg-green-100 border-[3px] border-green-500 text-green-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja i płatność zakończyły się sukcesem!</div>)}
            {bookingCancelled && (<div className="bg-yellow-100 border-[3px] border-yellow-500 text-yellow-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja została anulowana.</div>)}

            {/* --- SEKCJA NADCHODZĄCYCH REZERWACJI --- */}
            <div className="mb-12">
                <h2 className="text-30-bold mb-8">Nadchodzące Rezerwacje</h2>
                {upcomingBookings.length === 0 ? (
                    <p className="text-center text-black-300">Nie masz żadnych nadchodzących rezerwacji.</p>
                ) : (
                    <div className="space-y-6">
                        {upcomingBookings.map(renderBookingCard)}
                    </div>
                )}
            </div>

            {/* --- SEKCJA HISTORII REZERWACJI --- */}
            <div>
                <h2 className="text-30-bold mb-8">Historia Rezerwacji</h2>
                {pastBookings.length === 0 ? (
                    <p className="text-center text-black-300">Brak historii rezerwacji.</p>
                ) : (
                    <div className="space-y-6">
                        {pastBookings.map(renderBookingCard)}
                    </div>
                )}
            </div>
        </div>
    )
}
