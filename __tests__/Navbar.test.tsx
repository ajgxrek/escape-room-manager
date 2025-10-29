import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Navbar from '@/app/components/Navbar';

// KROK 1: MOCKOWANIE CAŁEGO MODUŁU @/auth

const mockAuth = jest.fn();
jest.mock('@/auth', () => ({
    __esModule: true,
    // Podstawiamy naszą fałszywą funkcję pod prawdziwą nazwę `auth`
    auth: (...args: any[]) => mockAuth(...args),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));


describe('Navbar Component', () => {
    beforeEach(() => {
        mockAuth.mockClear();
    });

    it('powinien renderować nazwę ESCAPE ROOM', async () => {
        // Symulujemy brak zalogowanego użytkownika
        mockAuth.mockResolvedValueOnce(null);

        // Renderujemy komponent (jest async, więc używamy `await act`)
        await act(async () => {
            render(await Navbar());
        });

        const brandName = screen.getByRole('heading', { name: /escape room/i });
        expect(brandName).toBeInTheDocument();
    });

    it('powinien pokazywać przycisk "Zaloguj się" dla gościa', async () => {
        mockAuth.mockResolvedValueOnce(null);

        await act(async () => {
            render(await Navbar());
        });

        const loginButton = screen.getByRole('button', { name: /zaloguj się/i });
        expect(loginButton).toBeInTheDocument();
        const logoutButton = screen.queryByRole('button', { name: /wyloguj/i });
        expect(logoutButton).not.toBeInTheDocument();
    });

    it('powinien pokazywać imię użytkownika i przycisk "Wyloguj" dla zalogowanego użytkownika (USER)', async () => {
        // Symulujemy zalogowanego użytkownika
        const mockSession = {
            user: { id: '123', name: 'Test User', email: 'test@example.com', role: 'USER' }
        };
        mockAuth.mockResolvedValueOnce(mockSession);

        await act(async () => {
            render(await Navbar());
        });

        const userName = screen.getByText('Test User');
        expect(userName).toBeInTheDocument();
        // Sprawdzamy, czy link prowadzi do /dashboard
        expect(userName.closest('a')).toHaveAttribute('href', '/dashboard');

        const logoutButton = screen.getByRole('button', { name: /wyloguj/i });
        expect(logoutButton).toBeInTheDocument();
        const loginButton = screen.queryByRole('button', { name: /zaloguj się/i });
        expect(loginButton).not.toBeInTheDocument();
    });

    it('powinien pokazywać link do panelu admina dla zalogowanego użytkownika (ADMIN)', async () => {
        // Symulujemy zalogowanego admina
        const mockSession = {
            user: { id: '456', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' }
        };
        mockAuth.mockResolvedValueOnce(mockSession);

        await act(async () => {
            render(await Navbar());
        });

        const userName = screen.getByText(/Admin User \(Panel Admina\)/i);
        expect(userName).toBeInTheDocument();
        // Sprawdzamy, czy link prowadzi do /admin
        expect(userName.closest('a')).toHaveAttribute('href', '/admin');
    });
});

