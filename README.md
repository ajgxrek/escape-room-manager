# Escape Room Management System (SSR)

[cite_start]Kompleksowa aplikacja webowa typu full-stack do zarządzania rezerwacjami w escape roomie, wykorzystująca technologię Server-Side Rendering (SSR)[cite: 7]. [cite_start]Projekt zrealizowany jako praca dyplomowa inżynierska na Politechnice Wrocławskiej na Wydziale Informatyki i Telekomunikacji[cite: 2, 3, 6].

## Kluczowe Funkcjonalności

### Panel Klienta
* [cite_start]Katalog pokoi: Przeglądanie oferty tematycznej z danymi renderowanymi po stronie serwera w celu optymalizacji SEO[cite: 15, 48].
* [cite_start]Rezerwacje Live: Interaktywny formularz z asynchronicznym pobieraniem dostępnych slotów czasowych w czasie rzeczywistym[cite: 181, 1027].
* [cite_start]Płatności Online: Integracja z systemem Stripe umożliwiająca bezpieczne transakcje kartowe i BLIK[cite: 16, 976].
* [cite_start]Uwierzytelnianie: Logowanie federacyjne za pośrednictwem dostawcy Google z wykorzystaniem NextAuth.js[cite: 18, 185].
* [cite_start]Panel Użytkownika: Dostęp do historii rezerwacji oraz możliwość samodzielnego anulowania nadchodzących terminów[cite: 188, 234].

### Panel Administratora
* [cite_start]Zarządzanie ofertą: Pełny system CRUD pozwalający na dodawanie, edycję i usuwanie pokoi[cite: 190, 191].
* [cite_start]Zarządzanie mediami: Przesyłanie i automatyczna optymalizacja zdjęć w usłudze Cloudinary[cite: 17, 285].
* [cite_start]Nadzór: Podgląd harmonogramu wizyt, monitorowanie statusów płatności oraz manualna zmiana statusu rezerwacji[cite: 51, 192].

## Stos Technologiczny

* [cite_start]Framework: Next.js (App Router, Server Actions, SSR)[cite: 18, 266].
* [cite_start]Język: TypeScript zapewniający bezpieczeństwo typów w całym systemie[cite: 263, 279].
* [cite_start]Frontend: React oraz Tailwind CSS do budowy responsywnego interfejsu (RWD)[cite: 18, 270].
* [cite_start]Baza Danych: PostgreSQL (platforma Neon) oraz Prisma ORM[cite: 18, 276].
* [cite_start]Komunikacja: Resend do obsługi transakcyjnej wysyłki powiadomień e-mail[cite: 19, 283].
* [cite_start]Infrastruktura: Platforma Vercel zapewniająca skalowalność i wsparcie dla Next.js[cite: 196, 287].

## Architektura i Bezpieczeństwo

* [cite_start]Model C4: Architektura systemu udokumentowana na poziomie kontenerów (C4 Poziom 2)[cite: 66, 646].
* [cite_start]RBAC: Kontrola dostępu oparta na rolach (USER, ADMIN) zabezpieczona przez Middleware[cite: 189, 885].
* [cite_start]Data Integrity: Mechanizmy zapobiegające podwójnym rezerwacjom (double-booking) poprzez relacje jeden-do-jednego i ograniczenia bazy danych[cite: 259, 327].
* [cite_start]Szyfrowanie: Wymuszona transmisja danych za pomocą protokołu HTTPS/TLS[cite: 254, 894].

## Testy i Jakość

* [cite_start]Testy Jednostkowe: Realizowane przy użyciu środowiska Jest oraz React Testing Library dla kluczowych komponentów UI[cite: 1075, 1186].
* [cite_start]Testy End-to-End (E2E): Wykorzystanie frameworka Playwright do weryfikacji pełnych procesów biznesowych w przeglądarkach Chromium, Firefox i WebKit[cite: 1148, 1181].
* [cite_start]Weryfikacja Trwałości: Testy spójności danych potwierdzające poprawny zapis rekordów w bazie po zakończeniu transakcji[cite: 1254, 1255].

---
[cite_start]Autor: Igor Golębiowski [cite: 8]
