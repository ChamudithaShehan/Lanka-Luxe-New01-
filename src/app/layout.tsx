import type { Metadata } from "next";
import "@/styles.css";
import { I18nProvider } from "@/lib/i18n";
import { InquiryProvider } from "@/lib/inquiry-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingActions } from "@/components/FloatingActions";
import { InquiryModal } from "@/components/InquiryModal";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Lanka Luxe Journeys | Luxury Sri Lanka Travel & Golf Holidays",
  description:
    "Private travel atelier in Colombo crafting bespoke luxury itineraries, championship golf escapes, private wildlife safaris, and wellness retreats across Sri Lanka.",
  authors: [{ name: "Lanka Luxe Journeys" }],
  openGraph: {
    title: "Lanka Luxe Journeys | Luxury Sri Lanka Travel",
    description:
      "Discover Sri Lanka in extraordinary style. Private villas, bespoke golf itineraries, wildlife naturalists and 24/7 concierge.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@LankaLuxe",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
        />
      </head>
      <body
        className="bg-navy text-foreground min-h-screen flex flex-col font-sans selection:bg-gold selection:text-navy antialiased"
        suppressHydrationWarning
      >
        <I18nProvider>
          <InquiryProvider>
            <ScrollProgress />
            <Navbar />
            <main className="flex-1 w-full overflow-x-clip">{children}</main>
            <Footer />
            <FloatingActions />
            <InquiryModal />
            <Toaster position="top-center" richColors />
          </InquiryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
