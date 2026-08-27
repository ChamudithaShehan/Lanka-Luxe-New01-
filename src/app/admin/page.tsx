"use client";

import React from "react";
import Link from "next/link";
import { useContentStore, type Inquiry } from "@/lib/content-store";
import {
  Inbox,
  Compass,
  Flag,
  MapPin,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Plus,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  TrendingUp,
  User,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminOverviewPage() {
  const {
    tours,
    golfCourses,
    destinations,
    experiences,
    posts,
    inquiries,
    siteSettings,
    contact,
    updateInquiryStatus,
  } = useContentStore();

  const newInquiries = inquiries.filter((i) => i.status === "new");
  const inProgressInquiries = inquiries.filter((i) => i.status === "in_progress");
  const bookedInquiries = inquiries.filter((i) => i.status === "booked");

  const statCards = [
    {
      title: "Total Inquiries",
      value: inquiries.length,
      subtitle: `${newInquiries.length} pending new leads`,
      icon: Inbox,
      href: "/admin/inquiries",
      highlight: newInquiries.length > 0,
    },
    {
      title: "Tour Itineraries",
      value: tours.length,
      subtitle: "Bespoke packages active",
      icon: Compass,
      href: "/admin/tours",
    },
    {
      title: "Golf Escapes",
      value: golfCourses.length,
      subtitle: "Championship courses",
      icon: Flag,
      href: "/admin/golf",
    },
    {
      title: "Destinations & Map",
      value: destinations.length,
      subtitle: "Island regions curated",
      icon: MapPin,
      href: "/admin/destinations",
    },
    {
      title: "Experiences",
      value: experiences.length,
      subtitle: "Signature activities",
      icon: Sparkles,
      href: "/admin/experiences",
    },
    {
      title: "Journal Articles",
      value: posts.length,
      subtitle: "Published travel guides",
      icon: BookOpen,
      href: "/admin/blog",
    },
  ];

  const getStatusBadge = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "contacted":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "booked":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "archived":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Real-time management atelier for Lanka Luxe Journeys. All modifications update the live site instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/tours"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Tour</span>
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#C8A45D]" />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-5 rounded-2xl border transition-all duration-200 group relative overflow-hidden ${
                card.highlight
                  ? "bg-[#142642] border-[#C8A45D]/60 shadow-[0_0_20px_rgba(200,164,93,0.15)]"
                  : "bg-[#0B1A30] border-[#1B2D4A] hover:border-[#C8A45D]/40 hover:bg-[#10233F]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {card.title}
                  </span>
                  <div className="text-3xl font-bold font-serif text-white tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-xs text-[#C8A45D] font-medium pt-1">
                    {card.subtitle}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#081426] border border-[#1B2D4A] text-[#C8A45D] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-[#C8A45D]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Inquiries & Atelier Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries Inbox */}
        <div className="lg:col-span-2 bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#C8A45D]/10 text-[#C8A45D]">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">
                  Recent Inquiries & Leads
                </h2>
                <p className="text-xs text-slate-400">
                  Direct requests submitted by international travelers
                </p>
              </div>
            </div>

            <Link
              href="/admin/inquiries"
              className="text-xs text-[#C8A45D] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All ({inquiries.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-[#081426] border border-[#1B2D4A] hover:border-[#C8A45D]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {inq.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
                          inq.status,
                        )}`}
                      >
                        {inq.status.replace("_", " ")}
                      </span>
                      {inq.country && (
                        <span className="text-xs text-slate-400">
                          · {inq.country}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300">
                      <span className="text-[#C8A45D] font-medium">
                        {inq.tour || inq.interest || "Custom Trip"}
                      </span>
                      {inq.dates && (
                        <span className="text-slate-400">
                          {" "}
                          · Dates: {inq.dates}
                        </span>
                      )}
                      {inq.travelers && (
                        <span className="text-slate-400">
                          {" "}
                          · {inq.travelers} Guests
                        </span>
                      )}
                    </div>

                    {inq.message && (
                      <p className="text-xs text-slate-400 italic line-clamp-1">
                        "{inq.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(
                        /\D/g,
                        "",
                      )}?text=${encodeURIComponent(
                        `Hello ${inq.name}, this is Iroshan from Lanka Luxe Journeys regarding your travel inquiry.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                      title="Contact on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:${inq.email}?subject=Lanka Luxe Journeys - Your Bespoke Sri Lanka Itinerary`}
                      className="p-2 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs border border-[#1B2D4A] flex items-center gap-1.5 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company & Operations Overview Card */}
        <div className="space-y-6">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C8A45D]" />
              Atelier Profile
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#1B2D4A]">
                <span className="text-slate-400">Founder</span>
                <span className="font-semibold text-white">
                  {siteSettings.founderName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1B2D4A]">
                <span className="text-slate-400">SLTDA Licence</span>
                <span className="font-semibold text-[#C8A45D]">
                  {siteSettings.licenseNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1B2D4A]">
                <span className="text-slate-400">Experience</span>
                <span className="font-semibold text-white">
                  {siteSettings.experienceYears} Years Guiding
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1B2D4A]">
                <span className="text-slate-400">WhatsApp</span>
                <span className="font-semibold text-emerald-400">
                  +{contact.whatsapp}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">KakaoTalk</span>
                <span className="font-semibold text-amber-300">
                  {contact.kakao}
                </span>
              </div>
            </div>

            <Link
              href="/admin/settings"
              className="block w-full py-2.5 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-center text-xs font-semibold text-[#C8A45D] border border-[#1B2D4A] transition-colors"
            >
              Edit Company & Hero Settings →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#102442] to-[#0B1A30] border border-[#C8A45D]/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A45D]" />
              Live Site Synchronization
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Any changes made in the Tours, Golf, Destinations, Experiences, Blog, or Settings sections are immediately live in real-time across English and Korean versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
