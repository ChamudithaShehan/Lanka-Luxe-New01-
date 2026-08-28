"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import { type Tour, isCategoryMatch } from "@/data/site";
import {
  Compass,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  Check,
  X,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPagination } from "@/components/admin/AdminPagination";

export default function AdminToursPage() {
  const { tours, saveTour, deleteTour } = useContentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Reset to page 1 on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = [
    "All",
    "Luxury",
    "Golf",
    "Wildlife",
    "Culture",
    "Wellness",
    "Honeymoon",
    "Family",
    "Custom",
  ];

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.name.ko || "").includes(searchTerm) ||
      tour.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = isCategoryMatch(tour, selectedCategory);
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredTours.length / pageSize);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleCreateNew = () => {
    const newTour: Tour = {
      slug: `custom-journey-${Date.now().toString().slice(-4)}`,
      name: {
        en: "New Signature Expedition",
        ko: "새로운 시그니처 여정",
      },
      category: "Signature Journeys",
      categories: ["Signature Journeys"],
      days: 8,
      price: "USD 3,500",
      image:
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588258524675-c61922c2a075?auto=format&fit=crop&w=1200&q=80",
      ],
      locations: ["Colombo", "Kandy", "Nuwara Eliya", "Galle"],
      short: {
        en: "An extraordinary private itinerary across Sri Lanka's finest landscapes.",
        ko: "스리랑카의 가장 아름다운 풍경을 가로지르는 특별한 프라이빗 여정.",
      },
      overview: {
        en: "Experience the ultimate luxury journey curated personally by Iroshan Jayawickrame.",
        ko: "이로샨 자야위크라메가 직접 큐레이션한 궁극의 럭셔리 여정을 경험해보세요.",
      },
      itinerary: [
        {
          day: "Day 1",
          title: "Arrival in Colombo & Galle Face",
          text: "VIP airport meet & greet, transfer to your colonial oceanfront suite.",
        },
        {
          day: "Day 2",
          title: "Scenic Highlands & Tea Country",
          text: "Chauffeured scenic drive into the emerald tea hills.",
        },
      ],
      included: [
        "Private chauffeur-guide and luxury vehicle throughout",
        "5-Star luxury accommodation with daily breakfast",
        "All entrance fees and private permits",
        "24/7 bilingual concierge in English and Korean",
      ],
      excluded: [
        "International flights",
        "Personal discretionary expenses",
        "Alcoholic beverages during meals",
      ],
      hotels: ["Galle Face Hotel", "Ceylon Tea Trails", "Amangalla"],
      transport: "Mercedes-Benz / Toyota Alphard Luxury Chauffeur Fleet",
      optional: ["Helicopter transfers", "Hot air balloon flight"],
    };

    setEditingTour(newTour);
    setIsModalOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(JSON.parse(JSON.stringify(tour)));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    if (!editingTour.slug.trim()) {
      toast.error("Tour slug is required");
      return;
    }

    saveTour(editingTour);
    setIsModalOpen(false);
    toast.success(`Tour "${editingTour.name.en}" saved successfully!`);
  };

  const handleDelete = (slug: string) => {
    deleteTour(slug);
    setDeleteConfirmSlug(null);
    toast.success("Tour removed from catalog.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Compass className="w-7 h-7 text-[#C8A45D]" />
            Tours & Itineraries Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Create, edit prices, update day-by-day itineraries, hotels, and images for all packages.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tour</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tours by name, slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                  ? "bg-[#C8A45D] text-[#081426]"
                  : "bg-[#07111E] text-slate-400 hover:text-white border border-[#1B2D4A]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid / Table */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTours.map((tour) => (
          <div
            key={tour.slug}
            className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Tour Cover Image */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.name.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#081426]/90 backdrop-blur-md text-[10px] font-bold text-[#C8A45D] border border-[#C8A45D]/30 uppercase tracking-wider">
                    {tour.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#C8A45D] text-[#081426] font-bold text-xs shadow-md">
                  {tour.price}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C8A45D] transition-colors leading-snug">
                    {tour.name.en}
                  </h3>
                  <div className="text-xs text-[#C8A45D] font-medium mt-0.5">
                    {tour.name.ko}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                    {tour.days} Days / {tour.days - 1} Nights
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C8A45D]" />
                    {tour.itinerary?.length || 0} Itinerary Days
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tour.short.en}
                </p>

                {tour.locations && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tour.locations.map((loc) => (
                      <span
                        key={loc}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#07111E] text-slate-300 border border-[#1B2D4A]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-[#1B2D4A] bg-[#081426]/50 flex items-center justify-between">
              <Link
                href={`/tours/${tour.slug}`}
                target="_blank"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Preview</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(tour)}
                  className="px-3 py-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 hover:text-[#C8A45D] text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmSlug(tour.slug)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Tour"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTours.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[6, 12, 24]}
        itemLabel="tours"
      />
    </div>

      {/* EDIT / CREATE TOUR MODAL */}
      {isModalOpen && editingTour && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between bg-[#081426] rounded-t-3xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#C8A45D]" />
                  {editingTour.slug ? `Edit Tour: ${editingTour.name.en}` : "Create New Tour"}
                </h2>
                <p className="text-xs text-slate-400">
                  Update itinerary details, prices, and multimedia assets.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Tour Name (English)
                  </label>
                  <input
                    type="text"
                    value={editingTour.name.en}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        name: { ...editingTour.name, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Tour Name (Korean)
                  </label>
                  <input
                    type="text"
                    value={editingTour.name.ko}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        name: { ...editingTour.name, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Slug, Category, Duration, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingTour.slug}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, slug: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Category
                  </label>
                  <select
                    value={editingTour.category}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        category: e.target.value,
                        categories: [e.target.value],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={editingTour.days}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        days: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Indicative Price
                  </label>
                  <input
                    type="text"
                    value={editingTour.price}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, price: e.target.value })
                    }
                    placeholder="e.g. USD 4,500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Cover Image Upload & Locations */}
              <div className="space-y-4">
                <ImageUpload
                  value={editingTour.image}
                  onChange={(url) =>
                    setEditingTour({ ...editingTour, image: url })
                  }
                  label="Tour Cover Image"
                  required
                  aspectRatio="video"
                  helpText="Upload a high-quality tour cover image directly to ImageBB or provide an image URL."
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Locations (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingTour.locations.join(", ")}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        locations: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Colombo, Sigiriya, Kandy, Galle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Short Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingTour.short.en}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        short: { ...editingTour.short, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Short Description (Korean)
                  </label>
                  <textarea
                    rows={2}
                    value={editingTour.short.ko}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        short: { ...editingTour.short, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Day-by-Day Itinerary Editor */}
              <div className="space-y-3 pt-4 border-t border-[#1B2D4A]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C8A45D]" />
                      Day-by-Day Itinerary ({editingTour.itinerary?.length || 0} Days)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Configure the schedule and daily highlights
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextDayNum = (editingTour.itinerary?.length || 0) + 1;
                      setEditingTour({
                        ...editingTour,
                        itinerary: [
                          ...(editingTour.itinerary || []),
                          {
                            day: `Day ${nextDayNum}`,
                            title: `Day ${nextDayNum} Exploration`,
                            text: `Full day exploration and luxury stay.`,
                          },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-[#C8A45D] text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editingTour.itinerary?.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-[#07111E] border border-[#1B2D4A] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={item.day}
                            onChange={(e) => {
                              const updated = [...editingTour.itinerary];
                              updated[index].day = e.target.value;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-xs text-[#C8A45D] font-bold outline-none"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...editingTour.itinerary];
                              updated[index].title = e.target.value;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            placeholder="Day Title"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-xs text-white font-semibold outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingTour.itinerary.filter(
                              (_, i) => i !== index,
                            );
                            setEditingTour({ ...editingTour, itinerary: updated });
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove day"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={item.text}
                        onChange={(e) => {
                          const updated = [...editingTour.itinerary];
                          updated[index].text = e.target.value;
                          setEditingTour({ ...editingTour, itinerary: updated });
                        }}
                        placeholder="Day itinerary details and activities..."
                        className="w-full px-3 py-2 rounded-lg bg-[#0B1A30] border border-[#1B2D4A] text-xs text-slate-300 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Hotels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1B2D4A]">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Included Services (Line by line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingTour.included?.join("\n") || ""}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        included: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Luxury Hotels Included (Comma separated)
                  </label>
                  <textarea
                    rows={4}
                    value={editingTour.hotels?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        hotels: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#1B2D4A] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] text-xs font-bold shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Tour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-red-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-serif text-lg font-bold text-white">
              Delete This Tour?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this tour from the live catalog? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12233D] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmSlug)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
