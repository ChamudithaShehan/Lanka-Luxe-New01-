import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

const galleryImages = [
  "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589309736404-2e142a2acdf0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625736300986-6bd123fb9e92?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590050752112-9c8c5da0735a?q=80&w=600&auto=format&fit=crop"
];

export function Footer() {
  const { t, lang } = useI18n();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy border-t border-white/10 text-white relative z-10 overflow-hidden">
      {/* Top Subscribe Section */}
      <div className="py-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-4">
          {lang === "ko" ? "여행 구독하기" : "SUBSCRIBE TO TRAVEL"}
        </h2>
        <p className="text-lg md:text-xl font-light text-mist mb-12">
          {lang === "ko" ? "특별한 여행 특가를 이메일로 받아보세요!" : "Travel deals to your inbox!"}
        </p>
        
        <form onSubmit={handleSubscribe} className="relative w-full max-w-md mx-auto mb-6 bg-white rounded-full p-1.5 flex shadow-2xl">
          <input
            type="email"
            required
            placeholder={lang === "ko" ? "이메일 주소" : "Email address"}
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 bg-transparent px-5 text-navy placeholder:text-navy/50 focus:outline-none text-base font-medium"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-colors shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        {subscribed ? (
          <p className="text-sm text-gold animate-fade-in">
            {lang === "ko" ? "구독해 주셔서 감사합니다." : "Thank you for subscribing."}
          </p>
        ) : (
          <p className="text-sm text-mist/60">
            {lang === "ko" ? "당사의 개인정보 보호정책에 따라 정보를 보호합니다." : "We are committed to protecting your privacy policy."}
          </p>
        )}
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4 sm:px-6 lg:px-8 pb-24 max-w-[1920px] mx-auto">
        {galleryImages.map((src, i) => (
          <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg">
            <img 
              src={src} 
              alt="Sri Lanka Gallery" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white scale-50 group-hover:scale-100 transition-transform duration-500 delay-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="relative border-t border-white/10 pt-16 pb-12">
        {/* Scroll to Top Button */}
        <button 
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-gold text-navy rounded-full flex items-center justify-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all z-20"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Giant background text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <span className="text-[18vw] font-display font-bold leading-none tracking-tight whitespace-nowrap text-white translate-y-12">
            LANKALUXE
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-sm text-mist/60 order-3 lg:order-1">
              Copyright 2024 Lanka Luxe All Rights Reserved.
            </div>
            
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-white font-medium uppercase tracking-[0.15em] order-1 lg:order-2">
              <Link to="/" className="hover:text-gold transition-colors">{t("nav.home")}</Link>
              <Link to="/tours" className="hover:text-gold transition-colors">{t("nav.tours")}</Link>
              <Link to="/destinations" className="hover:text-gold transition-colors">{t("nav.destinations")}</Link>
              <Link to="/blog" className="hover:text-gold transition-colors">{t("nav.blog")}</Link>
              <Link to="/contact" className="hover:text-gold transition-colors">{t("nav.contact")}</Link>
            </nav>

            <div className="flex items-center justify-center gap-4 order-2 lg:order-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
