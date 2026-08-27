"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import type { Destination } from "@/data/site";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminDestinationsPage() {
  const { destinations, saveDestination, deleteDestination } =
    useContentStore();
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  const regions = [
    "Cultural Triangle",
    "Hill Country",
    "South Coast",
    "West Coast",
    "Southern Wilderness",
    "East Coast",
    "Northern Heritage",
  ];

  const handleCreateNew = () => {
    const newDest: Destination = {
      slug: `destination-${Date.now().toString().slice(-4)}`,
      name: {
        en: "New Sanctuary",
        ko: "새로운 여행지",
      },
      region: "Cultural Triangle",
      image:
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
      short: {
        en: "A mesmerizing destination known for its cultural heritage and natural beauty.",
        ko: "문화유산과 자연의 아름다움으로 유명한 매혹적인 여행지.",
      },
      long: {
        en: "Explore the extraordinary history, scenic landscapes, and private boutique resorts in this legendary corner of Sri Lanka.",
        ko: "스리랑카의 유서 깊은 역사와 아름다운 자연, 최고급 프라이빗 부티크 리조트를 경험해보세요.",
      },
      best: ["Private guided walking tour", "Sunset tea tasting", "Scenic viewpoint trek"],
      stay: "2–3 nights",
      x: 50,
      y: 50,
    };

    setEditingDest(newDest);
    setIsModalOpen(true);
  };

  const handleEdit = (dest: Destination) => {
    setEditingDest(JSON.parse(JSON.stringify(dest)));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;

    if (!editingDest.slug.trim()) {
      toast.error("Destination slug is required");
      return;
    }

    saveDestination(editingDest);
    setIsModalOpen(false);
    toast.success(`Destination "${editingDest.name.en}" saved successfully!`);
  };

  const handleDelete = (slug: string) => {
    deleteDestination(slug);
    setDeleteConfirmSlug(null);
    toast.success("Destination removed from catalog.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <MapPin className="w-7 h-7 text-[#C8A45D]" />
            Destinations & Island Map Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Manage Sri Lanka regions, curated destination guides, map pin coordinates, and recommended stays.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.slug}
            className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#081426]/90 backdrop-blur-md text-[10px] font-bold text-[#C8A45D] border border-[#C8A45D]/30">
                  {dest.region}
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#12233D] border border-[#1B2D4A] text-slate-200 font-medium text-[11px] flex items-center gap-1 shadow-md">
                  <Clock className="w-3 h-3 text-[#C8A45D]" />
                  <span>{dest.stay}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C8A45D] transition-colors leading-snug">
                    {dest.name.en}
                  </h3>
                  <div className="text-xs text-[#C8A45D] font-medium mt-0.5">
                    {dest.name.ko}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {dest.short.en}
                </p>

                {dest.best && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Key Highlights:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dest.best.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#07111E] text-slate-300 border border-[#1B2D4A]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-[#1B2D4A] bg-[#081426]/50 flex items-center justify-between">
              <Link
                href={`/destinations/${dest.slug}`}
                target="_blank"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Preview</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(dest)}
                  className="px-3 py-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 hover:text-[#C8A45D] text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmSlug(dest.slug)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Destination"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE DESTINATION MODAL */}
      {isModalOpen && editingDest && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between bg-[#081426] rounded-t-3xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C8A45D]" />
                  {editingDest.slug ? `Edit: ${editingDest.name.en}` : "Add New Destination"}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure destination guide, map positioning, and recommended stays.
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
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Destination Name (English)
                  </label>
                  <input
                    type="text"
                    value={editingDest.name.en}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        name: { ...editingDest.name, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Destination Name (Korean)
                  </label>
                  <input
                    type="text"
                    value={editingDest.name.ko}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        name: { ...editingDest.name, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingDest.slug}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, slug: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Region
                  </label>
                  <select
                    value={editingDest.region}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, region: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Recommended Stay
                  </label>
                  <input
                    type="text"
                    value={editingDest.stay}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, stay: e.target.value })
                    }
                    placeholder="e.g. 2–3 nights"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingDest.image}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  required
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Key Highlights / Best Activities (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingDest.best?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingDest({
                      ...editingDest,
                      best: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Galle Fort walking tour, Sunset cocktail, Whale watching"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Short Overview (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingDest.short.en}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        short: { ...editingDest.short, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Short Overview (Korean)
                  </label>
                  <textarea
                    rows={2}
                    value={editingDest.short.ko}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        short: { ...editingDest.short, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Narrative (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingDest.long.en}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        long: { ...editingDest.long, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Narrative (Korean)
                  </label>
                  <textarea
                    rows={3}
                    value={editingDest.long.ko}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        long: { ...editingDest.long, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Map Coordinates */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Map Coordinate X (% from left)
                  </label>
                  <input
                    type="number"
                    value={editingDest.x}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        x: parseFloat(e.target.value) || 0,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Map Coordinate Y (% from top)
                  </label>
                  <input
                    type="number"
                    value={editingDest.y}
                    onChange={(e) =>
                      setEditingDest({
                        ...editingDest,
                        y: parseFloat(e.target.value) || 0,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
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
                  <span>Save Destination</span>
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
              Delete Destination?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this destination? It will be removed from the guide and map.
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
