import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { error: "Musisz być zalogowany" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            roomId,
            date,
            time,
            playerCount,
            customerName,
            customerEmail,
            customerPhone,
            notes,
        } = body

        if (!roomId || !date || !time || !playerCount || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: "Brakuje wymaganych pól" },
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

        const [hours, minutes] = time.split(':')
        const startDate = new Date(`${date}T${time}:00`)
        const endDate = new Date(startDate.getTime() + room.duration * 60000)
        const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`

        const existingSlot = await prisma.timeSlot.findFirst({
            where: {
                roomId,
                date: new Date(date),
                startTime: time,
                isBooked: true
            }
        })

        if (existingSlot) {
            return NextResponse.json(
                { error: "Ten termin jest już zajęty" },
                { status: 409 }
            )
        }

        const timeSlot = await prisma.timeSlot.create({
            data: {
                roomId,
                date: new Date(date),
                startTime: time,
                endTime,
                isBooked: true,
            }
        })

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id as string,
                roomId,
                timeSlotId: timeSlot.id,
                playerCount: parseInt(playerCount),
                totalPrice: room.price,
                customerName,
                customerEmail,
                customerPhone,
                notes: notes || null,
                status: "CONFIRMED",
            },
            include: {
                room: true,
                timeSlot: true,
            }
        })

        return NextResponse.json(
            {
                success: true,
                booking
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Błąd podczas tworzenia rezerwacji:", error)
        return NextResponse.json(
            { error: "Wystąpił błąd serwera" },
            { status: 500 }
        )
    }
}

