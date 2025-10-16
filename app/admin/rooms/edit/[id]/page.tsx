import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoomEditForm from "./RoomEditForm"; // Stworzymy ten komponent w następnym kroku

async function getRoom(id: string) {
    const room = await prisma.room.findUnique({
        where: { id },
    });
    if (!room) {
        notFound();
    }
    return room;
}

export default async function EditRoomPage({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);

    return (
        <div className="section_container">
            <h1 className="text-30-bold mb-8">Edytuj pokój: {room.name}</h1>

            {/* Przekazujemy dane pokoju do formularza edycji */}
            <RoomEditForm room={room} />
        </div>
    );
}
