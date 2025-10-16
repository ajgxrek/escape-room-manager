"use client"
import type { Room } from "@prisma/client"
import { updateRoom } from "./actions"
import ImageUploader from "@/app/admin/components/ImageUploader"

export default function RoomEditForm({ room }: { room: Room }) {
    return (
        <form action={updateRoom} className="space-y-6 max-w-2xl mx-auto">
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

            {/* Dodajemy komponent do zarządzania zdjęciami */}
            <ImageUploader existingImages={room.images} />

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
            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        defaultChecked={room.isActive}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                </div>
                <div className="ml-3 text-sm leading-6">
                    <label htmlFor="isActive" className="font-semibold text-gray-900">Pokój jest aktywny i widoczny dla klientów</label>
                </div>
            </div>
            <div className="pt-4">
                <button type="submit" className="startup-form_btn">
                    Zapisz zmiany
                </button>
            </div>
        </form>
    )
}