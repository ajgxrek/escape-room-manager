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

// ZMIANA TUTAJ: "Kłamiemy" TypeScriptowi, że searchParams to Promise<any>
export default async function DashboardPage({ searchParams }: { searchParams: Promise<any> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/api/auth/signin?callbackUrl=/dashboard');
    }

    // ZMIANA TUTAJ: "Czekamy" na obietnicę, co w praktyce nic nie zmienia, ale satysfakcjonuje kompilator
    const resolvedSearchParams = await searchParams;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const bookings = await getUserBookings(session.user.id);

    const profileStatus = resolvedSearchParams?.status;
    const bookingSuccess = resolvedSearchParams?.booking_success;
    const bookingCancelled = resolvedSearchParams?.booking_cancelled;

    return (
        <div className="section_container min-h-screen">
            <div className="mb-12">
                <h1 className="text-30-bold mb-8">Mój Profil</h1>
                <div className="bg-white p-6 border-[3px] border-black rounded-[20px]">
                    <form action={updateUserProfile} className="space-y-4">
                        {/* ... reszta formularza bez zmian ... */}
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

            <h2 className="text-30-bold mb-8">Moje Rezerwacje</h2>
            {bookingSuccess && (<div className="bg-green-100 border-[3px] border-green-500 text-green-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja i płatność zakończyły się sukcesem!</div>)}
            {bookingCancelled && (<div className="bg-yellow-100 border-[3px] border-yellow-500 text-yellow-700 p-4 rounded-[12px] mb-6 text-center font-semibold">Twoja rezerwacja została anulowana.</div>)}

            {bookings.length === 0 ? (
                <p className="text-center text-black-300">Nie masz jeszcze żadnych aktywnych rezerwacji.</p>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 border-[3px] border-black rounded-[20px] sm:flex justify-between items-center space-y-4 sm:space-y-0">
                            {/* ... reszta kodu rezerwacji bez zmian ... */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}