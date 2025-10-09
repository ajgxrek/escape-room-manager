import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const roomId = searchParams.get("roomId")
        const dateParam = searchParams.get("date")

        if (!roomId || !dateParam) {
            return NextResponse.json(
                { error: "Brak roomId lub date" },
                { status: 400 }
            )
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId }
        })

        if (!room) {
            return NextResponse.json(
                { error: "Pokój nie istnieje" },
                { status: 404 }
            )
        }

        const allTimes = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]

        const targetDate = new Date(`${dateParam}T12:00:00Z`);


        const bookedSlots = await prisma.timeSlot.findMany({
            where: {
                roomId,
                date: targetDate,
                isBooked: true
            },
            select: {
                startTime: true
            }
        })

        const bookedTimes = bookedSlots.map(slot => slot.startTime)

        const availableSlots = allTimes.map(time => ({
            time,
            available: !bookedTimes.includes(time)
        }))

        return NextResponse.json({ slots: availableSlots })

    } catch (error) {
        console.error("Błąd pobierania slotów:", error)
        return NextResponse.json(
            { error: "Wystąpił błąd serwera" },
            { status: 500 }
        )
    }
}