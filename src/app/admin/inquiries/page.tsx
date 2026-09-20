"use client";

import React, { useState } from "react";
import { useContentStore, type Inquiry } from "@/lib/content-store";
import {
  Inbox,
  Search,
  MessageCircle,
  Mail,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  FileText,
  X,
  Download,
  Filter,
  RefreshCw,
  Copy,
  Check,
  Send,
  ExternalLink,
  Eye,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin/AdminPagination";

const EMAIL_TEMPLATES = [
  {
    id: "bespoke",
    name: "Bespoke Consultation",
    getSubject: (inq: Inquiry) =>
      `Lanka Luxe Journeys — Private Itinerary Consultation for ${inq.name} [Ref: ${inq.reference || inq.id}]`,
    getMessage: (inq: Inquiry) =>
      `Thank you for contacting Lanka Luxe Journeys regarding your upcoming journey to Sri Lanka.\n\nI am Iroshan Jayawickrame, founder and licensed senior tourist guide (SLTDA Licence: C-1734). It is our privilege to assist you in designing a seamless and unforgettable private travel experience.\n\nBased on your inquiry for "${inq.tour || inq.interest || "Bespoke Journey"}" (${inq.travelers || "2"} guests${inq.dates ? `, planned for ${inq.dates}` : ""}), our concierge desk is preparing a personalized preliminary itinerary proposal.\n\nTo ensure every detail matches your travel style:\n1. Would you like us to include private chauffeur-driven luxury transport throughout your tour?\n2. Do you have specific preferences for boutique heritage villas or 5-star colonial tea bungalows?\n\nPlease let us know if you would like to arrange a quick WhatsApp consultation or if you prefer receiving our comprehensive itinerary draft directly here.\n\nWarmest regards,\nIroshan Jayawickrame\nFounder & Concierge, Lanka Luxe Journeys`,
  },
  {
    id: "golf",
    name: "Golf & Scenic Proposal",
    getSubject: (inq: Inquiry) =>
      `Lanka Luxe Journeys — Scenic Golf & Leisure Proposal for ${inq.name} [Ref: ${inq.reference || inq.id}]`,
    getMessage: (inq: Inquiry) =>
      `Thank you for your inquiry regarding our bespoke Golf Holidays in Sri Lanka.\n\nWe are delighted to craft an exclusive golf and leisure itinerary tailored to your party. We have reserved provisional interest for prime tee times at Victoria Golf Resort (Kandy) and Nuwara Eliya Golf Club, paired with luxury boutique colonial accommodation.\n\nKey inclusions in this journey:\n• Confirmed tee times, caddies, and premium golf carts\n• Private executive luxury transport with dedicated chauffeur guide\n• Handpicked 5-star stays (e.g. Ceylon Tea Trails & Kandy boutique resorts)\n\nPlease review your travel dates (${inq.dates || "Flexible dates"}) and let us know if you have any special golf bag transport requirements or wish to include private scenic helicopter transfers.\n\nWarm regards,\nIroshan Jayawickrame\nLanka Luxe Journeys`,
  },
  {
    id: "availability",
    name: "Availability & Draft",
    getSubject: (inq: Inquiry) =>
      `Lanka Luxe Journeys — Availability & Bespoke Draft for ${inq.name}`,
    getMessage: (inq: Inquiry) =>
      `Thank you for your interest in Lanka Luxe Journeys.\n\nWe have verified seasonal availability for your requested travel dates (${inq.dates || "Upcoming Season"}). We would be thrilled to secure private suites and our premier licensed guides for your party of ${inq.travelers || "2"} travelers.\n\nKindly confirm if there are any specific culinary, wellness, or safari highlights you would like us to prioritize in the schedule.\n\nLooking forward to crafting your bespoke Ceylon journey.\n\nWarmest regards,\nIroshan Jayawickrame\nLanka Luxe Journeys`,
  },
  {
    id: "custom",
    name: "Custom Blank",
    getSubject: (inq: Inquiry) =>
      `Lanka Luxe Journeys — Travel Consultation for ${inq.name}`,
    getMessage: () => ``,
  },
];

export default function AdminInquiriesPage() {
  const {
    inquiries,
    addInquiry,
    updateInquiryStatus,
    deleteInquiry,
    contact,
    refreshContent,
    isLoading,
  } = useContentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Email Reply Modal State (SMTP)
  const [emailModalInquiry, setEmailModalInquiry] = useState<Inquiry | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("bespoke");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [autoUpdateStatus, setAutoUpdateStatus] = useState(true);
  const [emailPreviewMode, setEmailPreviewMode] = useState(false);

  // Always fetch fresh inquiries directly from database on mount
  React.useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshContent();
      toast.success("Inquiries reloaded directly from database.");
    } catch {
      toast.error("Failed to reload inquiries.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // New Inquiry form state
  const [newForm, setNewForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    kakaoId: "",
    country: "South Korea",
    dates: "",
    travelers: "2",
    interest: "luxury",
    tour: "",
    budget: "",
    message: "",
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.tour && inq.tour.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.country && inq.country.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInquiries.length / pageSize);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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

  const handleStatusChange = async (
    id: string,
    newStatus: Inquiry["status"],
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.stopPropagation();
    const res = await updateInquiryStatus(id, newStatus);
    if (res?.success) {
      toast.success(`Lead status updated to ${newStatus.replace("_", " ")}`);
    } else {
      toast.error(res?.error || "Failed to update status");
    }
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      await addInquiry(newForm);
      setIsNewModalOpen(false);
      setNewForm({
        name: "",
        email: "",
        whatsapp: "",
        kakaoId: "",
        country: "South Korea",
        dates: "",
        travelers: "2",
        interest: "luxury",
        tour: "",
        budget: "",
        message: "",
      });
      toast.success("New lead recorded in CRM!");
    } catch (err: any) {
      toast.error(err.message || "Failed to record lead in CRM");
    }
  };

  const handleCopyKakao = (kakaoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!kakaoId) {
      toast.error("No KakaoTalk ID provided for this lead.");
      return;
    }
    navigator.clipboard.writeText(kakaoId);
    toast.success(`KakaoTalk ID copied: ${kakaoId}`);
  };

  const handleOpenWhatsApp = (inq: Inquiry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const rawNumber = inq.whatsapp || inq.phone || "";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    if (!cleanNumber) {
      toast.error("No WhatsApp or phone number provided for this lead.");
      return;
    }
    const greeting = `Hello ${inq.name}, Iroshan Jayawickrame here from Lanka Luxe Journeys. Thank you for your inquiry regarding ${
      inq.tour || inq.interest || "a luxury journey to Sri Lanka"
    }. I would be delighted to assist you with availability and bespoke itinerary planning.`;
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`,
      "_blank"
    );
  };

  const openEmailModal = (inq: Inquiry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmailModalInquiry(inq);
    setSelectedTemplate("bespoke");
    const tpl = EMAIL_TEMPLATES[0];
    setEmailSubject(tpl.getSubject(inq));
    setEmailMessage(tpl.getMessage(inq));
    setEmailPreviewMode(false);
    setAutoUpdateStatus(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    if (!emailModalInquiry) return;
    setSelectedTemplate(templateId);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setEmailSubject(tpl.getSubject(emailModalInquiry));
      setEmailMessage(tpl.getMessage(emailModalInquiry));
    }
  };

  const handleSendSmtpEmail = async () => {
    if (!emailModalInquiry) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Email subject and message body are required.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/admin/inquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: emailModalInquiry.id,
          to: emailModalInquiry.email,
          toName: emailModalInquiry.name,
          subject: emailSubject,
          message: emailMessage,
          updateStatus: autoUpdateStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to send email via SMTP.");
        return;
      }

      toast.success(
        `Bespoke email successfully sent to ${emailModalInquiry.email} via SMTP!`
      );
      setEmailModalInquiry(null);
      await refreshContent();

      if (selectedInquiry && selectedInquiry.id === emailModalInquiry.id) {
        setSelectedInquiry({
          ...selectedInquiry,
          status:
            autoUpdateStatus && selectedInquiry.status === "new"
              ? "contacted"
              : selectedInquiry.status,
          notes: selectedInquiry.notes
            ? `${selectedInquiry.notes}\n[SMTP Email Sent]: "${emailSubject}"`
            : `[SMTP Email Sent]: "${emailSubject}"`,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Network error sending email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "WhatsApp",
      "KakaoTalk",
      "Country",
      "Dates",
      "Travelers",
      "Interest",
      "Tour",
      "Budget",
      "Status",
      "Message",
    ];

    const rows = inquiries.map((i) => [
      i.id,
      new Date(i.createdAt).toLocaleDateString(),
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.whatsapp || i.phone || ""}"`,
      `"${i.kakaoId || ""}"`,
      `"${i.country || ""}"`,
      `"${i.dates || ""}"`,
      `"${i.travelers || ""}"`,
      `"${i.interest || ""}"`,
      `"${i.tour || ""}"`,
      `"${i.budget || ""}"`,
      `"${i.status}"`,
      `"${(i.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `lanka-luxe-leads-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Inbox className="w-7 h-7 text-[#C8A45D]" />
            Inquiries & Client CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Track customer trip requests, convert leads, record notes, and communicate via WhatsApp or Email.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Inquiries directly from Database"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#C8A45D] ${
                isRefreshing || isLoading ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing || isLoading ? "Reloading..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-colors"
          >
            <Download className="w-4 h-4 text-[#C8A45D]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Leads", count: inquiries.length },
            {
              id: "new",
              label: "New",
              count: inquiries.filter((i) => i.status === "new").length,
            },
            {
              id: "in_progress",
              label: "In Progress",
              count: inquiries.filter((i) => i.status === "in_progress").length,
            },
            {
              id: "contacted",
              label: "Contacted",
              count: inquiries.filter((i) => i.status === "contacted").length,
            },
            {
              id: "booked",
              label: "Booked",
              count: inquiries.filter((i) => i.status === "booked").length,
            },
            {
              id: "archived",
              label: "Archived",
              count: inquiries.filter((i) => i.status === "archived").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? "bg-[#C8A45D] text-[#081426]"
                  : "bg-[#07111E] text-slate-400 hover:text-white border border-[#1B2D4A]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id
                    ? "bg-[#081426] text-[#C8A45D]"
                    : "bg-[#12233D] text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {isLoading || isRefreshing ? (
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#C8A45D] animate-spin" />
            <span>Loading inquiries directly from MySQL database...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-12 text-center text-slate-400 text-xs">
            No inquiries match your current filters.
          </div>
        ) : (
          paginatedInquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => setSelectedInquiry(inq)}
              className="bg-[#0B1A30] border border-[#1B2D4A] hover:border-[#C8A45D]/40 rounded-2xl p-5 transition-all duration-200 cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-serif text-base font-bold text-white group-hover:text-[#C8A45D] transition-colors">
                    {inq.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      inq.status,
                    )}`}
                  >
                    {inq.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400">
                    · {inq.email}
                  </span>
                  {inq.country && (
                    <span className="text-xs text-slate-400">
                      · 📍 {inq.country}
                    </span>
                  )}
                  {inq.whatsapp && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>{inq.whatsapp}</span>
                    </span>
                  )}
                  {inq.kakaoId && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      <span className="font-bold text-[10px]">K</span>
                      <span>{inq.kakaoId}</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 ml-auto lg:ml-0">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="text-[#C8A45D] font-semibold">
                    Package: {inq.tour || inq.interest || "Bespoke Journey"}
                  </span>
                  {inq.dates && (
                    <span className="text-slate-400">
                      📅 {inq.dates}
                    </span>
                  )}
                  {inq.travelers && (
                    <span className="text-slate-400">
                      👥 {inq.travelers} Travelers
                    </span>
                  )}
                  {inq.budget && (
                    <span className="text-emerald-400 font-medium">
                      💰 {inq.budget}
                    </span>
                  )}
                </div>

                {inq.message && (
                  <p className="text-xs text-slate-400 line-clamp-1 italic bg-[#07111E]/80 p-2 rounded-lg border border-[#1B2D4A]/50">
                    "{inq.message}"
                  </p>
                )}

                {inq.notes && (
                  <div className="text-[11px] text-amber-300/80 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#C8A45D]" />
                    <span>Internal Note: {inq.notes}</span>
                  </div>
                )}
              </div>

              {/* Right Quick Actions */}
              <div
                className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1B2D4A]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Status Dropdown */}
                <select
                  value={inq.status}
                  onChange={(e) =>
                    handleStatusChange(
                      inq.id,
                      e.target.value as Inquiry["status"],
                      e,
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#07111E] border border-[#1B2D4A] text-xs text-slate-200 font-semibold focus:border-[#C8A45D] outline-none"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="archived">Archived</option>
                </select>

                {/* WhatsApp button */}
                <button
                  type="button"
                  onClick={(e) => handleOpenWhatsApp(inq, e)}
                  disabled={!inq.whatsapp && !inq.phone}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inq.whatsapp || inq.phone
                      ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800/40 text-slate-500 border border-slate-700/30 cursor-not-allowed opacity-50"
                  }`}
                  title={
                    inq.whatsapp || inq.phone
                      ? `Chat on WhatsApp with ${inq.name} (${inq.whatsapp || inq.phone})`
                      : "No WhatsApp number provided"
                  }
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Kakao button */}
                <button
                  type="button"
                  onClick={(e) => handleCopyKakao(inq.kakaoId || "", e)}
                  disabled={!inq.kakaoId}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inq.kakaoId
                      ? "bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-slate-800/40 text-slate-500 border border-slate-700/30 cursor-not-allowed opacity-50"
                  }`}
                  title={
                    inq.kakaoId
                      ? `Copy KakaoTalk ID: ${inq.kakaoId}`
                      : "No KakaoTalk ID provided"
                  }
                >
                  <span className="font-bold text-xs">K</span>
                  <span className="hidden sm:inline">Kakao</span>
                </button>

                {/* Email (SMTP) button */}
                <button
                  type="button"
                  onClick={(e) => openEmailModal(inq, e)}
                  className="p-2 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs border border-[#1B2D4A] hover:border-[#C8A45D]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={`Reply via SMTP Email to ${inq.email}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span className="hidden sm:inline">Email (SMTP)</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => setDeleteConfirmId(inq.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30 transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredInquiries.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50]}
          itemLabel="inquiries"
        />
      </div>

      {/* DETAIL INQUIRY MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    selectedInquiry.status,
                  )}`}
                >
                  {selectedInquiry.status.replace("_", " ")}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  {selectedInquiry.name}
                </h2>
                <p className="text-xs text-slate-400">
                  Inquiry submitted on{" "}
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="font-semibold text-white truncate block">
                  {selectedInquiry.email}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">WhatsApp</span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 truncate block">
                    {selectedInquiry.whatsapp || selectedInquiry.phone || "Not provided"}
                  </span>
                  {(selectedInquiry.whatsapp || selectedInquiry.phone) && (
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(selectedInquiry)}
                      className="p-1 hover:text-emerald-300 text-slate-400 ml-1 cursor-pointer"
                      title="Open WhatsApp chat"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">KakaoTalk ID</span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300 truncate block">
                    {selectedInquiry.kakaoId || "Not provided"}
                  </span>
                  {selectedInquiry.kakaoId && (
                    <button
                      type="button"
                      onClick={() => handleCopyKakao(selectedInquiry.kakaoId || "")}
                      className="p-1 hover:text-amber-200 text-slate-400 ml-1 cursor-pointer"
                      title="Copy KakaoTalk ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Country</span>
                <span className="font-semibold text-white block">
                  {selectedInquiry.country || "Not specified"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Travelers</span>
                <span className="font-semibold text-white block">
                  {selectedInquiry.travelers || "2"} Guests
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Dates</span>
                <span className="font-semibold text-white block">
                  {selectedInquiry.dates || "Flexible"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Interest</span>
                <span className="font-semibold text-[#C8A45D] block">
                  {selectedInquiry.interest || "Luxury"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Budget</span>
                <span className="font-semibold text-emerald-400 block">
                  {selectedInquiry.budget || "Custom"}
                </span>
              </div>
            </div>

            {/* Tour & Message */}
            <div className="space-y-3">
              {selectedInquiry.tour && (
                <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                  <span className="text-xs text-slate-400 block mb-0.5">
                    Selected Tour Package:
                  </span>
                  <span className="text-sm font-bold text-[#C8A45D]">
                    {selectedInquiry.tour}
                  </span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#07111E] border border-[#1B2D4A] space-y-1">
                <span className="text-xs font-semibold text-slate-300">
                  Client Message / Special Requests:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedInquiry.message || "No custom message provided."}"
                </p>
              </div>
            </div>

            {/* Internal Notes Editor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Internal Concierge Notes:
              </label>
              <textarea
                rows={3}
                value={selectedInquiry.notes || ""}
                onChange={(e) => {
                  const updatedNotes = e.target.value;
                  setSelectedInquiry({
                    ...selectedInquiry,
                    notes: updatedNotes,
                  });
                  updateInquiryStatus(
                    selectedInquiry.id,
                    selectedInquiry.status,
                    updatedNotes,
                  );
                }}
                placeholder="e.g. Client prefers 5-star colonial suites and private golf tee times on weekdays..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1B2D4A]">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium">
                  Status:
                </label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => {
                    const newSt = e.target.value as Inquiry["status"];
                    setSelectedInquiry({ ...selectedInquiry, status: newSt });
                    updateInquiryStatus(
                      selectedInquiry.id,
                      newSt,
                      selectedInquiry.notes,
                    );
                    toast.success("Status updated");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#07111E] border border-[#1B2D4A] text-xs text-slate-200 font-semibold focus:border-[#C8A45D] outline-none"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(selectedInquiry)}
                  disabled={!selectedInquiry.whatsapp && !selectedInquiry.phone}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
                    selectedInquiry.whatsapp || selectedInquiry.phone
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                  }`}
                  title={
                    selectedInquiry.whatsapp || selectedInquiry.phone
                      ? `Chat with ${selectedInquiry.name} on WhatsApp`
                      : "No WhatsApp number provided"
                  }
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyKakao(selectedInquiry.kakaoId || "")}
                  disabled={!selectedInquiry.kakaoId}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
                    selectedInquiry.kakaoId
                      ? "bg-amber-500 hover:bg-amber-400 text-[#081426]"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                  }`}
                  title={
                    selectedInquiry.kakaoId
                      ? `Copy KakaoTalk ID: ${selectedInquiry.kakaoId}`
                      : "No KakaoTalk ID provided"
                  }
                >
                  <span className="font-bold text-xs">K</span>
                  <span>Kakao Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEmailModal(selectedInquiry)}
                  className="px-3.5 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] border border-[#C8A45D]/40 text-[#C8A45D] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                  title="Compose & Send Email via SMTP"
                >
                  <Mail className="w-4 h-4 text-[#C8A45D]" />
                  <span>Compose Email (SMTP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL LEAD MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-3">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C8A45D]" />
                Record New Client Inquiry
              </h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newForm.name}
                    onChange={(e) =>
                      setNewForm({ ...newForm, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    value={newForm.email}
                    onChange={(e) =>
                      setNewForm({ ...newForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +82 10 1234 5678"
                    value={newForm.whatsapp}
                    onChange={(e) =>
                      setNewForm({ ...newForm, whatsapp: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    KakaoTalk ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @user_kakao"
                    value={newForm.kakaoId}
                    onChange={(e) =>
                      setNewForm({ ...newForm, kakaoId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newForm.country}
                    onChange={(e) =>
                      setNewForm({ ...newForm, country: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Travelers
                  </label>
                  <input
                    type="text"
                    value={newForm.travelers}
                    onChange={(e) =>
                      setNewForm({ ...newForm, travelers: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Interest
                  </label>
                  <select
                    value={newForm.interest}
                    onChange={(e) =>
                      setNewForm({ ...newForm, interest: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  >
                    <option value="luxury">Luxury Holiday</option>
                    <option value="golf">Golf Holiday</option>
                    <option value="wildlife">Wildlife Safari</option>
                    <option value="culture">Cultural Heritage</option>
                    <option value="honeymoon">Honeymoon</option>
                    <option value="custom">Custom Trip</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Travel Dates
                  </label>
                  <input
                    type="text"
                    value={newForm.dates}
                    onChange={(e) =>
                      setNewForm({ ...newForm, dates: e.target.value })
                    }
                    placeholder="e.g. Oct 15 - 25, 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newForm.budget}
                    onChange={(e) =>
                      setNewForm({ ...newForm, budget: e.target.value })
                    }
                    placeholder="e.g. $5,000 - $10,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Notes / Request Details
                </label>
                <textarea
                  rows={3}
                  value={newForm.message}
                  onChange={(e) =>
                    setNewForm({ ...newForm, message: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#12233D] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPOSE & SEND EMAIL VIA SMTP MODAL */}
      {emailModalInquiry && (
        <div className="fixed inset-0 bg-black/85 z-[60] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B1A30] border border-[#C8A45D]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#C8A45D]/10 text-[#C8A45D]">
                    <Mail className="w-5 h-5" />
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Compose & Reply via SMTP
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Transmitting to: <strong className="text-white">{emailModalInquiry.name}</strong> (<span className="text-[#C8A45D]">{emailModalInquiry.email}</span>) · Ref: {emailModalInquiry.reference || emailModalInquiry.id}
                </p>
              </div>
              <button
                onClick={() => setEmailModalInquiry(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector Bar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Luxury Concierge Templates:
              </label>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedTemplate === tpl.id
                        ? "bg-[#C8A45D] text-[#081426] shadow-md font-bold"
                        : "bg-[#07111E] text-slate-300 hover:text-white border border-[#1B2D4A]"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle (Editor vs Live HTML Preview) */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEmailPreviewMode(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !emailPreviewMode
                      ? "bg-[#12233D] text-[#C8A45D] border border-[#C8A45D]/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Edit Message
                </button>
                <button
                  type="button"
                  onClick={() => setEmailPreviewMode(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    emailPreviewMode
                      ? "bg-[#12233D] text-[#C8A45D] border border-[#C8A45D]/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Branded Email Preview</span>
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoUpdateStatus}
                  onChange={(e) => setAutoUpdateStatus(e.target.checked)}
                  className="rounded border-[#1B2D4A] text-[#C8A45D] focus:ring-[#C8A45D]"
                />
                <span>Set status to "Contacted" on send</span>
              </label>
            </div>

            {/* Editor vs Preview Mode */}
            {!emailPreviewMode ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                    placeholder="Subject..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Message Body (Transmitted with Lanka Luxe signature footer):
                  </label>
                  <textarea
                    rows={9}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white leading-relaxed focus:border-[#C8A45D] outline-none font-sans"
                    placeholder="Write your personal consultation reply..."
                  />
                </div>
              </div>
            ) : (
              /* Live Preview */
              <div className="rounded-2xl border border-[#1B2D4A] bg-slate-950/60 p-4 max-h-[380px] overflow-y-auto space-y-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg text-slate-800 p-6 space-y-4 max-w-xl mx-auto border border-slate-200">
                  {/* Mock Email Header */}
                  <div className="bg-[#081426] -m-6 mb-4 p-5 text-center border-b-2 border-[#C8A45D]">
                    <span className="text-[10px] tracking-widest text-[#C8A45D] uppercase font-bold block mb-1">
                      ✦ BESPOKE PRIVATE JOURNEYS · SRI LANKA ✦
                    </span>
                    <h3 className="font-serif text-lg text-white font-bold tracking-wide">
                      LANKA LUXE JOURNEYS
                    </h3>
                  </div>

                  <p className="font-serif text-sm font-bold text-[#081426]">
                    Dear {emailModalInquiry.name},
                  </p>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {emailMessage || "Your message body will appear here..."}
                  </div>

                  <div className="pt-4 border-t border-slate-200 text-xs">
                    <p className="font-serif font-bold text-[#081426]">Warmest regards,</p>
                    <p className="font-bold text-[#C8A45D]">Iroshan Jayawickrame</p>
                    <p className="text-[11px] text-slate-500">
                      Founder & Senior Private Concierge · SLTDA Licence C-1734
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1B2D4A]">
              <a
                href={`mailto:${emailModalInquiry.email}?subject=${encodeURIComponent(
                  emailSubject
                )}&body=${encodeURIComponent(emailMessage)}`}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
                title="Fallback to local desktop mail client"
              >
                Or open in local desktop mail client (mailto)
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEmailModalInquiry(null)}
                  disabled={isSendingEmail}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#12233D] text-slate-300 hover:bg-[#1B2D4A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSendSmtpEmail}
                  disabled={isSendingEmail}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting via SMTP...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Email via SMTP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-red-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-serif text-lg font-bold text-white">
              Delete Lead?
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this inquiry record?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12233D] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const res = await deleteInquiry(deleteConfirmId);
                  setDeleteConfirmId(null);
                  if (res?.success) {
                    toast.success("Lead deleted.");
                  } else {
                    toast.error(res?.error || "Failed to delete lead");
                  }
                }}
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
