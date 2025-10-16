'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateRoom(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) {
        throw new Error('Brak ID pokoju.')
    }

    // Odczytujemy wszystkie dane z formularza
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const duration = parseInt(formData.get('duration') as string)
    const minPlayers = parseInt(formData.get('minPlayers') as string)
    const maxPlayers = parseInt(formData.get('maxPlayers') as string)

    // Checkbox jest specyficzny: jeśli jest zaznaczony, ma wartość "on", jeśli nie, jest `null`
    const isActive = formData.get('isActive') === 'on'

    // Odczytujemy listę zdjęć z ukrytego pola
    const imagesString = formData.get('images') as string;
    // Przekształcamy string "url1,url2,url3" w tablicę
    const images = imagesString ? imagesString.split(',') : [];

    // Aktualizujemy pokój w bazie danych o wszystkie nowe dane
    await prisma.room.update({
        where: { id },
        data: {
            name,
            slug,
            price,
            description,
            images,
            duration,
            minPlayers,
            maxPlayers,
            isActive,
        },
    })

    revalidatePath('/admin')
    revalidatePath(`/room/${slug}`) // Odświeżamy też publiczną stronę pokoju
    redirect('/admin')
}