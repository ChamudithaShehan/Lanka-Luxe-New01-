import { useState } from "react";
import { destinations } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Compass, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function InteractiveSriLankaMap() {
  const [selectedSlug, setSelectedSlug] = useState<string>("sigiriya");
  const { tl, lang } = useI18n();

  const selected =
    destinations.find((d) => d.slug === selectedSlug) || destinations[0]!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Map Interactive Visual Area (Left/Top) */}
      <div className="lg:col-span-7 relative flex items-center justify-center p-6 sm:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden min-h-[460px] sm:min-h-[540px]">
        {/* Subtle decorative background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Compass indicator */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 pointer-events-none font-medium">
          <Compass className="w-4 h-4 text-[#C8A45D] animate-spin-slow" />
          <span>The Island of Sri Lanka</span>
        </div>

        {/* Ocean coordinate labels */}
        <div className="absolute bottom-6 left-6 text-[0.625rem] font-mono tracking-widest text-slate-300 pointer-events-none">
          LAT 7.8731° N, LON 80.7718° E
        </div>
        <div className="absolute top-6 right-6 text-[0.625rem] font-mono tracking-widest text-slate-300 pointer-events-none">
          INDIAN OCEAN
        </div>

        {/* SVG Sri Lanka Stylized Landmass */}
        <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] flex items-center justify-center">
          <svg
            viewBox="0 0 400 520"
            className="w-full h-full drop-shadow-[0_15px_30px_rgba(30,123,158,0.12)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sri Lanka Organic Island Contour */}
            <path
              d="M 195 38 
                 C 215 55, 238 85, 255 125 
                 C 278 175, 305 210, 300 280 
                 C 295 350, 280 405, 240 455 
                 C 210 490, 175 498, 150 480 
                 C 120 460, 105 410, 100 350 
                 C 95 290, 110 230, 128 170 
                 C 142 120, 170 55, 195 38 Z"
              className="fill-slate-100 stroke-[#C8A45D]/30 transition-colors duration-500 hover:fill-slate-50"
              strokeWidth="1.5"
            />

            {/* Interior Topography / Elevation Contour lines */}
            <path
              d="M 175 180 C 220 180, 245 220, 240 280 C 235 340, 210 380, 175 380 C 145 380, 135 320, 140 270 C 145 220, 160 180, 175 180 Z"
              stroke="#C8A45D"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
            />
            <path
              d="M 185 220 C 215 220, 230 250, 225 295 C 220 335, 200 360, 180 360 C 160 360, 150 325, 155 285 C 160 250, 170 220, 185 220 Z"
              stroke="#C8A45D"
              strokeOpacity="0.35"
              strokeWidth="1"
              fill="#C8A45D"
              fillOpacity="0.05"
            />
          </svg>

          {/* Interactive Pins placed with percentage positions */}
          {destinations.map((dest) => {
            const isSelected = dest.slug === selectedSlug;
            return (
              <button
                key={dest.slug}
                onClick={() => setSelectedSlug(dest.slug)}
                onMouseEnter={() => setSelectedSlug(dest.slug)}
                aria-label={`Select ${tl(dest.name)}`}
                style={{
                  left: `${dest.x}%`,
                  top: `${dest.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-20"
              >
                {/* Outer pulsing ring */}
                <div
                  className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-[#C8A45D]/25 scale-125 animate-ping opacity-75"
                      : "bg-transparent group-hover:bg-[#C8A45D]/15"
                  }`}
                />

                {/* Core Pin */}
                <div
                  className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? "bg-[#C8A45D] border-white scale-125 shadow-md shadow-[#C8A45D]/40"
                      : "bg-white border-[#C8A45D] group-hover:scale-110 shadow-xs"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-[#C8A45D]"
                    }`}
                  />
                </div>

                {/* Floating Pin Label */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap text-[0.625rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all duration-200 pointer-events-none ${
                    isSelected
                      ? "bg-[#081A33] text-white shadow-md opacity-100 scale-100"
                      : "bg-white text-slate-700 border border-slate-200 opacity-80 group-hover:opacity-100 shadow-xs"
                  }`}
                >
                  {tl(dest.name)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Showcase Detail (Right/Bottom) */}
      <div className="lg:col-span-5 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col"
          >
            {/* Destination Visual */}
            <div className="relative aspect-[16/9] rounded-[1.25rem] overflow-hidden mb-6 bg-slate-100 shadow-xs">
              <img
                src={selected.image}
                alt={tl(selected.name)}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
                  {selected.region}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF9F1C] text-white text-[0.6875rem] font-bold shadow-xs">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  <span>4.9</span>
                </div>
              </div>
            </div>

            {/* Title & Short Story */}
            <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{selected.region}, Sri Lanka</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#081A33] mb-2 leading-snug">
              {tl(selected.name)}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
              {tl(selected.long)}
            </p>

            {/* Best Experiences Pill List */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] mb-2">
                {lang === "ko" ? "대표 체험" : "Best Experiences"}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.best.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Link to Full Destination Guide */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>{selected.stay}</span>
              </div>

              <Link
                to="/destinations/$slug"
                params={{ slug: selected.slug }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
              >
                <span>{lang === "ko" ? "가이드 보기" : "Read more"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Island Destination Selector Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {destinations.map((d) => (
            <button
              key={d.slug}
              onClick={() => setSelectedSlug(d.slug)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                d.slug === selectedSlug
                  ? "bg-[#081A33] text-white shadow-sm font-semibold"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tl(d.name)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
