import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useI18n, LANGUAGES, type Lang } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { LuxuryButton } from "./LuxuryButton";
import { Menu, X, Globe, ChevronDown, Phone, MessageSquare } from "lucide-react";
import { contact } from "@/data/site";
import { AnimatePresence, motion } from "motion/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { lang, setLang, t } = useI18n();
  const { openInquiry } = useInquiry();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/tours", label: t("nav.tours") },
    { to: "/golf", label: t("nav.golf") },
    { to: "/destinations", label: t("nav.destinations") },
    { to: "/experiences", label: t("nav.experiences") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-slate-100 ${
          isScrolled ? "py-3 shadow-sm" : "py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group text-left">
            <span className="font-display text-xl sm:text-2xl lg:text-[1.6rem] font-medium tracking-[0.16em] text-[#081A33] group-hover:text-[#C8A45D] transition-colors duration-300">
              LANKA LUXE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 relative py-1 ${
                    isActive
                      ? "text-[#C8A45D] font-bold"
                      : "text-slate-600 hover:text-[#081A33]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#C8A45D]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher (All Screens) */}
            <div className="flex relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#C8A45D] px-1 sm:px-3 py-2 cursor-pointer transition-colors"
              >
                <Globe className="w-4 h-4 text-[#C8A45D]" />
                {LANGUAGES.find((l) => l.code === lang)?.label || "EN"}
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden py-1"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          lang === l.code
                            ? "bg-slate-50 text-[#C8A45D]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#081A33]"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Plan Your Journey CTA Button (Desktop) */}
            <div className="hidden sm:block">
              <LuxuryButton
                variant="pill"
                size="sm"
                onClick={() => openInquiry()}
                withArrow
              >
                {t("cta.plan")}
              </LuxuryButton>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 pt-24 pb-8 px-6 bg-white text-slate-800 xl:hidden flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[#C8A45D] mb-4 font-semibold">
                {lang === "ko" ? "메뉴" : "Navigation"}
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive =
                    link.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.to);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xl font-bold py-2.5 border-b border-slate-100 flex items-center justify-between ${
                        isActive ? "text-[#C8A45D]" : "text-[#081A33] hover:text-[#C8A45D]"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#C8A45D]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Footer details */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <LuxuryButton
                variant="pill"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openInquiry();
                }}
              >
                {t("cta.plan")}
              </LuxuryButton>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#081A33] font-medium"
                >
                  <Phone className="w-4 h-4 text-[#C8A45D]" />
                  <span className="truncate">{contact.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#081A33] font-medium"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

