import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import BookingForm from "@/app/components/BookingForm"

async function getRoom(slug: string) {
    const room = await prisma.room.findUnique({
        where: { slug, isActive: true }
    })
    if (!room) return null
    return room
}

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
    const session = await auth()
    const { slug } = await params
    const room = await getRoom(slug)

    if (!room) {
        notFound()
    }

    // Upewniamy się, że sesja i użytkownik istnieją, zanim pójdziemy dalej
    if (!session?.user?.id) {
        redirect(`/api/auth/signin?callbackUrl=/booking/${slug}`)
    }

    // ZMIANA TUTAJ: Pobieramy pełne dane zalogowanego użytkownika
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    return (
        <div className="min-h-screen py-10">
            <section className="section_container">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-30-semibold mb-2 text-center">Rezerwacja pokoju</h1>
                    <h2 className="text-26-semibold mb-10 text-center text-primary">{room.name}</h2>

                    {/* Sekcja z detalami pokoju - bez zmian */}
                    <div className="bg-white p-8 rounded-[20px] border-[5px] border-black shadow-200 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-black-300 mb-1">Czas trwania</p>
                                <p className="text-20-medium">{room.duration} min</p>
                            </div>
                            <div>
                                <p className="text-black-300 mb-1">Cena</p>
                                <p className="text-20-medium">{room.price} PLN</p>
                            </div>
                            <div>
                                <p className="text-black-300 mb-1">Min. graczy</p>
                                <p className="text-20-medium">{room.minPlayers}</p>
                            </div>
                            <div>
                                <p className="text-black-300 mb-1">Max. graczy</p>
                                <p className="text-20-medium">{room.maxPlayers}</p>
                            </div>
                        </div>
                    </div>

                    <BookingForm
                        room={room}
                        userId={session.user.id}
                        userEmail={session.user.email as string}
                        userName={session.user.name as string}
                        // ZMIANA TUTAJ: Przekazujemy numer telefonu do formularza
                        userPhone={user?.phone || null}
                    />
                </div>
            </section>
        </div>
    )
}