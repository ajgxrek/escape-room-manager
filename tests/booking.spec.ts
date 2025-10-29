import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Proces rezerwacji escape roomu', () => {

    test('powinien pozwolić użytkownikowi przejść przez rezerwację i przekierować do płatności', async ({ page }) => {
        // Krok 1: Otwórz stronę główną
        await page.goto(BASE_URL);

        // Krok 2: Znajdź pierwszą kartę pokoju i kliknij "Zobacz szczegóły"
        const firstRoomCard = page.locator('.startup-card').first();
        await firstRoomCard.getByRole('link', { name: /zobacz szczegóły/i }).click();

        // Krok 3: Poczekaj na załadowanie strony pokoju i kliknij "Zarezerwuj teraz"
        await page.waitForLoadState('networkidle');
        const bookingButton = page.getByRole('button', { name: 'Zarezerwuj teraz', exact: true });
        await expect(bookingButton).toBeVisible({ timeout: 10000 });
        await bookingButton.click();

        // Krok 4: Poczekaj na załadowanie strony rezerwacji i wypełnij formularz
        await page.waitForURL('**/booking/**');

        const today = new Date();
        const bookingDate = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];
        await page.locator('input[type="date"]').fill(bookingDate);

        // Poczekaj na załadowanie godzin i kliknij pierwszą dostępną godzinę
        await page.waitForSelector('button:not([disabled])[type="button"]');
        await page.locator('button:not([disabled])[type="button"]').first().click();

        // Znajdujemy pole po jego placeholderze (który Playwright interpretuje jako 'name')
        const nameInput = page.getByPlaceholder('Jan Kowalski');
        await expect(nameInput).toBeEditable({ timeout: 5000 }); // Czekamy aż będzie edytowalne
        await nameInput.fill('Tester Playwright');

        // Wypełniamy resztę pól standardowo
        await page.getByPlaceholder('jan@example.com').fill('test@example.com');
        await page.getByPlaceholder('+48 123 456 789').fill('123456789');

        // Krok 5: Kliknij przycisk "Przejdź do płatności"
        await page.getByRole('button', { name: /Przejdź do płatności|Zaloguj się i zapłać/ }).click();

        await page.waitForURL('**/accounts.google.com/**'); // Czekaj na URL Google

        // Ostateczna asercja - czy URL zawiera domenę Google?
        await expect(page.url()).toContain('accounts.google.com');
    });

});

