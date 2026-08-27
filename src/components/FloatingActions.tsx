"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ArrowUp } from "lucide-react";
import { contact } from "@/data/site";
import { useI18n } from "@/lib/i18n";

const KakaoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 3c-5.52 0-10 3.51-10 7.84 0 2.77 1.76 5.2 4.43 6.64-.17.65-.63 2.37-.67 2.53-.05.18.06.18.15.12.11-.08 1.83-1.22 2.6-1.74 1.12.31 2.3.49 3.49.49 5.52 0 10-3.51 10-7.84C22 6.51 17.52 3 12 3z" />
  </svg>
);

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const { lang } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappMsg = encodeURIComponent(
    lang === "ko"
      ? "안녕하세요! 스리랑카 럭셔리 여행/골프 여행 관련 문의드립니다."
      : "Hello! I would like to inquire about planning a luxury Sri Lanka journey.",
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* KakaoTalk Button */}
      <a
        href={`https://pf.kakao.com/${contact.kakao.replace('@', '_')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on KakaoTalk"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#FEE500] text-[#381E1F] shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-[#FEE500]/30"
      >
        <KakaoIcon className="w-6 h-6" />
        <span className="absolute right-14 whitespace-nowrap bg-navy-2/95 text-white text-xs px-3 py-1.5 rounded border border-gold/30 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
          {lang === "ko" ? "카카오톡 실시간 상담" : "Chat on KakaoTalk"}
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${contact.whatsapp}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-[#25D366]/30"
      >
        <MessageSquare className="w-5 h-5 fill-white text-white" />
        <span className="absolute right-14 whitespace-nowrap bg-navy-2/95 text-white text-xs px-3 py-1.5 rounded border border-gold/30 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
          {lang === "ko" ? "WhatsApp 실시간 상담" : "Chat on WhatsApp"}
        </span>
      </a>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-navy-2/90 border border-gold/40 text-gold hover:bg-gold hover:text-navy shadow-lg transition-all duration-300 active:scale-90 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}
