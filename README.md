# Escape Room Management System (SSR)

Kompleksowa aplikacja webowa typu full-stack do zarządzania rezerwacjami w escape roomie, wykorzystująca technologię Server-Side Rendering (SSR). Projekt zrealizowany jako praca dyplomowa inżynierska na Politechnice Wrocławskiej na Wydziale Informatyki i Telekomunikacji.

## Kluczowe Funkcjonalności

### Panel Klienta
* Katalog pokoi: Przeglądanie oferty tematycznej z danymi renderowanymi po stronie serwera w celu optymalizacji SEO.
* Rezerwacje Live: Interaktywny formularz z asynchronicznym pobieraniem dostępnych slotów czasowych w czasie rzeczywistym.
* Płatności Online: Integracja z systemem Stripe umożliwiająca bezpieczne transakcje kartowe i BLIK.
* Uwierzytelnianie: Logowanie federacyjne za pośrednictwem dostawcy Google z wykorzystaniem NextAuth.js.
* Panel Użytkownika: Dostęp do historii rezerwacji oraz możliwość samodzielnego anulowania nadchodzących terminów.

### Panel Administratora
* Zarządzanie ofertą: Pełny system CRUD pozwalający na dodawanie, edycję i usuwanie pokoi.
* Zarządzanie mediami: Przesyłanie i automatyczna optymalizacja zdjęć w usłudze Cloudinary.
* Nadzór: Podgląd harmonogramu wizyt, monitorowanie statusów płatności oraz manualna zmiana statusu rezerwacji.

## Stos Technologiczny

* Framework: Next.js (App Router, Server Actions, SSR).
* Język: TypeScript zapewniający bezpieczeństwo typów w całym systemie.
* Frontend: React oraz Tailwind CSS do budowy responsywnego interfejsu (RWD).
* Baza Danych: PostgreSQL (platforma Neon) oraz Prisma ORM.
* Komunikacja: Resend do obsługi transakcyjnej wysyłki powiadomień e-mail.
* Infrastruktura: Platforma Vercel zapewniająca skalowalność i wsparcie dla Next.js.

## Architektura i Bezpieczeństwo

* Model C4: Architektura systemu udokumentowana na poziomie kontenerów (C4 Poziom 2).
* RBAC: Kontrola dostępu oparta na rolach (USER, ADMIN) zabezpieczona przez Middleware.
* Data Integrity: Mechanizmy zapobiegające podwójnym rezerwacjom (double-booking) poprzez relacje jeden-do-jednego i ograniczenia bazy danych.
* Szyfrowanie: Wymuszona transmisja danych za pomocą protokołu HTTPS/TLS.

## Testy i Jakość

* Testy Jednostkowe: Realizowane przy użyciu środowiska Jest oraz React Testing Library dla kluczowych komponentów UI.
* Testy End-to-End (E2E): Wykorzystanie frameworka Playwright do weryfikacji pełnych procesów biznesowych w przeglądarkach Chromium, Firefox i WebKit.
* Weryfikacja Trwałości: Testy spójności danych potwierdzające poprawny zapis rekordów w bazie po zakończeniu transakcji.

---
Autor: Igor Golębiowski
Opiekun pracy: dr inż. Robert Wójcik
