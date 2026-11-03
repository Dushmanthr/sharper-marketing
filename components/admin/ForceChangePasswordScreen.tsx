"use client";

import { useState, useMemo } from "react";
import {
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  LogOut,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ForceChangePasswordScreenProps {
  adminName: string;
  adminEmail: string;
  adminRole: string;
  onSuccess: () => void;
  onLogout: () => void;
}

export default function ForceChangePasswordScreen({
  adminName,
  adminEmail,
  adminRole,
  onSuccess,
  onLogout,
}: ForceChangePasswordScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Policy requirement checks
  const checks = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      symbol: /[^A-Za-z0-9]/.test(newPassword),
      matches: confirmPassword.length > 0 && newPassword === confirmPassword,
    };
  }, [newPassword, confirmPassword]);

  // Overall strength score (0 to 5)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.symbol) score++;
    return score;
  }, [checks]);

  const strengthLabel = useMemo(() => {
    if (strengthScore <= 2) return { text: "Weak", color: "bg-red-500", textCol: "text-red-400" };
    if (strengthScore === 3) return { text: "Fair", color: "bg-amber-500", textCol: "text-amber-400" };
    if (strengthScore === 4) return { text: "Good", color: "bg-blue-500", textCol: "text-blue-400" };
    return { text: "Strong", color: "bg-emerald-500", textCol: "text-emerald-400" };
  }, [strengthScore]);

  const allPassed =
    checks.length &&
    checks.uppercase &&
    checks.lowercase &&
    checks.number &&
    checks.symbol &&
    checks.matches;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allPassed) {
      setError("Please ensure your new password satisfies all security requirements.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 px-4 py-12 text-white">
      <div className="w-full max-w-lg">
        {/* Top Header Card */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-xl shadow-orange-500/10">
            <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            First-Time Login Setup
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider font-semibold text-orange-400">
            Mandatory Security Verification
          </p>
        </div>

        {/* Main Form Box */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">
                  Welcome, {adminName || "Team Member"}!
                </p>
                <p className="mt-0.5 leading-relaxed text-amber-200/90">
                  You are logging in with a temporary password. Under our security compliance policy, you must set a secure permanent password before accessing the {adminRole === "SUPER_ADMIN" ? "Super Admin Console" : "Editorial Management Console"}.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Password updated successfully! Redirecting to your console...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-navy-200">
                New Permanent Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-navy-300 focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Strength Meter */}
            {newPassword.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-navy-300">Password Strength:</span>
                  <span className={`font-semibold ${strengthLabel.textCol}`}>
                    {strengthLabel.text}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-full rounded-full transition-all duration-300 ${
                        lvl <= strengthScore ? strengthLabel.color : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-navy-200">
                Confirm New Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-navy-300 focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300 hover:text-white"
                  aria-label="Toggle confirm visibility"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Real-time Security Checklist */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-2">
              <span className="font-semibold text-navy-200 block mb-1">
                Security Policy Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${checks.length ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.length ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${checks.uppercase ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.uppercase ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>1 uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${checks.lowercase ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.lowercase ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>1 lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${checks.number ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.number ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>1 number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${checks.symbol ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.symbol ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>1 special symbol (!@#$)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${checks.matches ? "text-emerald-400" : "text-navy-300"}`}>
                  {checks.matches ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allPassed || success}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Encrypting & Saving Password...
                </>
              ) : success ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Password Updated!
                </>
              ) : (
                <>
                  Set Permanent Password & Enter
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Out Option */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs text-navy-300 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out of this session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

