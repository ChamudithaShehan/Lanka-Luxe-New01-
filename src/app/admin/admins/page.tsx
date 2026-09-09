"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Database,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  HardDrive,
  Clock,
  UserCheck,
  Server,
  X,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

interface BackupItem {
  filename: string;
  sizeBytes: number;
  formattedSize: string;
  createdAt: string;
  type: "json" | "sql.gz";
}

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState<"admins" | "password" | "backup">("admins");
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Admins state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState<AdminUser | null>(null);

  // New admin form
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Reset admin password form
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Change self password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showSelfNewPassword, setShowSelfNewPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Backups state
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);

  // 1. Fetch current logged-in admin
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setCurrentUser(data.user);
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Fetch all admins
  const fetchAdmins = useCallback(async () => {
    setIsLoadingAdmins(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.users) {
        setAdmins(data.users);
      } else {
        toast.error(data.error || "Failed to load admin accounts");
      }
    } catch {
      toast.error("Network error while loading admin users");
    } finally {
      setIsLoadingAdmins(false);
    }
  }, []);

  // 3. Fetch backup history
  const fetchBackups = useCallback(async () => {
    setIsLoadingBackups(true);
    try {
      const res = await fetch("/api/admin/backup", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.backups) {
        setBackups(data.backups);
      }
    } catch {
      toast.error("Network error while loading backups");
    } finally {
      setIsLoadingBackups(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    fetchAdmins();
    fetchBackups();
  }, [fetchCurrentUser, fetchAdmins, fetchBackups]);

  // Create new admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newAdminForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmittingAdmin(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdminForm.name.trim(),
          username: newAdminForm.username.trim().toLowerCase(),
          password: newAdminForm.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Admin account created successfully");
        setShowAddModal(false);
        setNewAdminForm({ name: "", username: "", password: "", confirmPassword: "" });
        fetchAdmins();
      } else {
        toast.error(data.error || "Failed to create administrator");
      }
    } catch {
      toast.error("Network error while creating administrator");
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (admin.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (admins.length <= 1) {
      toast.error("Cannot delete the only remaining administrator");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete administrator account "${admin.name}" (@${admin.username})?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${admin.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Administrator deleted");
        fetchAdmins();
      } else {
        toast.error(data.error || "Failed to delete administrator");
      }
    } catch {
      toast.error("Network error while deleting administrator");
    }
  };

  // Reset another admin's password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetModal) return;

    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (resetPasswordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await fetch("/api/admin/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: showResetModal.id,
          newPassword: resetPasswordForm.newPassword,
          confirmPassword: resetPasswordForm.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Password reset successfully");
        setShowResetModal(null);
        setResetPasswordForm({ newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Network error while resetting password");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // Change self password
  const handleChangeSelfPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await fetch("/api/admin/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch {
      toast.error("Network error while updating password");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Generate server-side backup
  const handleCreateServerBackup = async (type: "json" | "sql") => {
    setIsGeneratingBackup(true);
    const toastId = toast.loading(
      type === "sql"
        ? "Generating MySQL dump archive..."
        : "Creating full database JSON snapshot..."
    );

    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Backup created successfully!", { id: toastId });
        fetchBackups();
      } else {
        toast.error(data.error || "Failed to generate backup", { id: toastId });
      }
    } catch {
      toast.error("Network error while generating backup", { id: toastId });
    } finally {
      setIsGeneratingBackup(false);
    }
  };

  // Delete backup archive
  const handleDeleteBackup = async (filename: string) => {
    const confirmed = window.confirm(`Delete backup file "${filename}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch("/api/admin/backup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Backup file deleted");
        fetchBackups();
      } else {
        toast.error(data.error || "Failed to delete backup file");
      }
    } catch {
      toast.error("Network error while deleting backup file");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#C8A45D]" />
            Admins & Security Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Manage administrative credentials, change access passwords, and generate database backups.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B1A30] border border-[#1B2D4A] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "admins"
                ? "bg-[#C8A45D] text-[#081426] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-[#12233D]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admins</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "admins"
                  ? "bg-[#081426] text-[#C8A45D]"
                  : "bg-[#1B2D4A] text-slate-300"
              }`}
            >
              {admins.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "password"
                ? "bg-[#C8A45D] text-[#081426] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-[#12233D]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "backup"
                ? "bg-[#C8A45D] text-[#081426] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-[#12233D]"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Backup</span>
            {backups.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === "backup"
                    ? "bg-[#081426] text-[#C8A45D]"
                    : "bg-[#1B2D4A] text-slate-300"
                }`}
              >
                {backups.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ADMIN ACCOUNTS                                     */}
      {/* ========================================================= */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">
                  Administrator Accounts
                </h2>
                <p className="text-xs text-slate-400">
                  Users authorized with full access to the Lanka Luxe console
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Admin</span>
            </button>
          </div>

          {/* Admins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((admin) => {
              const isMe = admin.id === currentUser?.id;
              const initials = admin.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={admin.id}
                  className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#C8A45D]/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C8A45D]/20 to-[#8C6D2D]/10 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D] font-serif font-bold text-sm">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white truncate">
                            {admin.name}
                          </h3>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#C8A45D]/20 text-[#C8A45D] text-[10px] font-bold uppercase tracking-wider">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          @{admin.username}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#12233D] text-slate-300 border border-[#1B2D4A]">
                      {admin.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#1B2D4A]/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>
                        Created:{" "}
                        {new Date(admin.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setShowResetModal(admin);
                          setResetPasswordForm({ newPassword: "", confirmPassword: "" });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#12233D] transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#C8A45D]" />
                      </button>

                      {!isMe && admins.length > 1 && (
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CHANGE PASSWORD                                    */}
      {/* ========================================================= */}
      {activeTab === "password" && (
        <div className="max-w-2xl bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1B2D4A] pb-4">
            <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Change Your Password
              </h2>
              <p className="text-xs text-slate-400">
                Update credentials for active administrator account ({currentUser ? `@${currentUser.username}` : "Current User"})
              </p>
            </div>
          </div>

          <form onSubmit={handleChangeSelfPassword} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showSelfNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSelfNewPassword(!showSelfNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSelfNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="px-6 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPassword ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DATABASE BACKUP & RECOVERY                         */}
      {/* ========================================================= */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-white">
                    Database Backup & Snapshot Engine
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    MySQL Online
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export complete data models or generate compressed InnoDB dumps
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchBackups}
                disabled={isLoadingBackups}
                className="p-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-[#1B2D4A] transition-all cursor-pointer"
                title="Refresh backup list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackups ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Two Backup Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A: Full JSON Snapshot */}
            <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 space-y-4 hover:border-[#C8A45D]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#12233D] text-slate-300 border border-[#1B2D4A]">
                    Universal Format
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Full Database JSON Snapshot
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Instantly extracts all 10 core tables: Tours, Golf Courses, Destinations, Experiences, Journal Posts, CRM Inquiries, Gallery, and Site Settings.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {/* Direct Download Button */}
                <a
                  href="/api/admin/backup?download=true&type=json"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Snapshot (.json)</span>
                </a>

                {/* Save to Server Button */}
                <button
                  onClick={() => handleCreateServerBackup("json")}
                  disabled={isGeneratingBackup}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Server className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Save to Server Backups Folder</span>
                </button>
              </div>
            </div>

            {/* Card B: Native MySQL Dump */}
            <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 space-y-4 hover:border-[#C8A45D]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#12233D] text-slate-300 border border-[#1B2D4A]">
                    Gzip Compressed SQL
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Native MySQL Dump (.sql.gz)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Single-transaction InnoDB logical dump using mysqldump with Level 9 gzip compression. Ideal for disaster recovery drills and database restorations.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {/* Direct Download Button */}
                <a
                  href="/api/admin/backup?download=true&type=sql"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-[0_4px_16px_rgba(2,132,199,0.3)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MySQL Dump (.sql.gz)</span>
                </a>

                {/* Save to Server Button */}
                <button
                  onClick={() => handleCreateServerBackup("sql")}
                  disabled={isGeneratingBackup}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-semibold border border-[#1B2D4A] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Server className="w-3.5 h-3.5 text-sky-400" />
                  <span>Generate Server Dump Archive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Backup History Table */}
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-white">
                  Stored Server Backups ({backups.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Archives located on server in <code className="text-slate-300 bg-[#07111E] px-1 py-0.5 rounded">./backups/</code>
                </p>
              </div>
            </div>

            {backups.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Database className="w-8 h-8 text-slate-600" />
                <span>No backups stored on server yet. Use the buttons above to generate one.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#07111E] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1B2D4A]">
                    <tr>
                      <th className="px-4 py-3">Filename</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2D4A]/50 font-mono">
                    {backups.map((b) => (
                      <tr key={b.filename} className="hover:bg-[#12233D]/50 transition-colors">
                        <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                          {b.type === "json" ? (
                            <HardDrive className="w-3.5 h-3.5 text-[#C8A45D]" />
                          ) : (
                            <FileArchive className="w-3.5 h-3.5 text-sky-400" />
                          )}
                          <span className="truncate max-w-xs">{b.filename}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.type === "json"
                                ? "bg-[#C8A45D]/10 text-[#C8A45D]"
                                : "bg-sky-500/10 text-sky-400"
                            }`}
                          >
                            {b.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{b.formattedSize}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(b.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/api/admin/backup/download?file=${encodeURIComponent(b.filename)}`}
                              download={b.filename}
                              className="p-1.5 rounded-lg bg-[#12233D] hover:bg-[#1B2D4A] text-[#C8A45D] hover:text-white transition-colors"
                              title="Download backup file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteBackup(b.filename)}
                              className="p-1.5 rounded-lg bg-[#12233D] hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete backup file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW ADMIN                                      */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">
                  Add New Administrator
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAdminForm.name}
                  onChange={(e) =>
                    setNewAdminForm({ ...newAdminForm, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Chamuditha Shehan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Username *
                </label>
                <input
                  type="text"
                  value={newAdminForm.username}
                  onChange={(e) =>
                    setNewAdminForm({ ...newAdminForm, username: e.target.value })
                  }
                  required
                  pattern="^[a-zA-Z0-9_-]+$"
                  placeholder="e.g. chamuditha"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none font-mono"
                />
                <span className="text-[10px] text-slate-500">
                  Letters, numbers, underscores, and hyphens only
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newAdminForm.password}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, password: e.target.value })
                    }
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={newAdminForm.confirmPassword}
                  onChange={(e) =>
                    setNewAdminForm({
                      ...newAdminForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1B2D4A]/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#12233D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdmin && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Administrator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESET ADMIN PASSWORD                               */}
      {/* ========================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Reset Password
                  </h3>
                  <p className="text-xs text-slate-400">
                    For administrator: @{showResetModal.username} ({showResetModal.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#12233D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  New Password *
                </label>
                <input
                  type="password"
                  value={resetPasswordForm.newPassword}
                  onChange={(e) =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white placeholder-slate-500 focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1B2D4A]/60">
                <button
                  type="button"
                  onClick={() => setShowResetModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#12233D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReset}
                  className="px-5 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-[0_4px_16px_rgba(200,164,93,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReset && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Reset Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
