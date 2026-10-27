"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Shield,
  FileText,
  KeyRound,
} from "lucide-react";

type PortalRole = "SUPER_ADMIN" | "MODERATOR";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Support URL query param ?role=moderator or ?role=super_admin
  const roleParam = searchParams.get("role");
  const initialRole: PortalRole =
    roleParam?.toLowerCase() === "moderator" ? "MODERATOR" : "SUPER_ADMIN";

  const [portal, setPortal] = useState<PortalRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form defaults when switching tabs
  useEffect(() => {
    setError("");
  }, [portal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          portalRole: portal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      // Smart redirection based on authenticated role
      if (data.admin?.role === "MODERATOR") {
        router.push("/admin/blogs");
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to prefill demo credentials
  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Card Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-orange-400 font-bold text-xl shadow-xl">
          SL
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Sharper Labs Marketing
        </h1>
        <p className="mt-1 text-xs uppercase tracking-wider font-semibold text-orange-400">
          Management & Editorial Console
        </p>
      </div>

      {/* Role Portal Switcher */}
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-navy-950/60 p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setPortal("SUPER_ADMIN")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
            portal === "SUPER_ADMIN"
              ? "bg-white text-navy-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Shield className={`h-4 w-4 ${portal === "SUPER_ADMIN" ? "text-orange-500" : ""}`} />
          <span>Super Admin</span>
        </button>

        <button
          type="button"
          onClick={() => setPortal("MODERATOR")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
            portal === "MODERATOR"
              ? "bg-white text-navy-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className={`h-4 w-4 ${portal === "MODERATOR" ? "text-emerald-600" : ""}`} />
          <span>Moderator</span>
        </button>
      </div>

      {/* Login Form Card */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-navy-900">
              {portal === "SUPER_ADMIN" ? "Super Admin Portal" : "Moderator Portal"}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                portal === "SUPER_ADMIN"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {portal === "SUPER_ADMIN" ? "Full Access" : "Editorial Access"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {portal === "SUPER_ADMIN"
              ? "Manage executive metrics, client leads, and moderator permissions."
              : "Author, update, and manage published strategic blog articles."}
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  portal === "SUPER_ADMIN"
                    ? "admin@sharper-labs.com"
                    : "moderator@sharper-labs.com"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-navy-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-navy-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors disabled:opacity-70 cursor-pointer ${
              portal === "SUPER_ADMIN"
                ? "bg-navy-900 hover:bg-orange-600"
                : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-orange-400" /> Authenticating...
              </>
            ) : (
              <>
                Sign in as {portal === "SUPER_ADMIN" ? "Super Admin" : "Moderator"} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Credential Helper Banner */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Seed Account
            </span>
            <button
              type="button"
              onClick={() =>
                portal === "SUPER_ADMIN"
                  ? fillCredentials("admin@sharper-labs.com", "AdminSharper2026!")
                  : fillCredentials("moderator@sharper-labs.com", "ModeratorSharper2026!")
              }
              className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <p className="mt-1 font-mono text-[11px] text-slate-700">
            {portal === "SUPER_ADMIN" ? "admin@sharper-labs.com" : "moderator@sharper-labs.com"}
          </p>
        </div>
      </div>

      {/* Back to Live Site link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-white text-xs">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
            Loading portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
