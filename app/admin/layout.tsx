"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart3,
  Inbox,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Loader2,
  ChevronRight,
  Bell,
  PlusCircle,
  Users,
  Mail,
  AlertTriangle,
} from "lucide-react";
import ForceChangePasswordScreen from "@/components/admin/ForceChangePasswordScreen";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword?: boolean;
  isEmailVerified?: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const cleanPath = decodeURIComponent(pathname || "").trim().replace(/\s+/g, "");
  const normalizedPath = cleanPath.replace(/\/+$/, "") || "/";
  const isLoginPage = normalizedPath === "/admin/login" || normalizedPath.endsWith("/admin/login");
  const isVerifyEmailPage = normalizedPath === "/admin/verify-email" || normalizedPath.endsWith("/admin/verify-email");
  const isPublicAdminPage = isLoginPage || isVerifyEmailPage;

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resendingSelf, setResendingSelf] = useState(false);
  const [selfResendMsg, setSelfResendMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResendSelfVerification = async () => {
    if (!admin?.id || resendingSelf) return;
    setResendingSelf(true);
    setSelfResendMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${admin.id}/resend-verification`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend verification email");
      setSelfResendMsg({ type: "success", text: "Verification email sent! Check your inbox." });
    } catch (err: any) {
      setSelfResendMsg({ type: "error", text: err.message || "Could not send verification email." });
    } finally {
      setResendingSelf(false);
    }
  };

  useEffect(() => {
    if (isVerifyEmailPage) {
      setLoading(false);
      return;
    }

    // If on login page, check if already logged in; if so redirect to appropriate page
    if (isLoginPage) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.authenticated) {
            if (data.admin?.role === "MODERATOR") {
              router.replace("/admin/blogs");
            } else {
              router.replace("/admin");
            }
          }
        })
        .catch(() => {});
      return;
    }

    // For protected admin routes, verify authentication & role access
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAdmin(data.admin);

            // Role-based protection:
            // Moderator should only access blog creation and blog management
            if (data.admin.role === "MODERATOR") {
              const isBlogRoute = normalizedPath.startsWith("/admin/blogs");
              if (!isBlogRoute) {
                router.replace("/admin/blogs");
              }
            }
          } else {
            router.replace("/admin/login");
          }
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [normalizedPath, isLoginPage, isVerifyEmailPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setAdmin(null);
      router.push("/admin/login");
    }
  };

  // If on login or public admin page, render children cleanly and immediately without admin shell
  if (isPublicAdminPage) {
    return <>{children}</>;
  }

  // Show loading spinner while verifying session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm font-medium text-slate-500">Authenticating admin session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, wait for redirect
  if (!admin) {
    return null;
  }

  // Force first-time password change if required before granting dashboard access
  if (admin.mustChangePassword) {
    return (
      <ForceChangePasswordScreen
        adminName={admin.name}
        adminEmail={admin.email}
        adminRole={admin.role}
        onSuccess={() => {
          setAdmin((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
          if (admin.role === "MODERATOR") {
            router.replace("/admin/blogs");
          } else {
            router.replace("/admin");
          }
          router.refresh();
        }}
        onLogout={handleLogout}
      />
    );
  }

  const allNavLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart3,
      exact: false,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Enquiries & Leads",
      href: "/admin/enquiries",
      icon: Inbox,
      exact: false,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Blog Management",
      href: "/admin/blogs",
      icon: FileText,
      exact: false,
      roles: ["SUPER_ADMIN", "MODERATOR"],
    },
    {
      name: "Team & Moderators",
      href: "/admin/users",
      icon: Users,
      exact: false,
      roles: ["SUPER_ADMIN"],
    },
  ];

  // Only show links authorized for the current user's role
  const navLinks = allNavLinks.filter((item) =>
    item.roles.includes(admin.role)
  );

  const isActive = (href: string, exact: boolean) => {
    const normHref = href.replace(/\/+$/, "") || "/";
    return exact ? normalizedPath === normHref : normalizedPath.startsWith(normHref);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white lg:flex">
        <div>
          {/* Brand Logo & Tag */}
          <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-xs border border-slate-200/80 p-0.5">
              <Image
                src="/logo/logo.svg"
                alt="Sharper Labs Logo"
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-tight text-navy-900">
                Sharper Labs
              </p>
              <span className="inline-block text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                Admin Console
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <Link
              href="/admin/blogs/new"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> New Blog Article
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-3">
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-navy-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-orange-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                {admin.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{admin.name}</p>
                <p className="truncate text-[10px] text-slate-500 font-medium">
                  {admin.role === "SUPER_ADMIN" ? "Super Admin" : admin.role === "MODERATOR" ? "Moderator" : admin.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600 transition-colors shadow-2xs"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-orange-600 transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> View Live Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-xs border border-slate-200/80 p-0.5">
              <Image
                src="/logo/logo.svg"
                alt="Sharper Labs Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-display text-sm font-bold text-navy-900">Admin Console</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {navLinks.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                  active ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-orange-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 border-t border-slate-100 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-medium text-slate-400">Sharper Labs Marketing</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-xs font-semibold text-navy-900 capitalize">
                {normalizedPath.split("/")[2] || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-800">{admin.name}</p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white shadow-2xs">
              {admin.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Unverified Email Warning Banner */}
        {admin.isEmailVerified === false && !bannerDismissed && (
          <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-2.5 sm:px-8 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-3 transition-colors">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="font-semibold text-amber-950">Email Unverified:</span>{" "}
                <span>
                  Your email address ({admin.email}) has not been verified yet. Verify it to ensure you receive review alerts and editorial updates.
                </span>
                {selfResendMsg && (
                  <span
                    className={`ml-2 font-medium ${
                      selfResendMsg.type === "success" ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {selfResendMsg.text}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResendSelfVerification}
                disabled={resendingSelf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100/50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {resendingSelf ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-3 w-3 text-amber-700" />
                    Resend Verification Email
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                title="Dismiss banner"
                className="rounded-lg p-1 text-amber-700 hover:bg-amber-100/70 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
