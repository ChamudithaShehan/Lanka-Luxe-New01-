"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  helpText?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "https://... or upload a photo",
  required = false,
  aspectRatio = "video",
  helpText,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-[16/9]"
        : aspectRatio === "wide"
          ? "aspect-[21/9]"
          : "aspect-auto max-h-60";

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (.jpg, .png, .webp, etc.)");
      return;
    }

    // Validate file size (max 32MB for ImageBB)
    if (file.size > 32 * 1024 * 1024) {
      toast.error("File size exceeds the 32MB limit for ImageBB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${file.name}" to ImageBB...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.needsKey) {
          toast.error(
            "ImageBB API Key is missing. Please set IMGBB_API_KEY in your .env file.",
            { id: toastId, duration: 6000 },
          );
        } else {
          toast.error(data.error || "Failed to upload image to ImageBB.", {
            id: toastId,
          });
        }
        return;
      }

      onChange(data.url);
      toast.success("Image uploaded to ImageBB successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("An error occurred during image upload.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Image URL copied to clipboard!");
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        <div className="flex items-center bg-[#07111E] rounded-lg p-0.5 border border-[#1B2D4A] text-[10px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${mode === "upload"
                ? "bg-[#C8A45D] text-[#081A33] font-bold shadow-xs"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>ImageBB Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${mode === "url"
                ? "bg-[#C8A45D] text-[#081A33] font-bold shadow-xs"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Direct URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Main Upload / Input Area */}
      {mode === "upload" ? (
        <div className="space-y-3">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed p-4 sm:p-6 text-center transition-all cursor-pointer ${isDragging
                ? "border-[#C8A45D] bg-[#C8A45D]/10"
                : "border-[#1B2D4A] bg-[#07111E]/80 hover:border-[#C8A45D]/50 hover:bg-[#07111E]"
              }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <Loader2 className="w-8 h-8 text-[#C8A45D] animate-spin" />
                <span className="text-xs text-slate-300 font-medium">
                  Uploading to ImageBB...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="p-3 rounded-full bg-[#C8A45D]/10 text-[#C8A45D]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-200">
                  <span className="font-semibold text-[#C8A45D]">
                    Click to browse
                  </span>{" "}
                  or drag and drop your photo here
                </div>
                <div className="text-[10px] text-slate-400">
                  PNG, JPG, WEBP, GIF up to 32MB (hosted on ImageBB CDN)
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Direct URL Input Mode */
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
          />
        </div>
      )}

      {/* Preview Card */}
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-[#07111E] border border-[#1B2D4A] p-2 space-y-2">
          <div className={`relative ${aspectClass} rounded-lg overflow-hidden bg-black/40`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = "0.3";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

            {/* Badges on preview */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-slate-200 border border-white/10">
              <Sparkles className="w-3 h-3 text-[#C8A45D]" />
              <span>{value.includes("ibb.co") ? "ImageBB CDN" : "Current Image"}</span>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyUrl}
                title="Copy Image URL"
                className="p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                title="Open in new tab"
                className="p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                title="Remove image"
                className="p-1.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Bottom URL preview */}
            <div className="absolute bottom-2 left-2 right-2 text-[10px] text-slate-300 truncate font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              {value}
            </div>
          </div>
        </div>
      )}

      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}
    </div>
  );
}
