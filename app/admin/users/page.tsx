"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Check,
  Copy,
  Lock,
  Mail,
  User,
  Shield,
  FileText,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "MODERATOR";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    blogs: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"MODERATOR" | "SUPER_ADMIN">("MODERATOR");
  const [copiedPass, setCopiedPass] = useState(false);

  // Reset password modal states
  const [resetModalUser, setResetModalUser] = useState<AdminUserItem | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetPassValue, setResetPassValue] = useState("");

  // Action loading IDs
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Verify Super Admin authorization
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.authenticated) {
          router.replace("/admin/login");
          return;
        }
        if (data.admin.role !== "SUPER_ADMIN") {
          router.replace("/admin/blogs");
          return;
        }
        setCurrentAdminId(data.admin.id);
        fetchUsers();
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [router]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to load user accounts.");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading users.");
    } finally {
      setLoading(false);
    }
  }

  // Generate random secure password helper
  const handleGeneratePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let pass = "SharperMod-";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setCopiedPass(false);
  };

  const handleCopyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setSuccessMsg(`Account for "${newName}" (${newRole}) created successfully!`);
      setTimeout(() => setSuccessMsg(""), 5000);

      // Reset form & close modal
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("MODERATOR");
      setCreateModalOpen(false);

      // Refresh users list
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating account.");
    } finally {
      setCreating(false);
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleActive = async (user: AdminUserItem) => {
    if (user.id === currentAdminId) {
      alert("You cannot deactivate your own Super Admin account.");
      return;
    }

    const nextStatus = !user.isActive;
    const confirmMsg = nextStatus
      ? `Re-activate login access for "${user.name}"?`
      : `Deactivate login access for "${user.name}"? They will not be able to sign in.`;

    if (!confirm(confirmMsg)) return;

    setActionLoadingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update account status.");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !resetPassValue) return;

    setResettingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${resetModalUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassValue }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccessMsg(`Password for "${resetModalUser.name}" successfully updated!`);
      setTimeout(() => setSuccessMsg(""), 5000);

      setResetModalUser(null);
      setResetPassValue("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error resetting password.");
    } finally {
      setResettingPassword(false);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (user: AdminUserItem) => {
    if (user.id === currentAdminId) {
      alert("You cannot delete your own Super Admin account.");
      return;
    }

    const confirmMsg = `Are you sure you want to permanently delete the account for "${user.name}" (${user.email})? This action cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    setActionLoadingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account.");
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSuccessMsg(`Account "${user.name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting account.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered users by search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const totalUsers = users.length;
  const moderatorsCount = users.filter((u) => u.role === "MODERATOR").length;
  const superAdminsCount = users.filter((u) => u.role === "SUPER_ADMIN").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Access Control & Authentication
          </span>
          <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Team & Moderator Logins
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create and manage editorial moderator accounts with dedicated blog authoring access.
          </p>
        </div>

        <button
          onClick={() => {
            handleGeneratePassword();
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors self-start cursor-pointer"
        >
          <UserPlus className="h-4 w-4" /> Create Moderator Account
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Team Accounts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-50 text-navy-900">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            {totalUsers}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">
            Authorized administrative logins
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Moderators
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-emerald-600 sm:text-3xl">
            {moderatorsCount}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">
            Dedicated blog authoring access
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Super Admins
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            {superAdminsCount}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">
            Full root & analytics access
          </span>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name, email, or role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-navy-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <button
          onClick={fetchUsers}
          title="Refresh List"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role & Access</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500 mb-2" />
                    Loading team accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentAdminId;
                  const isBusy = actionLoadingId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                              user.role === "SUPER_ADMIN"
                                ? "bg-navy-900 text-orange-400"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-navy-900">{user.name}</span>
                              {isCurrent && (
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.role === "SUPER_ADMIN" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-navy-950 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 border border-navy-800">
                            <Shield className="h-3 w-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <FileText className="h-3 w-3" /> Moderator
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={isCurrent || isBusy}
                          title={
                            isCurrent
                              ? "Cannot change self status"
                              : user.isActive
                              ? "Click to deactivate"
                              : "Click to activate"
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                            user.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          } ${isCurrent ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`}
                          />
                          {user.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>

                      {/* Articles Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {user._count?.blogs || 0} articles
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setResetModalUser(user);
                              setResetPassValue("");
                            }}
                            title="Reset Password"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-900 transition-colors cursor-pointer"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              disabled={isBusy}
                              title="Delete Account"
                              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isBusy ? (
                                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Moderator Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900">
                    Create Moderator Account
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Generate an administrative login for content authoring.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-navy-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Email Address (Login Username)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="alex@sharper-labs.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-navy-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Role Assignment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole("MODERATOR")}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                      newRole === "MODERATOR"
                        ? "border-emerald-500 bg-emerald-50/50 font-bold text-emerald-900"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-bold">Moderator</p>
                      <p className="text-[10px] text-slate-400 font-normal">Blogs only</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole("SUPER_ADMIN")}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                      newRole === "SUPER_ADMIN"
                        ? "border-orange-500 bg-orange-50/50 font-bold text-navy-950"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Shield className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-bold">Super Admin</p>
                      <p className="text-[10px] text-slate-400 font-normal">Full access</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-navy-900">
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-16 text-xs text-navy-900 font-mono placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    title="Copy Password"
                    className="absolute right-2 rounded-lg bg-slate-200/80 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedPass ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Please securely share this password with the moderator.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-sm font-bold text-navy-900">
                Reset Password for {resetModalUser.name}
              </h3>
              <button
                onClick={() => setResetModalUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Enter New Password
                </label>
                <input
                  type="text"
                  required
                  value={resetPassValue}
                  onChange={(e) => setResetPassValue(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-navy-900 font-mono focus:border-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="rounded-xl bg-navy-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-navy-800 disabled:opacity-50"
                >
                  {resettingPassword ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
