"use client"

import type { Booking } from "@prisma/client";
import { useActionState } from "react";

// Definiujemy typ dla stanu akcji serwera
type ActionState = {
    message: string;
}

// Definiujemy typy propsów, które komponent będzie przyjmował
type BookingStatusUpdaterProps = {
    booking: Booking;
    possibleStatus: string[];
    updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

const getStatusClasses = (status: string) => {
    switch (status) {
        case 'CONFIRMED': return 'bg-green-100 text-green-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function BookingStatusUpdater({ booking, possibleStatus, updateAction }: BookingStatusUpdaterProps) {

    const [state, formAction] = useActionState(updateAction, { message: '' });

    return (
        <div>
            <form action={formAction}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <select
                    name="status"
                    defaultValue={booking.status}
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-none appearance-none ${getStatusClasses(booking.status)}`}
                >
                    {possibleStatus.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </form>

            {state.message && <p className="text-xs text-gray-500 mt-1">{state.message}</p>}
        </div>
    );
}

