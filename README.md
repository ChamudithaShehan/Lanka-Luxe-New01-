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

- **Bilingual Internationalization (i18n):** Seamless real-time language toggling between **English** and **한국어 (Korean)** with localized itineraries, destination guides, and forms.
- **Cinematic Editorial Design:** Deep luxury navy (`#07111E`) and rich gold (`#C8A45D`) palette, editorial typography, floating layouts, and smooth micro-animations powered by `motion/react`.
- **Championship Golf Escapes:** Specialized itineraries covering Sri Lanka's premier courses (Royal Colombo, Victoria Golf Resort, Nuwara Eliya Golf Club, Shangri-La Hambantota).
- **Interactive Island Map & Curated Guides:** Visual travel planner with map coordinates, stay durations, and highlights.
- **Bespoke Inquiries CRM:** Multi-step booking consultation forms with automatic unique reference codes (`LLJ-YYYY-HEX`) and CRM management.
- **Administrative Atelier:** Full-featured dashboard for real-time CRUD management of tours, golf packages, destinations, experiences, journal articles, founder credentials, and customer leads.
- **Prisma & MySQL Persistence:** Production relational database architecture with server-side authentication and live database synchronization.
- **Distributed Rate Limiting:** Production sliding-window rate limiting via Upstash Redis with conservative fail-closed/in-memory fallback.

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
│   │   │   ├── auth/          # Login, logout, me session routes
│   │   │   ├── content/       # Public catalog content delivery
│   │   │   ├── inquiries/     # Lead submission & CRM APIs
│   │   │   ├── upload/        # Hardened SSRF-safe image upload API
│   │   │   └── admin/         # Protected CRUD APIs for all models
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
│   │   ├── auth.ts            # Session management, JWT, password guards
│   │   ├── content-db.ts      # Server-side live database query helpers
│   │   ├── content-store.tsx  # React state store with live DB sync
│   │   ├── i18n.tsx           # Bilingual context provider (EN / KO)
│   │   ├── prisma.ts          # Singleton PrismaClient instance with driver adapter
│   │   └── rate-limit.ts      # Distributed Upstash Redis rate limiter
│   └── middleware.ts          # Server-side Next.js route guard
├── docs/                      # Operations & disaster recovery runbooks
├── scripts/                   # Automated verification & backup scripts
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **MySQL Database**: Local MySQL (v8.0+) or Managed Cloud MySQL (PlanetScale, AWS RDS, Aiven)
- **Upstash Redis** (optional for distributed rate limiting in production)

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
   Configure `DATABASE_URL`, `JWT_SECRET`, and `IMGBB_API_KEY`.

4. **Initialize Database & Seed:**
   ```bash
   npm run db:init
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Operations & Audits

- **Automated Verification Suite:**
  ```bash
  node scripts/verify-remediation.mjs
  ```
- **Automated Database Backup:**
  ```bash
  node scripts/backup-database.mjs
  ```

---

## 📄 License

Proprietary © Lanka Luxe Journeys. All rights reserved.
