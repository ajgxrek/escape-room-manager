import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/app/components/Footer';

describe('Footer Component', () => {
    it('powinien renderować tekst o prawach autorskich', () => {
        render(<Footer />);

        const copyrightText = screen.getByText(/Wszelkie prawa zastrzeżone/i);

        expect(copyrightText).toBeInTheDocument();
    });
});

