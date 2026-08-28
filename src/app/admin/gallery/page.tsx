"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import { galleryCategories, type GalleryItem } from "@/data/site";
import {
  Images,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Sparkles,
  MapPin,
  Tag,
  Star,
  ExternalLink,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminGalleryPage() {
  const { gallery, saveGalleryItem, addGalleryItem, deleteGalleryItem } =
    useContentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredItems = gallery.filter((item) => {
    const titleEn = item.title.en.toLowerCase();
    const titleKo = (item.title.ko || "").toLowerCase();
    const location = (item.location || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      titleEn.includes(term) || titleKo.includes(term) || location.includes(term);

    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const featuredCount = gallery.filter((item) => item.featured).length;

  const handleCreateNew = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: {
        en: "Bespoke Private Ceylon Escape",
        ko: "프라이빗 럭셔리 실론 오디세이",
      },
      category: "Luxury Resorts",
      image:
        "https://images.unsplash.com/photo-1546708973-c6b75c55c707?auto=format&fit=crop&w=1200&q=80",
      location: "Southern Coast, Sri Lanka",
      featured: true,
      order: Date.now(),
    };

    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.image || !editingItem.title.en) {
      toast.error("Please fill in the required fields.");
      return;
    }

    saveGalleryItem(editingItem);
    toast.success(`Gallery photo "${editingItem.title.en}" saved successfully!`);
    setIsModalOpen(false);
  };

  const handleToggleFeatured = (item: GalleryItem) => {
    const updated = { ...item, featured: !item.featured };
    saveGalleryItem(updated);
    toast.success(
      updated.featured
        ? `Added "${item.title.en}" to Footer Gallery!`
        : `Removed "${item.title.en}" from Footer Gallery.`,
    );
  };

  const handleDelete = (id: string) => {
    deleteGalleryItem(id);
    setDeleteConfirmId(null);
    toast.success("Gallery photo removed.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Images className="w-7 h-7 text-[#C8A45D]" />
            Gallery & Visuals Atelier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Curate luxury Sri Lanka photography for the public Gallery page and dynamic Footer showcase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1A30] hover:bg-[#132542] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-colors"
          >
            <Eye className="w-4 h-4 text-[#C8A45D]" />
            <span>View Public Gallery</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </Link>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#B59148] text-[#081A33] text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photo</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Total Photos</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {gallery.length} Images
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">
              Footer Highlights
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              {featuredCount} Displayed
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1A30] border border-[#1B2D4A] flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Categories</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {galleryCategories.length - 1} Curations
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by photo title (EN/KO) or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0B1A30] border border-[#1B2D4A] rounded-xl text-xs text-white placeholder:text-slate-400 focus:border-[#C8A45D] outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#C8A45D] text-[#081A33] font-bold shadow-sm"
                  : "bg-[#0B1A30] text-slate-300 hover:bg-[#132542] border border-[#1B2D4A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl">
          <Images className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
          <p className="text-slate-300 font-medium text-sm">No gallery photos found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or add a new photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl overflow-hidden group hover:border-[#C8A45D]/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {item.category}
                    </span>

                    <button
                      onClick={() => handleToggleFeatured(item)}
                      title={item.featured ? "Featured in Footer" : "Not in Footer"}
                      className={`p-1.5 rounded-md backdrop-blur-md transition-all ${
                        item.featured
                          ? "bg-amber-400 text-navy font-bold shadow-md"
                          : "bg-black/60 text-slate-400 hover:text-white border border-white/10"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.featured ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Quick Preview Button */}
                  <button
                    onClick={() => setPreviewImage(item.image)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white"
                  >
                    <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5 text-[#C8A45D]" /> Preview
                    </span>
                  </button>

                  {/* Location Tag */}
                  {item.location && (
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] text-slate-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <MapPin className="w-3 h-3 text-[#C8A45D]" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif text-sm font-semibold text-white line-clamp-1">
                    {item.title.en}
                  </h3>
                  {item.title.ko && (
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.title.ko}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 pt-0 flex items-center justify-between border-t border-[#1B2D4A]/60 mt-2">
                <div className="text-[11px] text-slate-400">
                  {item.featured ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Footer Active
                    </span>
                  ) : (
                    <span className="text-slate-500">Gallery Only</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg bg-[#07111E] hover:bg-[#1B2D4A] text-slate-300 hover:text-white transition-colors"
                    title="Edit Photo Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C8A45D]" />
                {editingItem.id.startsWith("gal-") && !gallery.some((g) => g.id === editingItem.id)
                  ? "Add New Gallery Image"
                  : "Edit Gallery Image"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Image URL & Live Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Image URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or asset path"
                  value={editingItem.image}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                />

                {/* Preview Frame */}
                {editingItem.image && (
                  <div className="mt-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-black/40 border border-[#1B2D4A]">
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Titles EN / KO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signature Beach Sunset"
                    value={editingItem.title.en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: { ...editingItem.title, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Title (Korean)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 시그니처 해변 일몰"
                    value={editingItem.title.ko || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: { ...editingItem.title, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Category *
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  >
                    {galleryCategories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Location Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yala National Park, Galle"
                    value={editingItem.location || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              {/* Display in Footer Toggle */}
              <div className="p-4 rounded-xl bg-[#07111E] border border-[#1B2D4A] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Show in Footer Gallery
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Feature this photo in the 6-image footer carousel across the website.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editingItem.featured || false}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      featured: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#C8A45D] rounded cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1B2D4A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#1B2D4A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#B59148] text-[#081A33] text-xs font-bold transition-all shadow-md"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-red-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Delete Photo?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently remove this photo from the gallery and footer?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#1B2D4A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Single Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Enlarged Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
