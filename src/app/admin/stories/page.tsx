"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useContentStore } from "@/lib/content-store";
import type { Testimonial } from "@/data/site";
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Star,
  Quote,
  Search,
  Globe,
  Compass,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPagination } from "@/components/admin/AdminPagination";

const sampleCuratedStories: Testimonial[] = [
  {
    id: "story-sample-1",
    name: "Dr. Alistair & Fiona Campbell",
    country: "United Kingdom",
    trip: "14-Day Tea Trails & Royal Colombo Golf",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote: {
      en: "From private tee times at Victoria Golf Resort to sunset tea tasting in Hatton, Lanka Luxe delivered an extraordinary concierge-level journey.",
      ko: "빅토리아 골프 리조트에서의 프라이빗 라운딩부터 해튼의 일몰 티 테이스팅까지, 랑카 룩스는 진정한 럭셔리 컨시어지 여행을 선사했습니다.",
    },
  },
  {
    id: "story-sample-2",
    name: "Min-Jun & Ji-Woo Park",
    country: "South Korea",
    trip: "Bespoke Honeymoon & Yala Safari",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: {
      en: "The leopard encounter in Yala followed by candlelit dining on the southern coast was pure magic. Truly the trip of a lifetime.",
      ko: "얄라 국립공원 전용 사파리와 남부 해안 캔들라이트 디너는 마법 같았습니다. 평생 잊지 못할 최고의 신혼여행이었습니다.",
    },
  },
  {
    id: "story-sample-3",
    name: "Marcus & Elena Vance",
    country: "Australia",
    trip: "Cultural Heritage & Wellness Retreat",
    rating: 5,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    quote: {
      en: "Our private chauffeur-guide and SLTDA licensed historian brought Sigiriya and Polonnaruwa to life. Impeccable attention to detail.",
      ko: "스리랑카 관광청 공인 가이드와 함께한 시기리야와 고대 유적 투어는 감동적이었습니다. 모든 일정과 케어가 완벽했습니다.",
    },
  },
];

function getQuoteString(quote: any, lang: "en" | "ko" = "en"): string {
  if (!quote) return "";
  if (typeof quote === "string") return lang === "en" ? quote : "";
  if (typeof quote === "object") {
    if (lang === "en") return quote.en || quote.ko || "";
    if (lang === "ko") return quote.ko || "";
  }
  return "";
}

