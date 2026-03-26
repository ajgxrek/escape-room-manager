# Escape Room Management System (SSR)

A comprehensive full-stack web application designed to manage escape room bookings, featuring Server-Side Rendering (SSR) for optimal performance and SEO. This project was developed as an **Engineering Thesis** at the **Wrocław University of Science and Technology**, Faculty of Information and Communication Technology.

---

## Key Features

### 👤 Client Portal
* **Thematic Room Catalog:** Browse available rooms with server-side rendered data for SEO optimization.
* **Live Bookings:** Interactive booking form with asynchronous, real-time fetching of available time slots.
* **Secure Payments:** Full integration with **Stripe** supporting Card and BLIK transactions.
* **Authentication:** Social login via **Google** (NextAuth.js).
* **User Dashboard:** Manage personal bookings and self-service cancellations.

### Admin Panel
* **Offer Management:** Full **CRUD** system to add, edit, and remove escape rooms.
* **Media Optimization:** Automatic image processing and hosting via **Cloudinary**.
* **Real-time Oversight:** Monitor schedules, payment statuses, and manual booking overrides.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, Server Actions, SSR) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (Responsive Web Design) |
| **Database** | PostgreSQL (Neon) & Prisma ORM |
| **Auth** | NextAuth.js |
| **Payments** | Stripe API |
| **Email** | Resend |
| **Infrastructure** | Vercel |

---

## Architecture & Security

* **C4 Model:** Architecture documented at the Container level (C4 Level 2).
* **RBAC (Role-Based Access Control):** Secured routes for `USER` and `ADMIN` roles using Next.js Middleware.
* **Data Integrity:** Prevented "double-booking" scenarios through strict database constraints and 1:1 relationships.
* **Security:** Enforced HTTPS/TLS encryption and secure environment variable management.

---

## Quality Assurance

* **Unit Testing:** Implemented with **Jest** and **React Testing Library** for core logic and UI components.
* **E2E Testing:** Full business flow verification using **Playwright** (Chromium, Firefox, WebKit).
* **Persistence Tests:** Ensuring data consistency across database transactions.

---
