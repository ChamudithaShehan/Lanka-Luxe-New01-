"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 16, 24, 48],
  itemLabel = "items",
}: AdminPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    if (totalItems === 0) return null;
    // When only 1 page, still show item counter and page size selector if available
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#1B2D4A]/60 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">1–{totalItems}</span> of{" "}
          <span className="font-semibold text-white">{totalItems}</span> {itemLabel}
        </div>
        {onPageSizeChange && totalItems > Math.min(...pageSizeOptions) && (
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg bg-[#07111E] border border-[#1B2D4A] text-slate-200 text-xs focus:border-[#C8A45D] outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1B2D4A]/60 text-xs text-slate-400">
      {/* Left: Range Counter */}
      <div className="flex items-center gap-4">
        <div>
          Showing{" "}
          <span className="font-semibold text-white">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="font-semibold text-white">{totalItems}</span> {itemLabel}
        </div>

        {/* Page Size Selector */}
        {onPageSizeChange && (
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#1B2D4A]">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-[#07111E] border border-[#1B2D4A] text-slate-200 text-xs focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Interactive Page Numbers & Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
          className="p-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-slate-400 hover:text-white hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:hover:border-[#1B2D4A] disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
          className="p-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-slate-400 hover:text-white hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:hover:border-[#1B2D4A] disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-500 font-mono select-none"
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
                onClick={() => onPageChange(page as number)}
                className={`min-w-7 h-7 px-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#C8A45D] text-[#081426] shadow-sm font-bold"
                    : "bg-[#0B1A30] border border-[#1B2D4A] text-slate-300 hover:text-white hover:border-[#C8A45D]/40"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
          className="p-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-slate-400 hover:text-white hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:hover:border-[#1B2D4A] disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
          className="p-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-slate-400 hover:text-white hover:border-[#C8A45D]/40 disabled:opacity-40 disabled:hover:border-[#1B2D4A] disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
