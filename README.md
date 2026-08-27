# Lanka Luxe Journeys

A premium, world-class luxury travel and tourism web application designed to promote bespoke travel experiences in Sri Lanka. The platform focuses on high-end international travelers, specifically catering to Korean golf travelers, luxury holiday visitors, couples, families, and those seeking custom Sri Lankan experiences.

## Overview

Lanka Luxe Journeys is built with a modern, high-performance tech stack ensuring a cinematic and highly interactive user experience. The design avoids generic templates, opting instead for a unique, high-end, editorial atmosphere characterized by:
- Deep luxury navy and elegant gold accents.
- Large bold editorial typography.
- Floating asymmetrical image layouts and smooth cinematic transitions.
- Fully responsive, touch-friendly navigation across all devices.

## Features

- **Immersive Hero Section**: Parallax animations, animated flight paths, and responsive image mosaics.
- **Dynamic Content Sections**: Interactive scroll animations using `framer-motion` (e.g., sticky scroll layouts, animated counters).
- **Internationalization Support**: Bilingual capabilities (English and Korean) via a custom `useI18n` context API.
- **Luxury Golf & Tour Filtering**: Dedicated sections for signature journeys and curated golf holiday packages.
- **Inquiry & Bespoke Planning**: Built-in interactive inquiry forms for customized trip planning.

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: TanStack Router (`@tanstack/react-router`)
- **Styling**: Tailwind CSS with custom theme extensions
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
The application will be available at `http://localhost:8080` (or your configured port).

### Build

To create a production-ready build:
```bash
npm run build
```

## Structure & Architecture

- `src/routes/`: Contains all page routes (e.g., `index.tsx`, `tours.tsx`, `about.tsx`) utilizing TanStack Router.
- `src/components/`: Reusable UI components (Buttons, Cards, Forms, Animations).
- `src/data/`: Static data and content files (e.g., `site.ts`) powering the application.
- `src/lib/`: Utility functions and context providers (e.g., `i18n.tsx`, `inquiry-context.tsx`).

## Contributing

We welcome contributions to enhance the Lanka Luxe Journeys platform. Please ensure your code adheres to the project's premium design standards and architectural guidelines. Do not rewrite published git history.

## License

Copyright © 2024 Lanka Luxe Journeys. All Rights Reserved.
