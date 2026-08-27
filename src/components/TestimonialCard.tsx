"use client";

import { type Testimonial } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { tl } = useI18n();

  return (
    <div
      className={`relative flex flex-col justify-between p-8 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 ${
        className || ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <Quote className="w-8 h-8 text-[#C8A45D]/30" />
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-[#FF9F1C]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FF9F1C]" />
            ))}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed italic mb-8">
          "{tl(testimonial.quote)}"
        </blockquote>
      </div>

      {/* Author Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm font-bold text-[#081A33]">{testimonial.name}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-normal">
            <span>{testimonial.country}</span>
            <span>•</span>
            <span className="text-[#C8A45D] font-medium">{testimonial.trip}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
