type RoomDetailsProps = {
    duration: number
    minPlayers: number
    maxPlayers: number
    difficulty: string
}

export default function RoomDetails({ duration, minPlayers, maxPlayers, difficulty }: RoomDetailsProps) {
    return (
        <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[20px] border-[5px] border-black shadow-200 text-center">
                <p className="text-16-medium text-black-300 mb-2">Czas trwania</p>
                <p className="text-24-black">{duration} min</p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border-[5px] border-black shadow-200 text-center">
                <p className="text-16-medium text-black-300 mb-2">Liczba graczy</p>
                <p className="text-24-black">{minPlayers}-{maxPlayers}</p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border-[5px] border-black shadow-200 text-center">
                <p className="text-16-medium text-black-300 mb-2">Trudność</p>
                <p className="text-24-black">{difficulty}</p>
            </div>
            <div className="bg-white p-6 rounded-[20px] border-[5px] border-black shadow-200 text-center">
                <p className="text-16-medium text-black-300 mb-2">Języki</p>
                <p className="text-24-black">PL / EN</p>
            </div>
        </div>
    )
}