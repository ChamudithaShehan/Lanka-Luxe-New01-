import { Link } from "@tanstack/react-router";
import { type Post } from "@/data/site";
import { useI18n } from "@/lib/i18n";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: Post;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const { tl, t, lang } = useI18n();

  return (
    <article
      className={`group bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        className || ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={post.image}
          alt={tl(post.title)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-[#1E7B9E] shrink-0" />
            <span>{post.date}</span>
          </div>

          <h3 className="text-xl font-bold text-[#081A33] group-hover:text-[#1E7B9E] transition-colors mb-2.5 line-clamp-2 leading-snug">
            <Link to="/blog/$slug" params={{ slug: post.slug }}>
              {tl(post.title)}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 line-clamp-2">
            {tl(post.excerpt)}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E7B9E] text-white text-xs font-semibold hover:bg-[#156380] transition-colors shadow-sm"
          >
            <span>{lang === "ko" ? "기사 읽기" : "Read more"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
