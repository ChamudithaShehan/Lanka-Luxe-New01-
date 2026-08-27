import { Link } from "@tanstack/react-router";
import { type Destination } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { MapPin, ArrowRight, Clock, Star } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export function DestinationCard({ destination, className }: DestinationCardProps) {
  const { tl, lang } = useI18n();

  return (
    <div
      className={`group bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        className || ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={tl(destination.name)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
            {destination.region}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF9F1C] text-white text-xs font-bold shadow-sm">
            <Star className="w-3 h-3 fill-white" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{destination.region}, Sri Lanka</span>
          </div>

          <h3 className="text-2xl font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors mb-2 leading-snug">
            <Link to="/destinations/$slug" params={{ slug: destination.slug }}>
              {tl(destination.name)}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-4 line-clamp-2">
            {tl(destination.short)}
          </p>

          {/* Highlights tags */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {destination.best.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[0.6875rem] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{destination.stay}</span>
          </div>

          <Link
            to="/destinations/$slug"
            params={{ slug: destination.slug }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
          >
            <span>{lang === "ko" ? "가이드 보기" : "Read more"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
