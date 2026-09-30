import type { Metadata } from "next";
import "@/styles.css";
import { I18nProvider } from "@/lib/i18n";
import { InquiryProvider } from "@/lib/inquiry-context";
import { ContentProvider } from "@/lib/content-store";
import { SiteChrome } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Lanka Luxe Journeys | Private Sri Lanka Travel & Golf Holidays",
  description:
    "Private Sri Lankan Journeys, Personally Crafted. Founded by Iroshan Jayawickrame · SLTDA Registered Guide C-1734 · 10+ Years in Sri Lankan Tourism. Personal travel support, private transportation, and local expertise.",
  authors: [{ name: "Lanka Luxe Journeys" }],
  openGraph: {
    title: "Lanka Luxe Journeys | Discover Sri Lanka With A Local Expert",
    description:
      "Private journeys, authentic experiences and thoughtfully crafted travel, personally designed around you by SLTDA Registered Guide Iroshan Jayawickrame.",
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
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
          <ContentProvider>
            <InquiryProvider>
              <SiteChrome>{children}</SiteChrome>
              <Toaster position="top-center" richColors />
            </InquiryProvider>
          </ContentProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
