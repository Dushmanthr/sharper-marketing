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
  Sparkles,
  PlusCircle,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
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

  useEffect(() => {
    // If on login page, check if already logged in; if so redirect to dashboard
    if (isLoginPage) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.authenticated) {
            router.replace("/admin");
          }
        })
        .catch(() => {});
      return;
    }

    // For protected admin routes, verify authentication
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAdmin(data.admin);
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
  }, [normalizedPath, isLoginPage, router]);

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

  // If on login page, render children cleanly and immediately without admin shell
  if (isLoginPage) {
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

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart3,
      exact: false,
    },
    {
      name: "Enquiries & Leads",
      href: "/admin/enquiries",
      icon: Inbox,
      exact: false,
    },
    {
      name: "Blog Management",
      href: "/admin/blogs",
      icon: FileText,
      exact: false,
    },
  ];

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 text-orange-400 font-bold shadow-xs">
              SL
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
                <p className="truncate text-[10px] text-slate-500">{admin.role}</p>
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
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-orange-400 font-bold">
              SL
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

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
