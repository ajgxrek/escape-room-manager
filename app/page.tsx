import { prisma } from "@/lib/prisma"
import RoomCard from "./components/RoomCard"

async function getRooms() {
    const rooms = await prisma.room.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    })
    return rooms
}

export default async function Home() {
    const rooms = await getRooms()

    return (
        <>
            {/* Hero Section */}
            <section className="pink_container">
                <h1 className="heading">
                    Odkryj Niesamowite <br />
                    Przygody Escape Room
                </h1>
                <p className="sub-heading">
                    Rozwiązuj zagadki, uciekaj z pokoi, twórz wspomnienia
                </p>
            </section>

            {/* Rooms Section */}
            <section className="section_container">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <h2 className="text-30-semibold mb-6">Dlaczego my?</h2>
                    <p className="text-16-medium text-black-100">
                        Jesteśmy największym escape roomem w mieście! Oferujemy unikalne pokoje tematyczne,
                        które przeniosą Cię do zupełnie innego świata. Nasz zespół dba o każdy detal,
                        aby zapewnić niezapomniane wrażenia.
                    </p>
                </div>

                <h2 className="text-30-semibold mb-7">Nasze pokoje</h2>

                {rooms.length > 0 ? (
                    <ul className="card_grid">
                        {rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </ul>
                ) : (
                    <p className="no-result">
                        Brak dostępnych pokoi w tym momencie.
                    </p>
                )}
            </section>

        </>
    )
}