# Escape Room Management System (SSR)

[cite_start]Kompleksowa aplikacja webowa typu full-stack do zarządzania rezerwacjami w escape roomie, wykorzystująca technologię **Server-Side Rendering (SSR)**[cite: 7, 14]. [cite_start]Projekt zrealizowany jako praca dyplomowa inżynierska na **Politechnice Wrocławskiej**[cite: 2, 6].

## 🚀 Kluczowe Funkcjonalności

### Panel Klienta
* [cite_start]**Katalog pokoi**: Przeglądanie oferty tematycznej z dynamicznie ładowanymi danymi[cite: 16, 178].
* [cite_start]**Rezerwacje Live**: Interaktywny formularz z asynchronicznym sprawdzaniem dostępności slotów czasowych[cite: 180, 181].
* [cite_start]**Płatności Online**: Pełna integracja z systemem **Stripe** (obsługa kart i BLIK)[cite: 16, 184].
* [cite_start]**Uwierzytelnianie**: Logowanie federacyjne via Google (NextAuth.js)[cite: 18, 185].
* [cite_start]**Dashboard**: Zarządzanie własnym profilem i historią rezerwacji z możliwością ich anulowania[cite: 188, 234].

### Panel Administratora (Back-office)
* [cite_start]**Zarządzanie ofertą**: Pełny system CRUD dla pokojów zagadek[cite: 17, 191].
* [cite_start]**Zarządzanie mediami**: Przesyłanie i automatyczna optymalizacja zdjęć w usłudze **Cloudinary**[cite: 17, 285].
* [cite_start]**Monitorowanie**: Podgląd harmonogramu rezerwacji w czasie rzeczywistym i manualna zmiana statusów płatności[cite: 192, 240].

## 🛠 Stos Technologiczny

* [cite_start]**Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)[cite: 18, 266].
* [cite_start]**Język**: TypeScript (pełne bezpieczeństwo typów od bazy danych po frontend)[cite: 263, 636].
* [cite_start]**Frontend**: React + Tailwind CSS (Responsive Web Design)[cite: 18, 270].
* [cite_start]**Baza Danych**: PostgreSQL (hostowany na Neon) + **Prisma ORM**[cite: 18, 276, 278].
* [cite_start]**Uwierzytelnianie**: NextAuth.js (OAuth 2.0)[cite: 18, 286].
* [cite_start]**Komunikacja**: Resend (transakcyjne powiadomienia e-mail)[cite: 19, 283].
* [cite_start]**Infrastruktura**: Vercel (Serverless Environment)[cite: 196, 287].

## 🏗 Architektura i Bezpieczeństwo

[cite_start]Aplikacja została zaprojektowana w oparciu o architekturę monolityczną modularną, wykorzystującą nowoczesne wzorce projektowe[cite: 643, 644]:

* [cite_start]**SSR & RSC**: Renderowanie po stronie serwera oraz React Server Components dla optymalizacji SEO i wydajności[cite: 15, 683].
* [cite_start]**RBAC**: Kontrola dostępu oparta na rolach (USER, ADMIN) zabezpieczona przez Middleware[cite: 189, 885, 888].
* [cite_start]**Data Integrity**: Ochrona przed double-bookingiem dzięki relacjom 1:1 w bazie danych i transakcjom Prisma[cite: 259, 327, 622].
* [cite_start]**C4 Model**: Dokumentacja architektury na poziomie kontenerów (Level 2)[cite: 66, 645].

## 🧪 Testy i Jakość

[cite_start]Stabilność systemu zapewniają automatyczne testy na dwóch poziomach[cite: 70, 1073]:

* [cite_start]**Testy Jednostkowe**: Wykorzystanie **Jest** i **React Testing Library** do weryfikacji kluczowych komponentów UI i logiki warunkowej[cite: 1075, 1186].
* [cite_start]**Testy End-to-End (E2E)**: Framework **Playwright** symulujący pełną ścieżkę krytyczną użytkownika w różnych przeglądarkach[cite: 1148, 1149, 1239].

## 📂 Struktura Projektu (wybrane)

```text
├── app/              # App Router (Strony, API, Server Actions)
├── components/       # Komponenty React (Client & Server Components)
├── lib/              # Konfiguracja zewnętrznych usług (Prisma, Stripe, Mail)
├── prisma/           # Schemat bazy danych i migracje
├── __tests__/        # Testy jednostkowe (Jest)
└── tests/            # Testy E2E (Playwright)
