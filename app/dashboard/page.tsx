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
        orderBy: [
            { timeSlot: { date: 'asc' } },
            { timeSlot: { startTime: 'asc' } }
        ]
    });

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
    const allBookings = await getUserBookings(session.user.id);

    const profileStatus = resolvedSearchParams?.status;
    const bookingSuccess = resolvedSearchParams?.booking_success;
    const bookingCancelled = resolvedSearchParams?.booking_cancelled;

    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const upcomingBookings = allBookings.filter(booking =>
        new Date(booking.timeSlot.date) >= startOfToday
    );
    const pastBookings = allBookings.filter(booking =>
        new Date(booking.timeSlot.date) < startOfToday
    ).sort((a, b) => new Date(b.timeSlot.date).getTime() - new Date(a.timeSlot.date).getTime());

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
                {booking.status === 'PENDING' && new Date(booking.timeSlot.date) >= startOfToday && (
                    <form action={retryPayment}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button type="submit" className="font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full">Zapłać</button>
                    </form>
                )}
                <span className={`px-4 py-2 rounded-full font-semibold text-white ${
                    booking.status === 'CONFIRMED' ? 'bg-green-500' :
                        booking.status === 'PENDING' ? 'bg-yellow-500' :
                            'bg-gray-500'
                }`}>
                    {booking.status === 'CONFIRMED' ? 'Potwierdzona' :
                        booking.status === 'PENDING' ? 'Oczekująca' :
                            booking.status}
                </span>
                {booking.status !== 'CANCELLED' && new Date(booking.timeSlot.date) >= startOfToday && (
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
                        <div>
                            <label htmlFor="name" className="font-semibold">Imię i nazwisko</label>
                            <input type="text" name="name" defaultValue={user?.name ?? ''} className="w-full mt-1 p-2 border-[3px] border-black rounded-[12px]" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="font-semibold">Numer telefonu</label>
                            <input type="tel" name="phone" defaultValue={user?.phone ?? ''} className="w-full mt-1 p-2 border-[3px] border-black rounded-[12px]" placeholder="Twój numer telefonu" />
                        </div>
                        <div>
                            <label className="font-semibold">E-mail</label>
                            <p className="text-black-300 mt-1">{user?.email}</p>
                        </div>
                        <div className="text-center pt-4">
                            <button type="submit" className="startup-form_btn max-w-xs">Zapisz zmiany</button>
                        </div>
                    </form>
                    {profileStatus === 'success' && (<p className="text-center text-green-500 font-semibold mt-4">Zmiany w profilu zapisano pomyślnie!</p>)}
                    {profileStatus === 'error' && (<p className="text-center text-red-500 font-semibold mt-4">Wystąpił błąd podczas zapisywania zmian.</p>)}
                </div>
            </div>
            {bookingSuccess && (<div className="bg-green-100 border-[3px] border-green-500 text-green-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja i płatność zakończyły się sukcesem!</div>)}
            {bookingCancelled && (<div className="bg-yellow-100 border-[3px] border-yellow-500 text-yellow-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja została anulowana.</div>)}
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

