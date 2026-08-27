"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import type { Experience } from "@/data/site";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminExperiencesPage() {
  const {
    experiences,
    saveExperience,
    addExperience,
    deleteExperience,
  } = useContentStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const handleCreateNew = () => {
    const newExp: Experience = {
      title: {
        en: "Bespoke Ocean & Island Safari",
        ko: "프라이빗 해양 & 섬 탐험",
      },
      text: {
        en: "Private catamaran charter, dolphin naturalists, and secluded sunset anchorages.",
        ko: "전용 카타마란 요트 차터와 돌고래 관찰, 한적한 일몰 감상.",
      },
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    };

    setEditingIndex(-1);
    setEditingExp(newExp);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingExp(JSON.parse(JSON.stringify(experiences[index])));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    if (editingIndex === -1) {
      addExperience(editingExp);
      toast.success(`Experience "${editingExp.title.en}" added successfully!`);
    } else if (editingIndex !== null) {
      saveExperience(editingIndex, editingExp);
      toast.success(`Experience "${editingExp.title.en}" updated successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    deleteExperience(index);
    setDeleteConfirmIndex(null);
    toast.success("Experience removed.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#C8A45D]" />
            Signature Experiences Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Manage bespoke curated experiences (wildlife naturalists, tea bungalows, private trains, wellness).
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-transparent to-transparent opacity-80" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C8A45D] transition-colors leading-snug">
                  {exp.title.en}
                </h3>
                <div className="text-xs text-[#C8A45D] font-medium">
                  {exp.title.ko}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {exp.text.en}
                </p>
                <p className="text-xs text-slate-500 italic">
                  {exp.text.ko}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-[#1B2D4A] bg-[#081426]/50 flex items-center justify-between">
              <Link
                href="/experiences"
                target="_blank"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>View on Site</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-3 py-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 hover:text-[#C8A45D] text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmIndex(index)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Experience"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE EXPERIENCE MODAL */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between bg-[#081426] rounded-t-3xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C8A45D]" />
                  {editingIndex !== -1 ? `Edit: ${editingExp.title.en}` : "Add New Experience"}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure experience headline, narrative, and photography.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={editingExp.title.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        title: { ...editingExp.title, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Title (Korean)
                  </label>
                  <input
                    type="text"
                    value={editingExp.title.ko}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        title: { ...editingExp.title, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingExp.image}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Narrative (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingExp.text.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        text: { ...editingExp.text, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Narrative (Korean)
                  </label>
                  <textarea
                    rows={3}
                    value={editingExp.text.ko}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        text: { ...editingExp.text, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

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
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIndex !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-red-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-serif text-lg font-bold text-white">
              Delete Experience?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this signature experience from the catalog?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmIndex(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12233D] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmIndex)}
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
