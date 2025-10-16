'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRoom(formData: FormData) {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const duration = parseInt(formData.get('duration') as string)
    const minPlayers = parseInt(formData.get('minPlayers') as string)
    const maxPlayers = parseInt(formData.get('maxPlayers') as string)

    if (!name || !slug || !price) {
        throw new Error('Brakuje wymaganych pól.')
    }

    await prisma.room.create({
        data: {
            name,
            slug,
            price,
            description,
            duration,
            minPlayers,
            maxPlayers,
            difficulty: 'MEDIUM', // Przykładowo, na razie ustawiamy na sztywno
            images: [], // Na razie pusta tablica
            isActive: true, // Domyślnie pokój jest aktywny
        },
    })

    // Odśwież dane na stronie z listą pokoi
    revalidatePath('/admin')
    // Przekieruj admina z powrotem do listy
    redirect('/admin')
}
