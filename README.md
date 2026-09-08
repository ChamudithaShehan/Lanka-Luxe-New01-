# Lanka Luxe Journeys

<<<<<<< Updated upstream
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
=======
[![Live Preview](https://img.shields.io/badge/Live_Preview-lanka--luxe--new01.vercel.app-22A2BD?style=for-the-badge)](https://lanka-luxe-new01.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ImgBB](https://img.shields.io/badge/Hosted_on-ImgBB-007ACC?style=for-the-badge&logo=icloud&logoColor=white)](https://imgbb.com/)

A premium, world-class luxury travel and tourism web application designed to showcase and facilitate bespoke travel experiences in Sri Lanka. The platform focuses on high-end international travelers, specifically catering to Korean golf holiday travelers, luxury vacationers, honeymoons, private wildlife safaris, and tailor-made cultural expeditions.

Founded by **Iroshan Jayawickrame**, a professional licensed tourist guide with 10+ years of experience in the Sri Lankan tourism industry (SLTDA Licence: **C-1734**; Diploma in Archaeology, University of Kelaniya).

---

## 🌟 Key Highlights & Features

- **Editorial Luxury Design**: Deep navy palettes (`#081A33`), gold accents (`#C8A45D`), serif headers (*Cormorant Garamond*), and sleek typography (*Jost*).
- **Global Cloud Image Hosting (ImgBB)**: All media and photo assets are hosted and served globally via ImgBB's fast CDN (`i.ibb.co`), with an integrated upload API and management utility.
- **Bilingual Internationalization (i18n)**: Seamless English & Korean support across all itineraries, highlights, pricing, and administrative data with animated switcher controls.
- **Interactive Island Map**: Custom SVG interactive route map highlighting Sri Lanka's cultural triangle, tea country, southern coast, and safari zones.
- **Golf Tourism Specialists**: Dedicated modules for Sri Lanka's top championship courses (Royal Colombo, Victoria Golf Resort, Nuwara Eliya, Shangri-La Hambantota, Eagles' Golf Links).
- **Direct VIP Concierge**: 1-click WhatsApp, KakaoTalk (`@lankaluxe`), and email connectivity for direct bespoke inquiries.
- **Full Admin CMS & CRM Dashboard**: Secure administrative atelier for real-time itinerary editing, package creation, blog publishing, and lead status pipeline management.

---

## 🔄 System & User Workflows

```
  ┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
  │   Guest / User  │ ────> │  Inquiry / Chat  │ ────> │    Admin CRM    │
  │  Explores Site  │       │ (WhatsApp/Kakao) │       │ Lead Pipeline   │
  └─────────────────┘       └──────────────────┘       └─────────────────┘
                                                                │
  ┌─────────────────┐       ┌──────────────────┐                │
  │ Confirmed Tour  │ <──── │ VIP Concierge    │ <──────────────┘
  │ & Luxury Trip   │       │ Custom Itinerary │
  └─────────────────┘       └──────────────────┘
```

### 1. Guest Journey & Booking Workflow

```
[1. Discover & Explore]
   ├── Browse Signature Journeys & Curated Golf Packages
   ├── Interactive Regional Map (Colombo, Kandy, Nuwara Eliya, Galle, Yala, Sigiriya)
   └── View Founder Credentials (SLTDA Licence C-1734, Kelaniya Archaeology)
            │
            ▼
[2. Inquiry & Custom Plan Submission]
   ├── Option A: Interactive Inquiry Drawer (travelers, dates, budget, interests)
   ├── Option B: Instant 1-Click WhatsApp Concierge
   └── Option C: KakaoTalk Chat (@lankaluxe) for Korean travelers
            │
            ▼
[3. Real-Time Lead Ingestion]
   ├── Auto-saved to Admin CRM Pipeline with timestamp and inquiry ID
   └── Automated email notification / instant dispatch
            │
            ▼
[4. Founder Review & Tailor-Made Itinerary]
   ├── Founder reviews guest preferences & drafts bespoke route
   ├── Direct consultation in English or Korean
   └── Itinerary, private chauffeur, and 5-star villa confirmations
            │
            ▼
[5. VIP Execution & On-Trip Support]
   └── 24/7 dedicated local concierge assistance throughout Sri Lanka
```

### 2. Admin Content & Media Workflow

```
[Admin Authentication]
   └── Access `/admin` via secure credentials / passcodes
            │
            ▼
[Content Management Atelier]
   ├── Tours & Journeys: Edit prices, multi-day schedules, hotel lists, inclusions/exclusions
   ├── Golf Packages: Configure championship courses, tee times, and resort pairings
   ├── Destinations & Map: Adjust region guides and map pin coordinates
   └── Editorial Blog: Publish luxury travel articles and journals
            │
            ▼
[Cloud Image Upload (ImgBB)]
   ├── Upload new photos via `/api/upload` (or `uploadToImgBB` utility)
   ├── Automatically converted to base64, uploaded to ImgBB CDN (`i.ibb.co`)
   └── URL saved directly to content data
            │
            ▼
[Live Synchronization]
   └── Changes instantly reflected across the live application via `useContentStore`
```

### 3. Developer & Deployment Workflow

```
[Local Development]
   ├── Run `npm run dev` (powered by Next.js Turbopack)
   └── TypeScript strict validation & hot-module reloading
            │
            ▼
[Quality Assurance & Verification]
   ├── Build check: `npm run build`
   ├── i18n key verification across English and Korean
   └── Environment variable audit (`DATABASE_URL`, `IMGBB_API_KEY`, `JWT_SECRET`)
            │
            ▼
[Production Deployment]
   └── Automatic CI/CD deployment to Vercel
```
>>>>>>> Stashed changes

---

## 🛠️ Tech Stack

<<<<<<< Updated upstream
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
=======
| Category | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH color spaces & custom themes |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) (`motion/react`) |
| **Image CDN & Storage** | [ImgBB API](https://api.imgbb.com/) (`i.ibb.co`) |
| **Database & ORM** | MySQL + [Prisma ORM](https://www.prisma.io/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State & Store** | React Context + LocalStorage Persistence (`useContentStore`, `useI18n`) |
>>>>>>> Stashed changes

---

## 🚀 Getting Started

### Prerequisites

<<<<<<< Updated upstream
- **Node.js**: v18.18 or higher (v20+ recommended)
- **MySQL Database**: Local MySQL (XAMPP, Laragon, MySQL Workbench) or Cloud MySQL (PlanetScale, Railway, AWS RDS, Aiven)
=======
- **Node.js** (v18.18.0 or higher recommended)
- **npm** / **bun** / **yarn**
>>>>>>> Stashed changes

---

<<<<<<< Updated upstream
### Installation & Setup

1. **Clone the repository:**
=======
1. **Clone the repository**:
>>>>>>> Stashed changes
   ```bash
   git clone <repository-url>
   cd lanka-luxe-journeys
   ```

<<<<<<< Updated upstream
2. **Install dependencies:**
=======
2. **Install dependencies**:
>>>>>>> Stashed changes
   ```bash
   npm install
   ```

<<<<<<< Updated upstream
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
=======
3. **Configure Environment Variables**:
   Create or update `.env` in the root folder with the following configuration:

   ```env
   # MySQL Database Configuration
   DATABASE_URL="mysql://root:password@localhost:3306/lanka_luxe_db"
   DB_TYPE="mysql"
   DB_HOST="localhost"
   DB_PORT="3306"
   DB_NAME="lanka_luxe_db"
   DB_USER="root"
   DB_PASSWORD="password"
   DB_SSL="false"

   # Authentication & Security
   JWT_SECRET="your-super-secret-jwt-key"
   ADMIN_DEFAULT_USER="admin"
   ADMIN_DEFAULT_PASSWORD="admin123"

   # Application Base URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # ImgBB API Configuration
   IMGBB_API_KEY="your-imgbb-api-key"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🖼️ ImgBB Image Management & API

All project images are hosted on ImgBB. The project provides built-in utilities and an API endpoint to upload and manage images:

- **API Endpoint**: `POST /api/upload`
  - Accepts `multipart/form-data` with an `image` file, or JSON with a `base64` string or remote image URL.
  - Automatically uploads to ImgBB and returns `{ success: true, url, display_url, thumb, delete_url }`.
- **Client Helper**: `src/lib/imgbb.ts`
  ```typescript
  import { uploadToImgBB } from "@/lib/imgbb";

  // Upload a File object or base64 string
  const result = await uploadToImgBB(file, "custom_image_name");
  console.log(result.url); // https://i.ibb.co/...
  ```
- **Remote Image Domains**: Configured in `next.config.mjs` for `i.ibb.co` and `ibb.co`.

---

## 🏛️ Admin Dashboard & CMS Atelier

Lanka Luxe Journeys includes an administrative suite allowing real-time customization and live synchronization of all website content:

- **Access URL**: `/admin` (or `/admin/login`)
- **Default Credentials / Passcodes**: `admin` / `admin123` (or passcodes `lankaluxe2026`, `C-1734`)
- **Dashboard Features**:
  - **Overview**: Inquiry conversion statistics, live activity metrics, and quick action shortcuts.
  - **Inquiries CRM**: Lead status pipeline (`New`, `In Progress`, `Contacted`, `Booked`, `Archived`), private notes, direct WhatsApp and email actions.
  - **Tours & Journeys**: Complete CRUD management with day-by-day itinerary builders, hotels, inclusions/exclusions, pricing, and bilingual copy.
  - **Golf Packages**: Championship course manager, hole information, tee times, and luxury hotel pairings.
  - **Destinations & Map**: Region guides, interactive island map coordinates, and recommended stay duration.
  - **Experiences**: Signature luxury experiences editor.
  - **Journal & Blog**: Editorial article publisher.
  - **Site & Founder Settings**: Founder credentials (SLTDA Licence C-1734, Kelaniya archaeology diploma), contact numbers (WhatsApp, KakaoTalk, phone, email), and homepage hero copy.

---

## 📁 Project Structure

```
lanka-luxe-journeys/
├── public/                 # Favicon, static assets, world map SVG
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── about/          # About page & founder profile
│   │   ├── admin/          # Admin Dashboard & CMS Atelier modules
│   │   ├── api/            # Serverless API routes (upload, auth, inquiries)
│   │   │   └── upload/     # ImgBB image upload API endpoint
│   │   ├── blog/           # Editorial journals & article details
│   │   ├── contact/        # Contact page with interactive inquiries
│   │   ├── destinations/   # Destination directory & dynamic slug pages
│   │   ├── experiences/    # Curated luxury experience showcases
│   │   ├── golf/           # Golf tour packages & championship courses
│   │   ├── tours/          # Signature tour packages & itinerary views
│   │   ├── layout.tsx      # Root application layout & metadata
│   │   └── page.tsx        # Homepage with immersive hero & interactive sections
│   ├── components/         # Reusable UI elements (Navbar, Footer, Modals, Forms, Map)
│   ├── data/
│   │   └── site.ts         # Master data definitions & ImgBB media collections
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── content-store.tsx # Global dynamic CMS store with localStorage sync
│   │   ├── i18n.tsx        # English & Korean localization provider & hook
│   │   ├── imgbb.ts        # ImgBB image upload utility helper
│   │   └── inquiry-context.tsx # Inquiry drawer state manager
│   └── styles.css          # Tailwind CSS v4 styling & typography layers
├── next.config.mjs         # Next.js configuration & ImgBB remote patterns
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 📄 License & Attribution

Copyright © 2026 **Lanka Luxe Journeys**. All rights reserved.  
Official SLTDA Tourist Guide Licence: **C-1734**.
>>>>>>> Stashed changes
