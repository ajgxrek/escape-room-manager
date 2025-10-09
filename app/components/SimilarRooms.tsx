import RoomCard from "./RoomCard"

type SimilarRoomsProps = {
    rooms: Array<{
        id: string
        name: string
        slug: string
        description: string
        shortDesc: string | null
        difficulty: string
        duration: number
        minPlayers: number
        maxPlayers: number
        price: number
        images: string[]
    }>
}

export default function SimilarRooms({ rooms }: SimilarRoomsProps) {
    if (rooms.length === 0) return null

    return (
        <section className="section_container">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-30-semibold mb-7 text-center">
                    Inne pokoje, które mogą Cię zainteresować
                </h2>
                <ul className="card_grid">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </ul>
            </div>
        </section>
    )
}