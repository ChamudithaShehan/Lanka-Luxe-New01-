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
} from "lucide-react";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin/AdminPagination";

export default function AdminInquiriesPage() {
  const { inquiries, addInquiry, updateInquiryStatus, deleteInquiry, contact } =
    useContentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // New Inquiry form state
  const [newForm, setNewForm] = useState({
    name: "",
    email: "",
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

  const handleStatusChange = (
    id: string,
    newStatus: Inquiry["status"],
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.stopPropagation();
    updateInquiryStatus(id, newStatus);
    toast.success(`Lead status updated to ${newStatus.replace("_", " ")}`);
  };

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) {
      toast.error("Name and Email are required.");
      return;
    }

    addInquiry(newForm);
    setIsNewModalOpen(false);
    setNewForm({
      name: "",
      email: "",
      country: "South Korea",
      dates: "",
      travelers: "2",
      interest: "luxury",
      tour: "",
      budget: "",
      message: "",
    });
    toast.success("New lead recorded in CRM!");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
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
        {filteredInquiries.length === 0 ? (
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
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(
                    /\D/g,
                    "",
                  )}?text=${encodeURIComponent(
                    `Hello ${inq.name}, Iroshan Jayawickrame here from Lanka Luxe Journeys. Thank you for your inquiry regarding ${
                      inq.tour || "a luxury journey to Sri Lanka"
                    }. I would love to assist you with availability and custom itinerary planning.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Email button */}
                <a
                  href={`mailto:${inq.email}?subject=Lanka Luxe Journeys - Bespoke Itinerary Availability for ${encodeURIComponent(
                    inq.name,
                  )}`}
                  className="p-2 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs border border-[#1B2D4A] flex items-center gap-1.5 transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span className="hidden sm:inline">Email</span>
                </a>

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#07111E] border border-[#1B2D4A]">
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="font-semibold text-white truncate block">
                  {selectedInquiry.email}
                </span>
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

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(
                    /\D/g,
                    "",
                  )}?text=${encodeURIComponent(
                    `Hello ${selectedInquiry.name}, this is Iroshan from Lanka Luxe Journeys regarding your Sri Lanka travel inquiry.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Client</span>
                </a>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Lanka Luxe Journeys - Bespoke Itinerary Availability for ${encodeURIComponent(
                    selectedInquiry.name,
                  )}`}
                  className="px-4 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-[#C8A45D]" />
                  <span>Email Client</span>
                </a>
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
                onClick={() => {
                  deleteInquiry(deleteConfirmId);
                  setDeleteConfirmId(null);
                  toast.success("Lead deleted.");
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
