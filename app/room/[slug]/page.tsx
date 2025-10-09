import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ImageGallery from "@/app/components/ImageGallery"
import RoomDetails from "@/app/components/RoomDetails"
import RoomInfo from "@/app/components/RoomInfo"
import SimilarRooms from "@/app/components/SimilarRooms"

async function getRoom(slug: string) {
    const room = await prisma.room.findUnique({
        where: { slug, isActive: true }
    })

    if (!room) return null
    return room
}

async function getSimilarRooms(currentRoomId: string, difficulty: string) {
    const rooms = await prisma.room.findMany({
        where: {
            id: { not: currentRoomId },
            isActive: true,
            OR: [
                { difficulty },
                { difficulty: { not: difficulty } }
            ]
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
    })
    return rooms
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const room = await getRoom(slug)

    if (!room) {
        notFound()
    }

    const similarRooms = await getSimilarRooms(room.id, room.difficulty)

    return (
        <div className="min-h-screen">
            <ImageGallery images={room.images} roomName={room.name} />

            <section className="section_container">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-[48px] font-extrabold text-center mb-4">
                        {room.name}
                    </h1>
                    <p className="text-20-medium text-center text-black-300 mb-10">
                        {room.shortDesc}
                    </p>

                    <RoomDetails
                        duration={room.duration}
                        minPlayers={room.minPlayers}
                        maxPlayers={room.maxPlayers}
                        difficulty={room.difficulty}
                    />

                    <div className="bg-white p-8 rounded-[20px] border-[5px] border-black shadow-200 mb-10">
                        <h2 className="text-30-semibold mb-4">O pokoju</h2>
                        <p className="text-16-medium text-black-100 leading-relaxed">
                            {room.description}
                        </p>
                    </div>

                    <RoomInfo />

                    <div className="bg-white p-8 rounded-[20px] border-[5px] border-black shadow-200 text-center mb-10">
                        <p className="text-20-medium mb-4">Cena za sesję</p>
                        <p className="text-[48px] font-black mb-6">{room.price} PLN</p>
                        <Link href={`/booking/${room.slug}`}>
                            <button className="startup-form_btn max-w-md mx-auto">
                                Zarezerwuj teraz
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <SimilarRooms rooms={similarRooms} />
        </div>
    )
}