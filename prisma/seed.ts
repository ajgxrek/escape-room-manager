import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seedowanie bazy danych...')

    // Usuń stare pokoje
    await prisma.room.deleteMany()

    // Dodaj przykładowe pokoje z wieloma zdjęciami
    await prisma.room.createMany({
        data: [
            {
                name: 'Zagadka Faraona',
                slug: 'zagadka-faraona',
                description: 'Przenieś się do starożytnego Egiptu i rozwiąż tajemnicę piramidy. Czeka Cię mnóstwo zagadek, pułapek i niesamowita atmosfera. Zespół archeologów zaginął podczas ekspedycji. Twoim zadaniem jest odnaleźć skarb Faraona zanim świątynia się zawali!',
                shortDesc: 'Starożytny Egipt pełen tajemnic',
                difficulty: 'MEDIUM',
                duration: 60,
                minPlayers: 2,
                maxPlayers: 6,
                price: 150,
                images: [
                    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
                    'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800',
                    'https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800'
                ],
                isActive: true,
            },
            {
                name: 'Laboratorium Szaleńca',
                slug: 'laboratorium-szalenca',
                description: 'Obudź się w mrocznym laboratorium szalonego naukowca. Musisz uciec zanim będzie za późno! Horror i dreszczyk emocji gwarantowany. Eksperymenty wymknęły się spod kontroli, a Ty jesteś następnym obiektem badań...',
                shortDesc: 'Horror i dreszczyk emocji',
                difficulty: 'HARD',
                duration: 90,
                minPlayers: 3,
                maxPlayers: 8,
                price: 200,
                images: [
                    'https://images.unsplash.com/photo-1530819568329-97653eafbbfa?w=800',
                    'https://images.unsplash.com/photo-1581093458791-9d42e2c6d06c?w=800',
                    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'
                ],
                isActive: true,
            },
            {
                name: 'Szkoła Magii',
                slug: 'szkola-magii',
                description: 'Czy masz w sobie moc czarodzieja? Przejdź przez magiczne próby i zdobądź certyfikat maga! Idealne dla rodzin z dziećmi. W tajemniczej szkole magii musisz odblokować starożytne zaklęcia i ukończyć egzamin czarodziejski.',
                shortDesc: 'Magiczne wyzwanie dla całej rodziny',
                difficulty: 'EASY',
                duration: 60,
                minPlayers: 2,
                maxPlayers: 5,
                price: 120,
                images: [
                    'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800',
                    'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
                    'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=800'
                ],
                isActive: true,
            },
        ],
    })

    console.log('✅ Seedowanie zakończone!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })