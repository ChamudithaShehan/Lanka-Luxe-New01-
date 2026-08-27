import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";
import { InquiryProvider } from "../lib/inquiry-context";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";
import { FloatingActions } from "../components/FloatingActions";
import { InquiryModal } from "../components/InquiryModal";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy px-4 pt-24 text-white">
      <div className="max-w-md text-center">
        <span className="eyebrow block mb-2">404 Error</span>
        <h1 className="text-6xl font-display font-light text-gold mb-4">404</h1>
        <h2 className="text-2xl font-light text-white mb-3">Page Not Found</h2>
        <p className="text-sm text-mist mb-8 font-light">
          The sanctuary you are searching for is not available or has moved to a new destination.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy font-semibold text-xs tracking-[0.2em] uppercase rounded-[2px] hover:bg-gold-light transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy px-4 pt-24 text-white">
      <div className="max-w-md text-center">
        <span className="eyebrow block mb-2">Notice</span>
        <h1 className="text-3xl font-display font-light text-gold mb-4">
          Journey Unavailable
        </h1>
        <p className="text-sm text-mist mb-8 font-light">
          Something unexpected occurred while loading this experience. Please refresh or return to the main hall.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="px-6 py-3 bg-gold text-navy font-semibold text-xs tracking-[0.2em] uppercase rounded-[2px] hover:bg-gold-light transition-colors cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-navy-2 border border-white/20 text-white font-medium text-xs tracking-[0.2em] uppercase rounded-[2px] hover:border-gold transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lanka Luxe Journeys | Luxury Sri Lanka Travel & Golf Holidays" },
      {
        name: "description",
        content:
          "Private travel atelier in Colombo crafting bespoke luxury itineraries, championship golf escapes, private wildlife safaris, and wellness retreats across Sri Lanka.",
      },
      { name: "author", content: "Lanka Luxe Journeys" },
      { property: "og:title", content: "Lanka Luxe Journeys | Luxury Sri Lanka Travel" },
      {
        property: "og:description",
        content:
          "Discover Sri Lanka in extraordinary style. Private villas, bespoke golf itineraries, wildlife naturalists and 24/7 concierge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LankaLuxe" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-navy text-foreground min-h-screen flex flex-col font-sans selection:bg-gold selection:text-navy antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <InquiryProvider>
          <ScrollProgress />
          <Navbar />
          <main className="flex-1 w-full overflow-x-clip">
            <Outlet />
          </main>
          <Footer />
          <FloatingActions />
          <InquiryModal />
          <Toaster position="top-center" richColors />
        </InquiryProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
