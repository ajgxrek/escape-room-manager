"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"

type BookingFormProps = {
    room: {
        id: string
        name: string
        slug: string
        minPlayers: number
        maxPlayers: number
        price: number
    }
    userId: string | undefined // Może być niezdefiniowany dla gościa
    userEmail: string
    userName: string
    userPhone: string | null
}

type TimeSlot = {
    time: string
    available: boolean
}

export default function BookingForm({ room, userId, userEmail, userName, userPhone }: BookingFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        playerCount: room.minPlayers,
        customerName: userName || "",
        customerEmail: userEmail || "",
        customerPhone: userPhone || "",
        notes: "",
    })

    // Efekt przywracający dane z localStorage po powrocie z logowania
    useEffect(() => {
        const pendingBookingData = localStorage.getItem('pendingBooking');
        if (pendingBookingData) {
            try {
                const pendingBooking = JSON.parse(pendingBookingData);
                // Uzupełniamy formularz zapisanymi danymi
                setFormData(prevData => ({ ...prevData, ...pendingBooking }));
            } catch (e) {
                console.error("Błąd parsowania danych rezerwacji:", e);
            }
            // Czyścimy localStorage po użyciu
            localStorage.removeItem('pendingBooking');
        }
    }, []); // Uruchamiamy tylko raz, po załadowaniu komponentu

    useEffect(() => {
        if (formData.date) {
            fetchAvailableSlots(formData.date)
        } else {
            setAvailableSlots([])
        }
    }, [formData.date])

    const fetchAvailableSlots = async (date: string) => {
        setLoadingSlots(true)
        setError("")
        try {
            const response = await fetch(`/api/available-slots?roomId=${room.id}&date=${date}`)
            const data = await response.json()

            if (response.ok) {
                setAvailableSlots(data.slots)
            } else {
                setError("Nie udało się pobrać dostępnych terminów")
            }
        } catch (err) {
            setError("Wystąpił błąd podczas pobierania terminów")
        } finally {
            setLoadingSlots(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Jeśli użytkownik NIE JEST zalogowany
        if (!userId) {
            // Zapisujemy dane z formularza w pamięci przeglądarki
            localStorage.setItem('pendingBooking', JSON.stringify(formData));
            // Rozpoczynamy proces logowania przez Google, mówiąc mu, żeby tu wrócił
            signIn('google', { callbackUrl: window.location.href });
            return; // Zatrzymujemy dalsze działanie
        }

        // Jeśli użytkownik JEST zalogowany, kontynuujemy jak wcześniej
        setLoading(true)
        try {
            const response = await fetch("/api/checkout-sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    roomId: room.id,
                    roomName: room.name,
                    price: room.price,
                    userId,
                }),
            })

            const data = await response.json()

            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || "Błąd podczas tworzenia płatności")
            }
        } catch (err) {
            setError("Wystąpił błąd. Spróbuj ponownie.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-4 py-3 border-[3px] border-black rounded-[12px] text-16-medium focus:outline-none focus:border-primary transition-colors"

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] border-[5px] border-black shadow-200 space-y-6">
            {error && (
                <div className="bg-red-100 border-[3px] border-red-500 text-red-700 p-4 rounded-[12px]">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-16-medium font-semibold mb-2">Data *</label>
                <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value, time: "" })
                    }}
                    className={inputClass}
                />
            </div>

            {formData.date && (
                <div>
                    <label className="block text-16-medium font-semibold mb-3">Wybierz godzinę *</label>
                    {loadingSlots ? (
                        <div className="text-center py-4">Ładowanie dostępnych godzin...</div>
                    ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map((slot: TimeSlot) => (
                                <button
                                    key={slot.time}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() => setFormData({ ...formData, time: slot.time })}
                                    className={`py-3 px-4 rounded-[12px] border-[3px] font-semibold transition-all ${
                                        formData.time === slot.time
                                            ? 'bg-primary text-white border-primary'
                                            : slot.available
                                                ? 'bg-white border-black hover:border-primary hover:bg-primary-100'
                                                : 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {slot.time}
                                    {!slot.available && <div className="text-xs mt-1">Zajęte</div>}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-black-300">Brak dostępnych terminów w tym dniu.</div>
                    )}
                </div>
            )}

            <div>
                <label className="block text-16-medium font-semibold mb-2">Liczba graczy *</label>
                <input type="number" required min={room.minPlayers} max={room.maxPlayers} value={formData.playerCount} onChange={(e) => setFormData({ ...formData, playerCount: parseInt(e.target.value) })} className={inputClass} />
            </div>

            <div>
                <label className="block text-16-medium font-semibold mb-2">Imię i nazwisko *</label>
                <input type="text" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className={inputClass} placeholder="Jan Kowalski" />
            </div>

            <div>
                <label className="block text-16-medium font-semibold mb-2">Email *</label>
                <input type="email" required value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} className={inputClass} placeholder="jan@example.com" />
            </div>

            <div>
                <label className="block text-16-medium font-semibold mb-2">Telefon *</label>
                <input type="tel" required placeholder="+48 123 456 789" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} className={inputClass} />
            </div>

            <div>
                <label className="block text-16-medium font-semibold mb-2">Dodatkowe uwagi</label>
                <textarea rows={4} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={inputClass} placeholder="Czy masz jakieś specjalne wymagania?" />
            </div>

            <div className="bg-primary-100 p-6 rounded-[12px] border-[3px] border-black text-center">
                <p className="text-16-medium mb-2">Całkowity koszt</p>
                <p className="text-[36px] font-black">{room.price} PLN</p>
            </div>

            <button
                type="submit"
                disabled={loading || !formData.time}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[18px] py-4 rounded-[12px] border-[3px] border-black shadow-200 hover:shadow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Przekierowuję..." : (userId ? "Przejdź do płatności" : "Zaloguj się i zapłać")}
            </button>
        </form>
    )
}
