"use client"

import type { Room } from "@prisma/client"
import { updateRoom } from "./actions"

type RoomEditFormProps = {
    room: Room
}

export default function RoomEditForm({ room }: RoomEditFormProps) {
    return (
        // ZMIANA TUTAJ: Podłączamy naszą akcję serwera do formularza
        <form action={updateRoom} className="space-y-6 max-w-2xl mx-auto">
            {/* Musimy przekazać ID pokoju do akcji, aby wiedziała, co aktualizować */}
            <input type="hidden" name="id" value={room.id} />

            <div>
                <label htmlFor="name" className="startup-form_label">Nazwa pokoju</label>
                <input type="text" name="name" required defaultValue={room.name} className="w-full startup-form_input" />
            </div>
            <div>
                <label htmlFor="slug" className="startup-form_label">Slug</label>
                <input type="text" name="slug" required defaultValue={room.slug} className="w-full startup-form_input" />
            </div>
            <div>
                <label htmlFor="price" className="startup-form_label">Cena</label>
                <input type="number" step="0.01" name="price" required defaultValue={room.price} className="w-full startup-form_input" />
            </div>
            <div>
                <label htmlFor="description" className="startup-form_label">Opis</label>
                <textarea name="description" required defaultValue={room.description} className="w-full startup-form_textarea" rows={6} />
            </div>
            <div>
                <label htmlFor="duration" className="startup-form_label">Czas trwania (min)</label>
                <input type="number" name="duration" required defaultValue={room.duration} className="w-full startup-form_input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="minPlayers" className="startup-form_label">Min. graczy</label>
                    <input type="number" name="minPlayers" required defaultValue={room.minPlayers} className="w-full startup-form_input" />
                </div>
                <div>
                    <label htmlFor="maxPlayers" className="startup-form_label">Max. graczy</label>
                    <input type="number" name="maxPlayers" required defaultValue={room.maxPlayers} className="w-full startup-form_input" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    defaultChecked={room.isActive}
                    className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="font-semibold">Pokój jest aktywny i widoczny dla klientów</label>
            </div>
            <div className="pt-4">
                <button type="submit" className="startup-form_btn">
                    Zapisz zmiany
                </button>
            </div>
        </form>
    )
}

