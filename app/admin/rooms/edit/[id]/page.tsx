import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoomEditForm from "./RoomEditForm";

async function getRoom(id: string) {
    const room = await prisma.room.findUnique({
        where: { id },
    });
    if (!room) {
        notFound();
    }
    return room;
}


export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const room = await getRoom(resolvedParams.id);

    return (
        <div className="section_container">
            <h1 className="text-30-bold mb-8">Edytuj Pokój: {room.name}</h1>
            <RoomEditForm room={room} />
        </div>
    );
}

