"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  scrollToId?: string;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  showRange?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  scrollToId,
  totalItems,
  pageSize,
  itemLabel,
  showRange = false,
}: PaginationProps) {
  const { lang } = useI18n();

  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);

    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage - delta > 2) {
      pages.push("...");
    }

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem =
    pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : undefined;

  return (
    <nav
      aria-label={lang === "ko" ? "페이지 탐색" : "Pagination navigation"}
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 ${className}`}
    >
      {showRange && totalItems !== undefined && startItem && endItem && (
        <div className="text-xs text-slate-500 font-medium">
          {lang === "ko" ? (
            <>
              총 <span className="font-semibold text-[#081A33]">{totalItems}</span>개 중{" "}
              <span className="font-semibold text-[#081A33]">
                {startItem}–{endItem}
              </span>{" "}
              표시
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-[#081A33]">
                {startItem}–{endItem}
              </span>{" "}
              of <span className="font-semibold text-[#081A33]">{totalItems}</span>{" "}
              {itemLabel || "items"}
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* First page button for larger page counts */}
        {totalPages > 5 && (
          <button
            type="button"
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            title={lang === "ko" ? "첫 페이지" : "First Page"}
            aria-label={lang === "ko" ? "첫 페이지로 이동" : "Go to first page"}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm disabled:hover:border-slate-200"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous page button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          title={lang === "ko" ? "이전 페이지" : "Previous Page"}
          aria-label={lang === "ko" ? "이전 페이지로 이동" : "Go to previous page"}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm disabled:hover:border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-10 flex items-center justify-center text-slate-400 font-mono text-sm select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => handlePageClick(page as number)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={
                  lang === "ko" ? `${page} 페이지` : `Page ${page}`
                }
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? "bg-[#0B1F3A] text-[#C8A45D] shadow-md scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#C8A45D]/40 hover:text-[#081A33]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          title={lang === "ko" ? "다음 페이지" : "Next Page"}
          aria-label={lang === "ko" ? "다음 페이지로 이동" : "Go to next page"}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm disabled:hover:border-slate-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button for larger page counts */}
        {totalPages > 5 && (
          <button
            type="button"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            title={lang === "ko" ? "마지막 페이지" : "Last Page"}
            aria-label={lang === "ko" ? "마지막 페이지로 이동" : "Go to last page"}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm disabled:hover:border-slate-200"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}