export default function AdminGuestStoriesPage() {
  const {
    testimonials,
    saveTestimonial,
    addTestimonial,
    deleteTestimonial,
    refreshContent,
  } = useContentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [editingStory, setEditingStory] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmStory, setDeleteConfirmStory] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Filtered stories based on search term & rating with full defensive checks
  const filteredStories = useMemo(() => {
    if (!Array.isArray(testimonials)) return [];
    const term = searchTerm.toLowerCase().trim();

    return testimonials.filter((story) => {
      if (!story || typeof story !== "object") return false;

      const name = (story.name || "").toLowerCase();
      const country = (story.country || "").toLowerCase();
      const trip = (story.trip || "").toLowerCase();
      const quoteEn = getQuoteString(story.quote, "en").toLowerCase();
      const quoteKo = getQuoteString(story.quote, "ko").toLowerCase();

      const matchesSearch =
        !term ||
        name.includes(term) ||
        country.includes(term) ||
        trip.includes(term) ||
        quoteEn.includes(term) ||
        quoteKo.includes(term);

      const matchesRating =
        ratingFilter === "all" || (story.rating || 5) === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [testimonials, searchTerm, ratingFilter]);

  const totalPages = Math.ceil(filteredStories.length / pageSize);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStories.slice(start, start + pageSize);
  }, [filteredStories, currentPage, pageSize]);

  // Handle opening New Story modal
  const handleCreateNew = () => {
    const newStory: Testimonial = {
      id: `story_${Date.now()}`,
      name: "",
      country: "",
      trip: "Luxury Bespoke Journey",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      quote: {
        en: "",
        ko: "",
      },
    };
    setEditingStory(newStory);
    setIsModalOpen(true);
  };

  // Handle opening Edit Story modal
  const handleEdit = (story: Testimonial) => {
    setEditingStory({
      id: story.id || `story_${Date.now()}`,
      name: story.name || "",
      country: story.country || "",
      trip: story.trip || "Luxury Bespoke Journey",
      rating: typeof story.rating === "number" ? story.rating : 5,
      image: story.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      quote: {
        en: getQuoteString(story.quote, "en"),
        ko: getQuoteString(story.quote, "ko"),
      },
    });
    setIsModalOpen(true);
  };

  // Handle Saving in Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    if (!editingStory.name.trim()) {
      toast.error("Guest name is required.");
      return;
    }

    if (!editingStory.quote.en.trim()) {
      toast.error("English quote is required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveTestimonial(editingStory);
      if (res.success) {
        toast.success(`Guest story for "${editingStory.name}" saved successfully!`);
        setIsModalOpen(false);
        setEditingStory(null);
      } else {
        toast.error(res.error || "Failed to save story.");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Deletion
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmStory) return;
    setIsDeleting(true);
    try {
      const targetId = deleteConfirmStory.id;
      const index = testimonials.findIndex((t) => (targetId && t?.id === targetId) || (t?.name && t.name === deleteConfirmStory.name));
      const res = await deleteTestimonial(targetId || index);

      if (res.success) {
        toast.success(`Story from "${deleteConfirmStory.name || "Guest"}" removed.`);
        setDeleteConfirmStory(null);
      } else {
        toast.error(res.error || "Failed to delete story.");
      }
    } catch {
      toast.error("An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Load sample curated stories helper
  const handleLoadSamples = async () => {
    const toastId = toast.loading("Loading curated sample stories...");
    try {
      for (const sample of sampleCuratedStories) {
        await addTestimonial(sample);
      }
      toast.success("Sample guest stories loaded into database!", { id: toastId });
    } catch {
      toast.error("Failed to load sample stories.", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <MessageSquareQuote className="w-7 h-7 text-[#C8A45D]" />
            Guest Stories & Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Curate traveler reviews, verified golf & honeymoon testimonials, and bilingual quotes displayed on the live homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#testimonials"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-300 hover:text-white text-xs font-semibold border border-[#1B2D4A] transition-all"
          >
            <Eye className="w-4 h-4 text-[#C8A45D]" />
            <span>View on Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest Story</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#C8A45D]/10 border border-[#C8A45D]/30 flex items-center justify-center text-[#C8A45D]">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-white">
              {testimonials.length}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Total Published Stories
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FF9F1C]">
            <Star className="w-5 h-5 fill-[#FF9F1C]" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-white">
              {testimonials.length > 0
                ? (
                    testimonials.reduce((acc, t) => acc + (t && typeof t.rating === "number" ? t.rating : 5), 0) /
                    testimonials.length
                  ).toFixed(1)
                : "5.0"}
              <span className="text-xs text-slate-400 font-normal ml-1">/ 5.0</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Average Guest Rating
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-white">
              {new Set(testimonials.map((t) => t?.country).filter(Boolean)).size}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Countries Represented
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest name, country, trip itinerary, or quote content..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rating Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => {
              setRatingFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              ratingFilter === "all"
                ? "bg-[#C8A45D] text-[#081426] font-bold"
                : "bg-[#07111E] border border-[#1B2D4A] text-slate-300 hover:text-white"
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => {
                setRatingFilter(stars);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors ${
                ratingFilter === stars
                  ? "bg-[#C8A45D] text-[#081426] font-bold"
                  : "bg-[#07111E] border border-[#1B2D4A] text-slate-300 hover:text-white"
              }`}
            >
              <span>{stars}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0B1A30] rounded-3xl border border-[#1B2D4A] max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#C8A45D]/10 border border-[#C8A45D]/20 text-[#C8A45D] mx-auto flex items-center justify-center">
            <MessageSquareQuote className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              {searchTerm ? "No matching guest stories found" : "No Guest Stories Published Yet"}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              {searchTerm
                ? "Try adjusting your search criteria or resetting the rating filter."
                : "Guest stories showcase authentic reviews from your discerning clients on the homepage. Create your first story or populate with curated samples."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Guest Story</span>
            </button>
            {testimonials.length === 0 && (
              <button
                onClick={handleLoadSamples}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 hover:text-white text-xs font-semibold border border-[#1B2D4A] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                <span>Load Sample Stories</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedStories.map((story, idx) => {
            const rating = story?.rating || 5;
            const quoteEn = getQuoteString(story?.quote, "en");
            const quoteKo = getQuoteString(story?.quote, "ko");
            const name = story?.name || "Anonymous Guest";
            const country = story?.country || "International";
            const trip = story?.trip || "Bespoke Journey";
            const image = story?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

            return (
              <div
                key={story?.id || idx}
                className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-sm group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Stars and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#FF9F1C]">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FF9F1C]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(story)}
                        title="Edit Story"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#C8A45D] hover:bg-[#12233D] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmStory(story)}
                        title="Delete Story"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* English Quote */}
                  <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed line-clamp-4 relative pl-3 border-l-2 border-[#C8A45D]/60">
                    "{quoteEn || "No quote text available."}"
                  </blockquote>

                  {/* Korean Quote Preview (if present) */}
                  {quoteKo && (
                    <div className="text-[11px] text-slate-400 line-clamp-2 pl-3 border-l-2 border-slate-700">
                      🇰🇷 "{quoteKo}"
                    </div>
                  )}
                </div>

                {/* Author Details Footer */}
                <div className="pt-4 mt-4 border-t border-[#1B2D4A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1B2D4A] shrink-0 bg-[#07111E]">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">
                      {name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                      <span className="text-slate-300">{country}</span>
                      <span>•</span>
                      <span className="text-[#C8A45D] font-medium truncate">
                        {trip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStories.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="stories"
        />
      )}

      {/* ADD / EDIT STORY MODAL */}
      {isModalOpen && editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {editingStory.id && testimonials.some((t) => t.id === editingStory.id)
                      ? "Edit Guest Story"
                      : "Add New Guest Story"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bilingual testimonial published directly onto the live website
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Guest Name(s) <span className="text-[#C8A45D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James & Eleanor Vance"
                    value={editingStory.name}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                {/* Country / Nationality */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Country / Origin <span className="text-[#C8A45D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom / South Korea"
                    value={editingStory.country}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, country: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trip Itinerary Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Trip Package / Journey Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12-Day Tea Country & Golf Odyssey"
                    value={editingStory.trip}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, trip: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Review Rating
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((stars) => {
                      const isSelected = (editingStory.rating || 5) >= stars;
                      return (
                        <button
                          key={stars}
                          type="button"
                          onClick={() =>
                            setEditingStory({ ...editingStory, rating: stars })
                          }
                          className="p-1.5 rounded-lg hover:bg-[#12233D] transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              isSelected
                                ? "text-[#FF9F1C] fill-[#FF9F1C]"
                                : "text-slate-600"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs text-slate-400 font-semibold ml-2">
                      {editingStory.rating || 5} Stars
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Photo / Avatar */}
              <div className="space-y-1.5">
                <ImageUpload
                  label="Guest Portrait / Avatar Photo"
                  value={editingStory.image}
                  onChange={(url) =>
                    setEditingStory({ ...editingStory, image: url })
                  }
                  aspectRatio="square"
                  helpText="Upload a photo of the client (square format recommended, or enter direct image URL)"
                />
              </div>

              {/* English Quote */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Guest Quote (English) <span className="text-[#C8A45D]">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {editingStory.quote.en.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Share the guest's detailed feedback, impressions, or memorable highlights..."
                  value={editingStory.quote.en}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      quote: {
                        ...editingStory.quote,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none leading-relaxed"
                />
              </div>

              {/* Korean Quote */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Guest Quote (Korean Translation)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {editingStory.quote.ko?.length || 0} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="한국어 고객 후기 번역 (한국어 사용자를 위해 표시됩니다)..."
                  value={editingStory.quote.ko || ""}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      quote: {
                        ...editingStory.quote,
                        ko: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1B2D4A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Story...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Guest Story</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B1A30] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-white">
                Delete Guest Story?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete the review from{" "}
                <span className="text-white font-semibold">
                  "{deleteConfirmStory.name}"
                </span>
                ? This will immediately remove it from the live homepage.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmStory(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
