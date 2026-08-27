"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import type { GolfCourse } from "@/data/site";
import {
  Flag,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Check,
  X,
  Hotel,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminGolfPage() {
  const { golfCourses, saveGolfCourse, addGolfCourse, deleteGolfCourse } =
    useContentStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCourse, setEditingCourse] = useState<GolfCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const handleCreateNew = () => {
    const newCourse: GolfCourse = {
      name: "New Championship Golf Course",
      location: "Colombo / Central Province",
      image:
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80",
      holes: "18 holes · Par 72",
      nights: 2,
      rounds: 1,
      hotel: "Luxury Golf Resort & Spa",
      text: {
        en: "An exquisite championship layout designed for discerning international golf enthusiasts.",
        ko: "글로벌 골프 애호가를 위해 섬세하게 설계된 챔피언십 골프 코스.",
      },
    };

    setEditingIndex(-1); // -1 signifies new
    setEditingCourse(newCourse);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingCourse(JSON.parse(JSON.stringify(golfCourses[index])));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    if (editingIndex === -1) {
      addGolfCourse(editingCourse);
      toast.success(`Golf course "${editingCourse.name}" added successfully!`);
    } else if (editingIndex !== null) {
      saveGolfCourse(editingIndex, editingCourse);
      toast.success(`Golf course "${editingCourse.name}" updated successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    deleteGolfCourse(index);
    setDeleteConfirmIndex(null);
    toast.success("Golf course package removed.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Flag className="w-7 h-7 text-[#C8A45D]" />
            Golf Holidays & Courses Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Manage championship layouts, hole specifications, tee time arrangements, and luxury hotel pairings.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Golf Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {golfCourses.map((course, index) => (
          <div
            key={index}
            className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#081426]/90 backdrop-blur-md text-[10px] font-bold text-[#C8A45D] border border-[#C8A45D]/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{course.location}</span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#C8A45D] text-[#081426] font-bold text-xs shadow-md">
                  {course.holes}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C8A45D] transition-colors leading-snug">
                  {course.name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>
                    <strong className="text-white">{course.rounds}</strong>{" "}
                    Rounds Included
                  </span>
                  <span>
                    <strong className="text-white">{course.nights}</strong>{" "}
                    Nights Recommended
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Hotel className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>{course.hotel}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {course.text.en}
                </p>
                <p className="text-xs text-[#C8A45D]/90 line-clamp-1 italic">
                  {course.text.ko}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-[#1B2D4A] bg-[#081426]/50 flex items-center justify-between">
              <Link
                href="/golf"
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
                  title="Delete Golf Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE GOLF COURSE MODAL */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between bg-[#081426] rounded-t-3xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Flag className="w-5 h-5 text-[#C8A45D]" />
                  {editingIndex !== -1 ? `Edit Course: ${editingCourse.name}` : "Add New Golf Course"}
                </h2>
                <p className="text-xs text-slate-400">
                  Update golf course details, hole count, hotel pairings, and imagery.
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
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Course Name
                </label>
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingCourse.location}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, location: e.target.value })
                    }
                    placeholder="e.g. Nuwara Eliya / Kandy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Holes & Par Info
                  </label>
                  <input
                    type="text"
                    value={editingCourse.holes}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, holes: e.target.value })
                    }
                    placeholder="e.g. 18 holes · Par 70"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Rounds
                  </label>
                  <input
                    type="number"
                    value={editingCourse.rounds}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        rounds: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Nights
                  </label>
                  <input
                    type="number"
                    value={editingCourse.nights}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        nights: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Partner Luxury Hotel
                  </label>
                  <input
                    type="text"
                    value={editingCourse.hotel}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, hotel: e.target.value })
                    }
                    placeholder="e.g. Grand Hotel Nuwara Eliya"
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
                  value={editingCourse.image}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingCourse.text.en}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        text: { ...editingCourse.text, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Description (Korean)
                  </label>
                  <textarea
                    rows={3}
                    value={editingCourse.text.ko}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        text: { ...editingCourse.text, ko: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
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
                  <span>Save Course</span>
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
              Delete Golf Course?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this golf package? This will update the public golf page immediately.
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
