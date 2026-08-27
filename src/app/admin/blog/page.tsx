"use client";

import React, { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import type { Post } from "@/data/site";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Check,
  X,
  Eye,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminBlogPage() {
  const { posts, savePost, deletePost } = useContentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  const blogCategories = [
    "All",
    "Golf in Sri Lanka",
    "Luxury Travel",
    "Sri Lankan Culture",
    "Wildlife",
    "Travel Tips",
    "Korean Travel Guides",
    "Culinary & Tea",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.title.ko || "").includes(searchTerm) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const newPost: Post = {
      slug: `journal-post-${Date.now().toString().slice(-4)}`,
      title: {
        en: "New Ceylon Luxury Expedition Insights",
        ko: "새로운 실론 럭셔리 여행 칼럼",
      },
      category: "Luxury Travel",
      date: today,
      image:
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
      excerpt: {
        en: "An exclusive look into private estates, curated routes and timeless luxury across Sri Lanka.",
        ko: "스리랑카 전역의 프라이빗 빌라와 특별한 여정을 담은 칼럼.",
      },
    };

    setEditingPost(newPost);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(JSON.parse(JSON.stringify(post)));
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.slug.trim()) {
      toast.error("Article slug is required");
      return;
    }

    savePost(editingPost);
    setIsModalOpen(false);
    toast.success(`Article "${editingPost.title.en}" published successfully!`);
  };

  const handleDelete = (slug: string) => {
    deletePost(slug);
    setDeleteConfirmSlug(null);
    toast.success("Article removed from journal.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-[#C8A45D]" />
            Travel Journal & Blog Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Publish and manage editorial columns, Korean market travel tips, golf guides, and wildlife articles.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title, category..."
            className="w-full px-4 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#C8A45D] text-[#081426]"
                  : "bg-[#07111E] text-slate-400 hover:text-white border border-[#1B2D4A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.slug}
            className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#081426]/90 backdrop-blur-md text-[10px] font-bold text-[#C8A45D] border border-[#C8A45D]/30 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{post.category}</span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#081426]/90 text-slate-300 text-[11px] font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C8A45D]" />
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C8A45D] transition-colors leading-snug">
                  {post.title.en}
                </h3>
                <div className="text-xs text-[#C8A45D] font-medium">
                  {post.title.ko}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {post.excerpt.en}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-t border-[#1B2D4A] bg-[#081426]/50 flex items-center justify-between">
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Read Live</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-3 py-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 hover:text-[#C8A45D] text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmSlug(post.slug)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE ARTICLE MODAL */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
            <div className="p-6 border-b border-[#1B2D4A] flex items-center justify-between bg-[#081426] rounded-t-3xl">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C8A45D]" />
                  {editingPost.slug ? `Edit Article: ${editingPost.title.en}` : "Write New Article"}
                </h2>
                <p className="text-xs text-slate-400">
                  Compose editorial stories for international and Korean travelers.
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
                    Article Title (English)
                  </label>
                  <input
                    type="text"
                    value={editingPost.title.en}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        title: { ...editingPost.title, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Article Title (Korean)
                  </label>
                  <input
                    type="text"
                    value={editingPost.title.ko}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        title: { ...editingPost.title, ko: e.target.value },
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
                    value={editingPost.slug}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, slug: e.target.value })
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
                    value={editingPost.category}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={editingPost.date}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, date: e.target.value })
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
                  value={editingPost.image}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Excerpt / Intro (English)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPost.excerpt.en}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        excerpt: { ...editingPost.excerpt, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Excerpt / Intro (Korean)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPost.excerpt.ko}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        excerpt: { ...editingPost.excerpt, ko: e.target.value },
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
                  <span>Publish Article</span>
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
              Delete Article?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this article from the Journal?
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
