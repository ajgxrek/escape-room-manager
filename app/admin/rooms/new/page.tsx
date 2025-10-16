import { createRoom } from './actions'

export default function NewRoomPage() {
    return (
        <div className="section_container min-h-screen">
            <h1 className="text-30-bold mb-8">Dodaj Nowy Pokój</h1>

            <form action={createRoom} className="space-y-6 max-w-2xl mx-auto bg-white p-8 border-[3px] border-black rounded-[20px]">
                <div>
                    <label htmlFor="name" className="startup-form_label">Nazwa pokoju</label>
                    <input type="text" name="name" required className="w-full startup-form_input" />
                </div>
                <div>
                    <label htmlFor="slug" className="startup-form_label">Slug (np. szkola-magii)</label>
                    <input type="text" name="slug" required className="w-full startup-form_input" />
                </div>
                <div>
                    <label htmlFor="price" className="startup-form_label">Cena</label>
                    <input type="number" step="0.01" name="price" required className="w-full startup-form_input" />
                </div>
                <div>
                    <label htmlFor="description" className="startup-form_label">Opis</label>
                    <textarea name="description" required className="w-full startup-form_textarea" rows={6} />
                </div>
                <div>
                    <label htmlFor="duration" className="startup-form_label">Czas trwania (min)</label>
                    <input type="number" name="duration" required className="w-full startup-form_input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="minPlayers" className="startup-form_label">Min. graczy</label>
                        <input type="number" name="minPlayers" required className="w-full startup-form_input" />
                    </div>
                    <div>
                        <label htmlFor="maxPlayers" className="startup-form_label">Max. graczy</label>
                        <input type="number" name="maxPlayers" required className="w-full startup-form_input" />
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" className="startup-form_btn">
                        Stwórz Pokój
                    </button>
                </div>
            </form>
        </div>
    )
}
