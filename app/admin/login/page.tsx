"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      // Login successful, redirect to admin dashboard
      router.push("/admin");
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900">
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
            Administrative Management Console
          </p>
        </div>

        {/* Login Form Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-navy-900">Sign in to your account</h2>
            <p className="mt-1 text-xs text-slate-500">
              Access the live enquiries pipeline and publish strategic content.
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
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sharper-labs.com"
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
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-orange-600 transition-colors disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-orange-400" /> Verifying...
                </>
              ) : (
                <>
                  Authenticate Admin <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint for Local Setup */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-center">
            <span className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Seed Account Available
            </span>
            <p className="mt-1 text-[11px] text-slate-500">
              Default: <code className="font-mono text-navy-900 font-medium">admin@sharper-labs.com</code>
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
    </div>
  );
}
