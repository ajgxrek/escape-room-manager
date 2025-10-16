import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

async function deleteRoom(formData: FormData) {
    'use server'
    const id = formData.get('id') as string;
    if (!id) {
        throw new Error('Brak ID pokoju');
    }
    await prisma.booking.deleteMany({ where: { roomId: id } });
    await prisma.timeSlot.deleteMany({ where: { roomId: id } });
    await prisma.room.delete({
        where: { id },
    });
    revalidatePath('/admin');
}

async function cancelBookingAsAdmin(formData: FormData) {
    'use server'
    const bookingId = formData.get('bookingId') as string;
    if (!bookingId) {
        throw new Error('Brak ID rezerwacji');
    }
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { timeSlotId: true, status: true }
    });
    if (!booking) {
        throw new Error('Nie znaleziono rezerwacji.');
    }
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
    });
    if (booking.status !== 'CANCELLED') {
        await prisma.timeSlot.update({
            where: { id: booking.timeSlotId },
            data: { isBooked: false }
        });
    }
    revalidatePath('/admin');
}

async function getRooms() {
    const rooms = await prisma.room.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return rooms
}

// ZMIANA TUTAJ: Nowa logika pobierania rezerwacji
async function getTodaysBookings() {
    // Ustawiamy początek i koniec dzisiejszego dnia w strefie UTC
    const today = new Date();
    const startOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
    const endOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

    const bookings = await prisma.booking.findMany({
        where: {
            timeSlot: {
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                }
            }
        },
        include: {
            room: true,
            timeSlot: true,
        },
        orderBy: {
            timeSlot: {
                startTime: 'asc' // Sortuj po godzinie rozpoczęcia
            }
        }
    })
    return bookings
}

export default async function AdminDashboardPage() {
    const rooms = await getRooms()
    const bookings = await getTodaysBookings() // ZMIANA TUTAJ: Wywołujemy nową funkcję

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="section_container min-h-screen">
            {/* SEKCJA ZARZĄDZANIA POKOJAMI (bez zmian) */}
            <div className="mb-12">
                <div className="flex-between mb-8">
                    <h1 className="text-30-bold">Zarządzaj Pokojami</h1>
                    <Link href="/admin/rooms/new">
                        <button className="startup-form_btn max-w-xs">Dodaj nowy pokój</button>
                    </Link>
                </div>
                <div className="overflow-x-auto bg-white p-4 border-[3px] border-black rounded-[20px]">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b-[3px] border-black">
                            <th className="p-4">Nazwa Pokoju</th>
                            <th className="p-4">Cena</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rooms.map((room) => (
                            <tr key={room.id} className="border-b border-gray-200">
                                <td className="p-4 font-semibold">{room.name}</td>
                                <td className="p-4">{room.price} PLN</td>
                                <td className="p-4">{room.isActive ? 'Aktywny' : 'Nieaktywny'}</td>
                                <td className="p-4">
                                    <div className="flex justify-end items-center gap-4">
                                        <Link href={`/admin/rooms/edit/${room.id}`}>
                                            <span className="text-blue-600 hover:underline">Edytuj</span>
                                        </Link>
                                        <form action={deleteRoom}>
                                            <input type="hidden" name="id" value={room.id} />
                                            <button type="submit" className="text-red-600 hover:underline">
                                                Usuń
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SEKCJA ZARZĄDZANIA REZERWACJAMI */}
            <div>
                <h1 className="text-30-bold mb-8">Rezerwacje na Dziś</h1> {/* ZMIANA TUTAJ: Nowy nagłówek */}
                <div className="overflow-x-auto bg-white p-4 border-[3px] border-black rounded-[20px]">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b-[3px] border-black">
                            <th className="p-4">Godzina</th>
                            <th className="p-4">Klient</th>
                            <th className="p-4">Pokój</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.length > 0 ? bookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-200">
                                <td className="p-4 font-semibold">{booking.timeSlot.startTime}</td>
                                <td className="p-4">
                                    <div>{booking.customerName}</div>
                                    <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                                </td>
                                <td className="p-4">{booking.room.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {booking.status !== 'CANCELLED' && (
                                        <form action={cancelBookingAsAdmin}>
                                            <input type="hidden" name="bookingId" value={booking.id} />
                                            <button type="submit" className="text-red-600 hover:underline text-sm">
                                                Anuluj
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-500">
                                    Brak rezerwacji na dzisiaj.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

