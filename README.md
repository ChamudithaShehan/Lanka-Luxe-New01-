# Lanka Luxe Journeys

[![Live Preview](https://img.shields.io/badge/Live_Preview-lanka--luxe--new01.vercel.app-22A2BD?style=for-the-badge)](https://lanka-luxe-new01.vercel.app/)

A premium, world-class luxury travel and tourism web application designed to promote bespoke travel experiences in Sri Lanka. The platform focuses on high-end international travelers, specifically catering to Korean golf travelers, luxury holiday visitors, couples, families, and those seeking custom Sri Lankan experiences. Founded by **Iroshan Jayawickrame**, a professional tourist guide with more than 10 years of experience (SLTDA Licence: C-1734).

## Overview

Lanka Luxe Journeys is built with a modern, high-performance tech stack ensuring a cinematic and highly interactive user experience. The design avoids generic templates, opting instead for a unique, high-end, editorial atmosphere characterized by:
- Deep luxury navy and elegant gold accents.
- Large bold editorial typography.
- Floating asymmetrical image layouts and smooth cinematic transitions.
- Fully responsive, touch-friendly navigation across all devices.

## Features

- **Immersive Hero Section**: Parallax animations, animated flight paths, and responsive image mosaics.
- **Dynamic Content Sections**: Interactive scroll animations using `framer-motion` (e.g., sticky scroll layouts, animated counters).
- **Internationalization Support**: Bilingual capabilities (English and Korean) via a custom `useI18n` context API, featuring an animated pill-shaped language toggle in the navigation bar.
- **Luxury Golf & Tour Filtering**: Dedicated sections for signature journeys and curated golf holiday packages highlighting Sri Lanka's top 5 championship courses.
- **Inquiry & Bespoke Planning**: Built-in interactive inquiry forms for customized trip planning directly with the founder.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme extensions
- **Animation**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

Ensure you have Node.js (v18 or higher) and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate into the project directory:
   ```bash
   cd lanka-luxe-journeys
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Build

To create a production-ready build:
```bash
npm run build
```

## Admin Dashboard & CMS Atelier

Lanka Luxe Journeys includes a dedicated, passcode-protected **Admin Dashboard** allowing real-time editing and live synchronization of all website content:

- **Access URL**: `/admin` (or `/admin/login`)
- **Default Passcodes**: `admin123`, `lankaluxe2026`, or `C-1734`
- **Dashboard Modules**:
  - **Overview**: Executive metrics, recent inquiries list, and quick actions.
  - **Inquiries CRM**: Comprehensive lead management, status tracking (`New`, `In Progress`, `Contacted`, `Booked`, `Archived`), notes, and direct 1-click WhatsApp/Email triggers.
  - **Tours & Journeys**: Complete CRUD management with day-by-day itinerary builders, hotels, inclusions/exclusions, pricing, and bilingual copy.
  - **Golf Packages**: Championship course manager, hole info, tee times, and luxury hotel pairings.
  - **Destinations & Map**: Region guides, interactive island map coordinates, and recommended stay duration.
  - **Experiences**: Signature luxury experiences editor.
  - **Journal & Blog**: Editorial article publisher.
  - **Site & Founder Settings**: Founder credentials (SLTDA Licence C-1734, Kelaniya archaeology diploma), contact numbers (WhatsApp, KakaoTalk, phone, email), and homepage hero copy.

## Structure & Architecture

- `src/app/`: Next.js App Router pages and layouts (`layout.tsx`, `page.tsx`, `admin/`, `tours/`, `destinations/`, `golf/`, `blog/`, `about/`, `contact/`).
- `src/components/`: Reusable UI components (Buttons, Cards, Forms, Animations, Navbar, Footer).
- `src/data/`: Default curated data (`site.ts`).
- `src/lib/`: Global Content Store (`content-store.tsx`), internationalization (`i18n.tsx`), and inquiry state (`inquiry-context.tsx`).

## Contributing

We welcome contributions to enhance the Lanka Luxe Journeys platform. Please ensure your code adheres to the project's premium design standards and architectural guidelines. Do not rewrite published git history.

## License

Copyright © 2026 Lanka Luxe Journeys. All Rights Reserved..
