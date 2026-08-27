import { type GolfCourse } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { Flag, Hotel, MapPin, Moon, Star, ArrowRight } from "lucide-react";
import { useInquiry } from "@/lib/inquiry-context";

interface GolfCourseCardProps {
  course: GolfCourse;
  className?: string;
}

export function GolfCourseCard({ course, className }: GolfCourseCardProps) {
  const { tl, lang } = useI18n();
  const { openInquiry } = useInquiry();

  return (
    <div
      className={`group bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        className || ""
      }`}
    >
      {/* Course Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={course.image}
          alt={course.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm flex items-center gap-1.5">
            <Flag className="w-3 h-3 text-[#1E7B9E]" />
            {course.holes}
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
          <div className="flex items-center gap-1.5 text-xs text-[#1E7B9E] font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{course.location}</span>
          </div>

          <h3 className="text-xl font-bold text-[#081A33] group-hover:text-[#1E7B9E] transition-colors mb-2 leading-snug">
            {course.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-5 line-clamp-2">
            {tl(course.text)}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
              <Moon className="w-3.5 h-3.5 text-[#1E7B9E]" />
              <span>{course.nights}N / {course.rounds} Rds</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium truncate">
              <Hotel className="w-3.5 h-3.5 text-[#1E7B9E] shrink-0" />
              <span className="truncate">{course.hotel}</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                openInquiry({
                  tourName: `Golf Round: ${course.name}`,
                  interest: "golf",
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1E7B9E] text-white text-xs font-semibold hover:bg-[#156380] transition-colors shadow-sm cursor-pointer"
            >
              <span>{lang === "ko" ? "티타임 & 일정 예약" : "Book Tee Time & Stay"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
