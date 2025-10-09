import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cancelBooking, retryPayment, updateUserProfile } from "./actions";

async function getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
        where: { userId: userId, NOT: { status: 'CANCELLED' } },
        include: { room: true, timeSlot: true },
        orderBy: { timeSlot: { date: 'desc' } }
    });
    return bookings;
}

// ZMIANA TUTAJ: Dodajemy `searchParams` do propsów strony
export default async function DashboardPage({ searchParams }: { searchParams: { status?: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/api/auth/signin?callbackUrl=/dashboard');
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const bookings = await getUserBookings(session.user.id);
    const status = searchParams.status; // Odczytujemy status z URL

    return (
        <div className="section_container min-h-screen">

            <div className="mb-12">
                <h1 className="text-30-bold mb-8">Mój Profil</h1>
                <div className="bg-white p-6 border-[3px] border-black rounded-[20px]">
                    <form action={updateUserProfile} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="font-semibold">Imię i nazwisko</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={user?.name ?? ''}
                                className="w-full mt-1 p-2 border-[3px] border-black rounded-[12px]"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="font-semibold">Numer telefonu</label>
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={user?.phone ?? ''}
                                className="w-full mt-1 p-2 border-[3px] border-black rounded-[12px]"
                                placeholder="Twój numer telefonu"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">E-mail</label>
                            <p className="text-black-300 mt-1">{user?.email}</p>
                        </div>
                        {/* ZMIANA TUTAJ: Wyśrodkowany przycisk */}
                        <div className="text-center pt-4">
                            <button type="submit" className="startup-form_btn max-w-xs">
                                Zapisz zmiany
                            </button>
                        </div>
                    </form>

                    {/* ZMIANA TUTAJ: Logika wyświetlania komunikatu */}
                    {status === 'success' && (
                        <p className="text-center text-green-500 font-semibold mt-4">
                            Zmiany zapisano pomyślnie!
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="text-center text-red-500 font-semibold mt-4">
                            Wystąpił błąd podczas zapisywania zmian.
                        </p>
                    )}
                </div>
            </div>

            <h2 className="text-30-bold mb-8">Moje Rezerwacje</h2>
            {bookings.length === 0 ? (
                <p className="text-center text-black-300">Nie masz jeszcze żadnych aktywnych rezerwacji.</p>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 border-[3px] border-black rounded-[20px] sm:flex justify-between items-center space-y-4 sm:space-y-0">
                            <div>
                                <h2 className="text-20-medium">{booking.room.name}</h2>
                                <p className="text-16-medium text-black-300 mt-1">
                                    {new Date(booking.timeSlot.date).toLocaleDateString('pl-PL', {
                                        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
                                    })}
                                    , godz. {booking.timeSlot.startTime}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                {booking.status === 'PENDING' && (
                                    <form action={retryPayment}>
                                        <input type="hidden" name="bookingId" value={booking.id} />
                                        <button type="submit" className="font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full">
                                            Zapłać
                                        </button>
                                    </form>
                                )}
                                <span className={`px-4 py-2 rounded-full font-semibold text-white ${
                                    booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}>
                                    {booking.status === 'CONFIRMED' ? 'Potwierdzona' : 'Oczekująca'}
                                </span>
                                <form action={cancelBooking}>
                                    <input type="hidden" name="bookingId" value={booking.id} />
                                    <button type="submit" className="font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full">
                                        Anuluj
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}