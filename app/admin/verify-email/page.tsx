"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMsg("No verification token was provided in the link.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
          if (data.user?.email) setUserEmail(data.user.email);
        } else {
          setErrorMsg(data.error || "Verification failed. The link may be expired or invalid.");
        }
      } catch {
        setErrorMsg("Network error verifying email. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
          <Image
            src="/logo/logo.svg"
            alt="Sharper Labs Marketing"
            width={200}
            height={62}
            priority
            className="mx-auto h-12 sm:h-14 w-auto object-contain drop-shadow-md"
          />
        </Link>
        <p className="mt-3 text-xs uppercase tracking-wider font-semibold text-orange-400">
          Account Verification
        </p>
      </div>

      {/* Main Status Card */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-6 sm:p-8 shadow-2xl text-center">
        {loading ? (
          <div className="py-8 space-y-4">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-500" />
            <h2 className="font-display text-lg font-bold text-navy-900">Verifying Email Address</h2>
            <p className="text-xs text-slate-500">
              Please wait while we validate your verification token with security services...
            </p>
          </div>
        ) : success ? (
          <div className="py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">Email Verified!</h2>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                {userEmail ? (
                  <>
                    <strong className="text-slate-700 font-mono">{userEmail}</strong> has been confirmed.
                  </>
                ) : (
                  "Your email address has been confirmed."
                )}
                <br />
                Editorial reviews, approval alerts, and notifications are now active.
              </p>
            </div>

            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 hover:bg-orange-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors"
              >
                <span>Continue to Admin Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
              <XCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">Verification Link Issue</h2>
              <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 leading-relaxed">
                {errorMsg}
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                If the link expired, please ask your Super Admin to resend a verification link from the Team Logins panel.
              </p>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/admin/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 hover:bg-orange-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors"
              >
                <span>Proceed to Admin Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Back to Live Site link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          &larr; Return to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-white text-xs">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
            Loading verification...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

