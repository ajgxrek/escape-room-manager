import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomDetails from '@/app/components/RoomDetails';

describe('RoomDetails Component', () => {
    const mockRoomData = {
        duration: 90,
        minPlayers: 2,
        maxPlayers: 6,
        difficulty: 'HARD',
    };

    it('powinien renderować czas trwania', () => {
        render(<RoomDetails {...mockRoomData} />);
        const durationElement = screen.getByText(/90 min/i);
        expect(durationElement).toBeInTheDocument();
    });

    it('powinien renderować liczbę graczy', () => {
        render(<RoomDetails {...mockRoomData} />);

        const playersElement = screen.getByText(/2\s*-\s*6/);

        expect(playersElement).toBeInTheDocument();
    });

    it('powinien renderować poziom trudności', () => {
        render(<RoomDetails {...mockRoomData} />);
        const difficultyElement = screen.getByText(/hard/i);
        expect(difficultyElement).toBeInTheDocument();
    });
});

