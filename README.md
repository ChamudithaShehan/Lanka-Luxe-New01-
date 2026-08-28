# Lanka Luxe Journeys

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=for-the-badge)](#license)

A world-class luxury travel and tourism web application designed for bespoke high-end travel experiences in Sri Lanka. The platform caters to international travelers, luxury vacationers, couples, families, and Korean golf enthusiasts seeking private, guided Sri Lankan expeditions.

Founded by **Iroshan Jayawickrame**, a licensed specialist with over 10 years of expertise (**SLTDA National Tourist Guide Licence: C-1734**, Diploma in Archaeology from University of Kelaniya).

---

## 🌟 Key Highlights

- **Bilingual Internationalization (i18n):** Seamless real-time language toggling between **English** and **한국어 (Korean)** with localized itineraries, destination guides, and forms.
- **Cinematic Editorial Design:** Deep luxury navy (`#07111E`) and rich gold (`#C8A45D`) palette, editorial typography, floating layouts, and smooth micro-animations powered by `motion/react`.
- **Championship Golf Escapes:** Specialized itineraries covering Sri Lanka's premier courses (Royal Colombo, Victoria Golf Resort, Nuwara Eliya Golf Club, Shangri-La Hambantota).
- **Interactive Island Map & Curated Guides:** Visual travel planner with map coordinates, stay durations, and highlights.
- **Bespoke Inquiries CRM:** Multi-step booking consultation forms with automatic unique reference codes (`LLJ-YYYY-UUID`) and CRM management.
- **Administrative Atelier:** Full-featured dashboard for real-time CRUD management of tours, golf packages, destinations, experiences, journal articles, founder credentials, and customer leads.
- **Prisma & MySQL Persistence:** Robust relational database architecture with live cross-tab synchronization (`BroadcastChannel`) and cached hydration.

---

## 🛡️ Security & Production Hardening

The application incorporates enterprise-grade security practices across authentication, authorization, and data privacy:

| Security Domain | Implementation Details |
| :--- | :--- |
| **Server-Side Edge Proxy** | [`src/proxy.ts`](src/proxy.ts) validates administrative JWT session cookies at the edge before rendering any `/admin/*` pages. |
| **API Route Authorization** | Every mutating API endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) is guarded server-side by [`requireAuth()`](src/lib/api-auth.ts). |
| **Password Security** | Passwords hashed using `bcrypt` (12 salt rounds). Zero hardcoded credentials or client-side bypasses. |
| **JWT Session Integrity** | JWT tokens signed with a validated, strong 256-bit+ secret. In production, missing or weak secrets fail fast safely. |
| **Customer PII Isolation** | Inquiries containing sensitive customer personal data are completely segregated from public catalog APIs ([`/api/content`](src/app/api/content/route.ts)) and only accessible to authenticated admins. |
| **Zod Schema Validation** | All inbound API payloads are strictly validated against strong Zod schemas ([`src/lib/validations/`](src/lib/validations/)) with regex constraints, length bounds, and status enum guards. |
| **Anti-Spam & Rate Limiting** | Dual-layer protection on public forms: IP rate limiting via [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts) + hidden honeypot bot trap on client & server. |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Database & ORM:** [Prisma ORM 6.4](https://www.prisma.io/) with MySQL
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** Motion (`motion/react`)
- **Validation:** [Zod 3.24](https://zod.dev/)
- **Authentication:** `jsonwebtoken` + `bcryptjs` + HTTP-only cookies
- **Icons & UI:** [Lucide React](https://lucide.dev/), Radix UI Primitives, Sonner Notifications

---

## 📁 Project Directory Structure

```
lanka-luxe-journeys/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition (MySQL)
│   ├── init-db.mjs            # Database schema sync & initializer
│   └── seed.mjs               # Curated seed data for tours, golf, & settings
├── src/
│   ├── app/
│   │   ├── admin/             # Admin Atelier & CRM pages
│   │   │   ├── blog/          # Blog post editor
│   │   │   ├── destinations/  # Destinations & map manager
│   │   │   ├── experiences/   # Signature experiences editor
│   │   │   ├── golf/          # Golf packages manager
│   │   │   ├── inquiries/     # Lead CRM & inquiry status manager
│   │   │   ├── login/         # Secure admin login portal
│   │   │   ├── settings/      # Site settings, contact info, founder data
│   │   │   ├── tours/         # Bespoke tour itinerary builder
│   │   │   └── page.tsx       # Admin overview metrics & lead preview
│   │   ├── api/               # REST API route handlers
│   │   │   ├── auth/          # Login, logout, session verification
│   │   │   ├── content/       # Public catalog content delivery
│   │   │   ├── inquiries/     # Lead submission & CRM APIs
│   │   │   └── [models]/      # CRUD APIs for tours, golf, destinations, etc.
│   │   ├── blog/              # Public journal & articles
│   │   ├── contact/           # Public contact page & consultation form
│   │   ├── destinations/      # Public destination guides & dynamic routes
│   │   ├── experiences/       # Public signature experiences catalog
│   │   ├── golf/              # Public championship golf packages
│   │   ├── tours/             # Public tour itineraries & details
│   │   ├── layout.tsx         # Global HTML layout, fonts & metadata
│   │   └── page.tsx           # Luxury homepage experience
│   ├── components/            # Reusable UI cards, forms, navbar, footer
│   ├── data/                  # Static constants and seed fallbacks
│   ├── lib/
│   │   ├── api-auth.ts        # Server-side API requireAuth helper
│   │   ├── auth.ts            # Password hashing, JWT signing & verification
│   │   ├── content-store.tsx  # React state store with live DB sync
│   │   ├── i18n.tsx           # Bilingual context provider (EN / KO)
│   │   ├── prisma.ts          # Singleton PrismaClient instance
│   │   ├── rate-limit.ts      # Sliding-window rate limiter module
│   │   └── validations/       # Zod schemas for inquiries & content
│   └── proxy.ts               # Next.js 16 Edge Proxy (Middleware)
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18 or higher (v20+ recommended)
- **MySQL Database**: Local MySQL (XAMPP, Laragon, MySQL Workbench) or Cloud MySQL (PlanetScale, Railway, AWS RDS, Aiven)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd lanka-luxe-journeys
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your connection parameters:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/lanka_luxe_db"
   JWT_SECRET="generate_a_secure_random_secret_at_least_32_characters"
   ADMIN_DEFAULT_USER="admin"
   ADMIN_DEFAULT_PASSWORD="your_secure_admin_password"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize & Seed the Database:**
   ```bash
   npm run db:init
   ```
   *This automatically sets up the MySQL tables and seeds curated tours, championship golf courses, destinations, and founder credentials.*

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs database sync check and starts the Next.js development server with Turbopack. |
| `npm run build` | Compiles an optimized production build. |
| `npm run start` | Starts the production server. |
| `npm run db:init` | Synchronizes the database schema and populates initial curated content. |
| `npm run db:seed` | Re-seeds curated itineraries, golf courses, and default site settings. |
| `npm run db:migrate` | Non-destructive database migration for production environments (`prisma migrate deploy`). |
| `npm run lint` | Runs ESLint checks. |
| `npm run format` | Formats all code with Prettier. |

---

## 🔐 Administrative Access

- **Admin Portal URL:** `/admin` (Redirects to `/admin/login` if unauthenticated)
- **Login Credentials:** Configured via `ADMIN_DEFAULT_USER` and `ADMIN_DEFAULT_PASSWORD` in `.env` (or updated securely in the database).
- **Session Security:** Authenticated via HTTP-only, secure, SameSite cookies with a 7-day token expiration.

---

## 🌐 Production Deployment

When deploying to production platforms such as **Vercel**, **Railway**, or **AWS**:

1. Set the production environment variables in your hosting dashboard:
   - `DATABASE_URL` (Your production MySQL connection string)
   - `JWT_SECRET` (Strong random string, min 32 characters)
   - `ADMIN_DEFAULT_USER` / `ADMIN_DEFAULT_PASSWORD`
   - `NODE_ENV="production"`
2. Run non-destructive migrations:
   ```bash
   npm run db:migrate
   ```
3. Build the application:
   ```bash
   npm run build
   ```

---

## 📄 License & Attribution

Copyright © 2026 **Lanka Luxe Journeys**. All Rights Reserved.  
Operations supervised under SLTDA Registered Tourist Guide Licence No: **C-1734**.