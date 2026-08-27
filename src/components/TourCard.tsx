import { Link } from "@tanstack/react-router";
import { type Tour } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { Calendar, MapPin, Star, ArrowRight } from "lucide-react";
import { useInquiry } from "@/lib/inquiry-context";

interface TourCardProps {
  tour: Tour;
  className?: string;
  variant?: "default" | "horizontal";
}

export function TourCard({ tour, className, variant = "default" }: TourCardProps) {
  const { tl, t, lang } = useI18n();
  const { openInquiry } = useInquiry();

  if (variant === "horizontal") {
    return (
      <div
        className={`group bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
          className || ""
        }`}
      >
        <div className="md:w-1/2 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-100">
          <img
            src={tour.image}
            alt={tl(tour.name)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#081A33] shadow-sm">
              {tour.category}
            </span>
          </div>
        </div>

        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] font-medium mb-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{tour.locations.join(", ")}</span>
            </div>

            <h3 className="text-2xl font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors mb-3 leading-snug">
              <Link to="/tours/$slug" params={{ slug: tour.slug }}>
                {tl(tour.name)}
              </Link>
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 line-clamp-2">
              {tl(tour.short)}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Duration Pill */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                <Calendar className="w-4 h-4 text-[#C8A45D]" />
                <div>
                  <span className="block text-[0.625rem] text-slate-400 font-normal uppercase">
                    Duration
                  </span>
                  <span>
                    {tour.days} Days - {tour.days - 1} Nights
                  </span>
                </div>
              </div>

              {/* Star Rating Badge & Price */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF9F1C] text-white text-xs font-bold shadow-sm">
                  <Star className="w-3 h-3 fill-white" />
                  <span>4.9</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#081A33]">
                    {tour.price}
                  </span>
                  <span className="text-xs text-slate-400 block font-normal">
                    / Traveler
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Link
                to="/tours/$slug"
                params={{ slug: tour.slug }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
              >
                <span>Read more</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <button
                type="button"
                onClick={() =>
                  openInquiry({
                    tourName: tl(tour.name),
                    interest: tour.category.toLowerCase(),
                  })
                }
                className="text-xs font-semibold text-slate-600 hover:text-[#C8A45D] transition-colors uppercase tracking-wider"
              >
                {lang === "ko" ? "맞춤 문의" : "Inquire Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Vertical Card
  return (
    <div
      className={`group bg-white rounded-[1.75rem] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        className || ""
      }`}
    >
      {/* Top Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={tour.image}
          alt={tl(tour.name)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
            {tour.category}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Pin */}
          <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tour.locations.join(", ")}</span>
          </div>

          {/* Tour Title */}
          <h3 className="text-xl font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors duration-200 mb-2 leading-snug">
            <Link to="/tours/$slug" params={{ slug: tour.slug }}>
              {tl(tour.name)}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 line-clamp-2">
            {tl(tour.short)}
          </p>
        </div>

        {/* Card Footer Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            {/* Duration pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>
                {tour.days} Days - {tour.days - 1} Nights
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF9F1C] text-white text-[0.6875rem] font-bold shadow-xs">
              <Star className="w-2.5 h-2.5 fill-white" />
              <span>4.9</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-lg font-bold text-[#081A33]">
                {tour.price}
              </span>
              <span className="text-[0.6875rem] text-slate-400 ml-1">
                / traveler
              </span>
            </div>

            <Link
              to="/tours/$slug"
              params={{ slug: tour.slug }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
            >
              <span>{lang === "ko" ? "자세히" : "Read more"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
