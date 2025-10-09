import Image from "next/image"
import Link from "next/link"

type RoomCardProps = {
    room: {
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
    }
}

export default function RoomCard({ room }: RoomCardProps) {
    return (
        <li className="startup-card group">
            {room.images && room.images.length > 0 && (
                <Image
                    src={room.images[0]}
                    alt={room.name}
                    width={800}
                    height={164}
                    className="startup-card_img"
                />
            )}

            <div className="flex-between mt-5">
                <p className="startup-card_date">
                    {room.duration} min
                </p>
                <div className="flex gap-1.5">
                    <span className="category-tag">{room.difficulty}</span>
                </div>
            </div>

            <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/room/${room.slug}`}>
                        <h3 className="text-26-semibold line-clamp-1">
                            {room.name}
                        </h3>
                    </Link>
                </div>
            </div>

            <p className="startup-card_desc">
                {room.shortDesc || room.description.substring(0, 100)}...
            </p>

            <div className="flex-between gap-3 mt-5">
        <span className="text-16-medium">
          {room.minPlayers}-{room.maxPlayers} graczy
        </span>
                <span className="text-16-medium font-bold">
          {room.price} PLN
        </span>
            </div>

            <Link href={`/room/${room.slug}`} className="mt-5 block">
                <button className="startup-card_btn w-full">
                    Zobacz szczegóły
                </button>
            </Link>
        </li>
    )
}