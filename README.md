# Lanka Luxe Journeys

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=for-the-badge)](#license)

A world-class luxury travel and tourism web application designed for bespoke high-end travel experiences in Sri Lanka. The platform caters to international travelers, luxury vacationers, couples, families, and Korean golf enthusiasts seeking private, guided Sri Lankan expeditions.

Founded by **Iroshan Jayawickrame**, a licensed specialist with over 10 years of expertise (**SLTDA National Tourist Guide Licence: C-1734**, Diploma in Archaeology from University of Kelaniya).

---

## 🌟 Key Highlights

- **Pure Database-Only Architecture:** MySQL is the single source of truth for all dynamic content (tours, golf packages, destinations, experiences, journal articles, gallery items, site settings, and contact information). Zero static fallback data or fake success states.
- **Zero-Touch Automated Setup:** Simply running `npm run dev` handles everything end-to-end: environment configuration, cryptographic secrets, MySQL database creation, Prisma client generation, schema push, and initial seed data.
- **Bilingual Internationalization (i18n):** Seamless real-time language toggling between **English** and **한국어 (Korean)** with localized itineraries, destination guides, and forms.
- **Cinematic Editorial Design:** Deep luxury navy (`#07111E`) and rich gold (`#C8A45D`) palette, editorial typography, floating layouts, and smooth micro-animations powered by `motion/react`.
- **Championship Golf Escapes:** Specialized itineraries covering Sri Lanka's premier courses (Royal Colombo, Victoria Golf Resort, Nuwara Eliya Golf Club, Shangri-La Hambantota).
- **Interactive Island Map & Curated Guides:** Visual travel planner with map coordinates, stay durations, and highlights.
- **Bespoke Inquiries CRM:** Multi-step booking consultation forms with automatic unique reference codes (`LLJ-YYYY-HEX`) and CRM management.
- **Administrative Atelier:** Full-featured dashboard for real-time CRUD management of tours, golf packages, destinations, experiences, journal articles, founder credentials, and customer leads.
- **Distributed Rate Limiting:** Production sliding-window rate limiting via Upstash Redis with conservative in-memory fallback.

---

## 🗄️ Database-Only Content Architecture

The platform operates on a strict **Database-Only Architecture**:

| Aspect | Architectural Policy |
| :--- | :--- |
| **Source of Truth** | MySQL database via Prisma ORM is the **sole source of truth**. No hardcoded fallback arrays exist in the codebase. |
| **No Static Fallbacks** | If MySQL is unreachable, the system will **never** silently inject demo data. |
| **Database Failure Mode** | `/api/content` catches database errors and returns **HTTP 503** with `{ error: "Content is temporarily unavailable. Please try again later.", dbConnected: false }`. |
| **Public Alert Banner** | When the database is offline, a prominent notification is displayed across public pages: *"Content is temporarily unavailable. Please try again later."* |
| **Admin Alert Banner** | The admin dashboard displays a sticky banner: *"Database connection unavailable. Changes cannot be loaded or saved until the database connection is restored."* |
| **Empty State Handling** | Public catalogs clearly distinguish between an empty database table (e.g. *"No journeys available yet."*) and search/filter mismatches (e.g. *"No journeys match your current filter."*). |
| **Zero Fake Success** | Every administrative CRUD mutation (`saveTour`, `deleteTour`, `saveGolfCourse`, etc.) strictly `await`s MySQL transactions. Errors preserve the previous UI state and surface descriptive toast notifications. |

---

## 🚀 Quick Start & Zero-Touch Auto-Setup

The platform includes an automated system initializer (`prisma/init-db.mjs`) that configures everything before starting the application:

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **MySQL Database Server**: Local MySQL (v8.0+) or Cloud MySQL (AWS RDS, PlanetScale, Aiven)

### 2. Installation
```bash
git clone <repository-url>
cd lanka-luxe-journeys
npm install
```

### 3. Configure MySQL Connection
Update `.env` with your MySQL credentials (or let it auto-create from `.env.example` on first run):
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/lanka_luxe_db"
```

### 4. Run the Application
```bash
npm run dev
```

> **⚡ What the Auto-Setup Pipeline does automatically on startup:**
> 1. **Environment Config:** Creates `.env` from `.env.example` if missing.
> 2. **Security Entropy:** Automatically generates a cryptographically secure 256-bit `JWT_SECRET` in `.env` if not configured.
> 3. **Storage Directories:** Creates the `backups/` directory for database dumps.
> 4. **Database Auto-Creation:** Connects to MySQL and executes `CREATE DATABASE IF NOT EXISTS \`lanka_luxe_db\` CHARACTER SET utf8mb4;`. **You do not need to manually create the database in MySQL.**
> 5. **Prisma Generation:** Runs `npx prisma generate` to synchronize query engine binaries and TypeScript types.
> 6. **Schema Synchronization:** Executes `npx prisma db push` to create or update all database tables.
> 7. **Data Seeding:** Runs `node prisma/seed.mjs` to populate initial admin accounts, curated journeys, golf courses, destinations, experiences, journal articles, and site settings.
> 8. **Launches App:** Starts Next.js with Turbopack at [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Security & Production Hardening

| Security Domain | Implementation Details |
| :--- | :--- |
| **Server-Side Middleware** | [`src/middleware.ts`](src/middleware.ts) validates administrative JWT session cookies at the edge before rendering any `/admin/*` pages. |
| **API Route Authorization** | Every mutating API endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) is guarded server-side by [`requireAdminSession()`](src/lib/auth.ts). |
| **Password Security** | Passwords hashed using `bcrypt` (12 salt rounds). Timing-attack mitigation dummy hash on unauthenticated queries. Zero hardcoded credentials. |
| **JWT Session Integrity** | JWT tokens signed with `jose` using validated 256-bit+ secret. HttpOnly, Secure, SameSite=Lax cookie storage. |
| **Customer PII Isolation** | Inquiries containing sensitive customer data are completely segregated from public catalog APIs ([`/api/content`](src/app/api/content/route.ts)) and only accessible to authenticated admins. |
| **Zod Schema Validation** | All inbound API payloads are strictly validated against strong Zod schemas with length bounds, email format checks, and status enum guards. |
| **Distributed Rate Limiting** | Multi-instance sliding window rate limiting via Upstash Redis + in-memory fallback on `/api/auth/login`, `/api/inquiries`, and `/api/upload`. |
| **SSRF & Magic-Byte Defense** | Image uploads strictly validate JPEG, PNG, and WebP magic bytes, cap files at 5MB, require HTTPS, and reject loopback, link-local, and private IP CIDRs. |
| **Credential Isolation** | All database secrets (`DATABASE_URL`, `DB_PASSWORD`, `JWT_SECRET`) remain strictly server-side. `NEXT_PUBLIC_APP_URL` is the only exposed public variable. |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | Motion (`motion/react`) |
| **Database & ORM** | MySQL + [Prisma ORM 7.10](https://www.prisma.io/) (`@prisma/adapter-mariadb`) |
| **Distributed Cache / Rate Limiting** | [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`, `@upstash/redis`) |
| **Validation** | [Zod 3.24](https://zod.dev/) |
| **Authentication** | `jose` (Edge JWT) + `bcryptjs` + HttpOnly cookies |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Sonner Notifications |

---

## 📁 Project Directory Structure

```
lanka-luxe-journeys/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition (MySQL)
│   ├── init-db.mjs            # Automated system & database initializer
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
│   │   │   ├── auth/          # Login, logout, me session routes
│   │   │   ├── content/       # Public catalog content delivery (MySQL-only)
│   │   │   ├── inquiries/     # Lead submission & CRM APIs
│   │   │   ├── upload/        # Hardened SSRF-safe image upload API
│   │   │   └── admin/         # Protected CRUD APIs for all CMS models
│   │   ├── blog/              # Public journal & articles
│   │   ├── contact/           # Public contact page & consultation form
│   │   ├── destinations/      # Public destination guides & dynamic routes
│   │   ├── experiences/       # Public signature experiences catalog
│   │   ├── golf/              # Public championship golf packages
│   │   ├── tours/             # Public tour itineraries & details
│   │   ├── layout.tsx         # Global HTML layout, fonts & metadata
│   │   └── page.tsx           # Luxury homepage experience
│   ├── components/            # Reusable UI cards, forms, navbar, footer, error banners
│   ├── data/                  # TypeScript types, categories, and UI template assets
│   ├── lib/
│   │   ├── auth.ts            # Session management, JWT, password guards
│   │   ├── content-db.ts      # Server-side live database query helpers
│   │   ├── content-store.tsx  # React state store with live DB sync
│   │   ├── i18n.tsx           # Bilingual context provider (EN / KO)
│   │   ├── prisma.ts          # Singleton PrismaClient instance with driver adapter
│   │   └── rate-limit.ts      # Distributed Upstash Redis rate limiter
│   └── middleware.ts          # Server-side Next.js route guard
├── backups/                   # Automated database SQL/JSON backups
├── docs/                      # Operations & disaster recovery runbooks
├── scripts/                   # Automated verification & backup scripts
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## ⚙️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs automated database initializer and launches Next.js development server. |
| `npm run build` | Runs automated database initializer and creates an optimized Next.js production build. |
| `npm start` | Runs automated database initializer and starts the Next.js production server. |
| `npm run db:init` | Manually triggers the automated system & database initializer script. |
| `npm run db:seed` | Manually runs the idempotent seed script to populate CMS data into MySQL. |
| `npm run lint` | Runs Next.js ESLint checks. |
| `npm run format` | Formats all codebase files with Prettier. |

---

## 🧪 Verification & Automated Tests

The repository includes two automated verification suites:

### 1. Database-Only Content Architecture Suite
Verifies that MySQL is the sole source of truth, static fallbacks are completely absent, API error handling responds with 503 on database outage, and admin mutations await confirmation:
```bash
node scripts/verify-db-only-architecture.mjs
```
*(37 / 37 tests passing)*

### 2. Production Hardening & Security Suite
Verifies Bcrypt hashing, constant-time comparisons, JWT session lifecycle, rate limiting, SSRF defense, and credential hygiene:
```bash
node scripts/verify-remediation.mjs
```
*(38 / 38 tests passing)*

---

## 🔑 Default Credentials & Administration

Initial seeding creates default administrative accounts in MySQL:
- **Default Username:** `admin` (or configured via `ADMIN_DEFAULT_USER`)
- **Default Password:** `admin123` (or configured via `ADMIN_DEFAULT_PASSWORD`)
- **Admin Portal URL:** `http://localhost:3000/admin/login`

> **🔒 Security Note:** Upon initial deployment to a public environment, immediately log in and change your administrator password via the Admin Atelier settings panel.

---

## 📄 License

Proprietary © Lanka Luxe Journeys. All rights reserved.
