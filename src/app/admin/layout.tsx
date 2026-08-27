"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContentStore } from "@/lib/content-store";
import {
  LayoutDashboard,
  Compass,
  Flag,
  MapPin,
  Sparkles,
  BookOpen,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  RotateCcw,
  Check,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiries CRM", icon: Inbox, hasBadge: true },
  { href: "/admin/tours", label: "Tours & Journeys", icon: Compass },
  { href: "/admin/golf", label: "Golf Packages", icon: Flag },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { href: "/admin/blog", label: "Journal & Blog", icon: BookOpen },
  { href: "/admin/settings", label: "Site & Founder Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { inquiries, resetToDefaults, siteSettings } = useContentStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // If on /admin/login, don't wrap with admin chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("llj_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.replace("/admin/login");
        }
      }
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07111E] flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-serif">
            Authenticating Admin...
          </span>
        </div>
      </div>
    );
  }

  const unreadInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  const handleLogout = () => {
    localStorage.removeItem("llj_admin_auth");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.replace("/admin/login");
  };

  const handleResetConfirm = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
    toast.success("Site content reset to original factory defaults!");
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-slate-100 flex font-sans selection:bg-[#C8A45D] selection:text-[#0B1A30]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B1A30] border-r border-[#1B2D4A] z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between">
          <Link
            href="/admin"
            className="flex flex-col"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="font-serif text-lg tracking-wider font-semibold text-white">
              LANKA <span className="text-[#C8A45D]">LUXE</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D]/80 font-medium">
              Management Atelier
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#C8A45D] text-[#081426] shadow-[0_4px_16px_rgba(200,164,93,0.3)] font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-[#12233D]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#081426]" : "text-[#C8A45D]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.hasBadge && unreadInquiriesCount > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#081426] text-[#C8A45D]"
                        : "bg-[#C8A45D] text-[#081426]"
                    }`}
                  >
                    {unreadInquiriesCount} new
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-[#1B2D4A] space-y-3 bg-[#081426]/60">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D] font-serif font-bold text-xs">
              IJ
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {siteSettings.founderName}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#C8A45D]" />
                <span>SLTDA {siteSettings.licenseNumber}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1B2D4A]/50 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="hover:text-[#C8A45D] flex items-center gap-1.5 transition-colors p-1"
              title="Reset content to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="hover:text-red-400 flex items-center gap-1.5 transition-colors p-1"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#07111E]/90 backdrop-blur-md border-b border-[#1B2D4A] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#12233D]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xs uppercase tracking-widest text-[#C8A45D] font-semibold">
              Atelier CMS & Operations Control
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12233D] hover:bg-[#1B2D4A] text-xs font-semibold text-slate-200 hover:text-white transition-all border border-[#1B2D4A] shadow-sm"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A45D]" />
            </Link>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-[#C8A45D]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#C8A45D]" />
              Reset All Content to Factory Defaults?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              This will overwrite all custom edits made in the admin panel and restore the original curated tours, golf courses, destinations, and settings.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
