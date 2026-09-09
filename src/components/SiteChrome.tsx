"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingActions } from "@/components/FloatingActions";
import { InquiryModal } from "@/components/InquiryModal";

import { DatabaseErrorBanner } from "@/components/DatabaseErrorBanner";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <DatabaseErrorBanner />
      <main className="flex-1 w-full overflow-x-clip">{children}</main>
      <Footer />
      <FloatingActions />
      <InquiryModal />
    </>
  );
}
