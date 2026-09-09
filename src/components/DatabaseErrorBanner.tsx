"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { useI18n } from "@/lib/i18n";

export function DatabaseErrorBanner() {
  const { dbError, refreshContent, isLoading } = useContentStore();
  const { lang } = useI18n();

  if (!dbError) return null;

  return (
    <div className="w-full bg-[#180d0d] border-b border-red-500/30 text-red-200 py-3.5 px-4 sticky top-20 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-medium">
            {lang === "ko"
              ? "데이터베이스 연결이 원활하지 않아 최신 콘텐츠를 일시적으로 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
              : "Content is temporarily unavailable. Please try again later."}
          </span>
        </div>
        <button
          onClick={() => refreshContent()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/40 transition-colors font-semibold cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          <span>{lang === "ko" ? "다시 시도" : "Retry Connection"}</span>
        </button>
      </div>
    </div>
  );
}
