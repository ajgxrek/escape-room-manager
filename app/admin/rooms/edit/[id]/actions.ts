'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateRoom(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const duration = parseInt(formData.get('duration') as string)
    const minPlayers = parseInt(formData.get('minPlayers') as string)
    const maxPlayers = parseInt(formData.get('maxPlayers') as string)
    const isActive = formData.get('isActive') === 'on' // Checkbox zwraca 'on' lub null

    if (!id || !name || !slug || !price) {
        throw new Error('Brakuje wymaganych pól.')
    }

    await prisma.room.update({
        where: { id },
        data: {
            name,
            slug,
            price,
            description,
            duration,
            minPlayers,
            maxPlayers,
            isActive,
            // Na razie pomijamy aktualizację zdjęć i trudności
        },
    })

    // Odśwież widok listy pokoi, aby pokazać nowe dane
    revalidatePath('/admin')
    // Przekieruj admina z powrotem na listę pokoi
    redirect('/admin')
}
