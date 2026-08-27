"use client";

import Link from "next/link";
import { type Experience } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles } from "lucide-react";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  className?: string;
}

export function ExperienceCard({ experience, index, className }: ExperienceCardProps) {
  const { tl, lang } = useI18n();

  return (
    <div
      className={`group bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        className || ""
      }`}
    >
      {/* Visual */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
        <img
          src={experience.image}
          alt={tl(experience.title)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C8A45D]" />
            Experience 0{index + 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-1">
            {lang === "ko" ? "시그니처 체험" : "Signature Immersion"}
          </span>

          <h3 className="text-xl font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors mb-2 leading-snug">
            {tl(experience.title)}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
            {tl(experience.text)}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
          >
            <span>{lang === "ko" ? "체험 자세히 보기" : "Read more"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
