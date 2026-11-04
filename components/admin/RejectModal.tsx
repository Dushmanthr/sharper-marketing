"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, Loader2, XCircle, Send } from "lucide-react";

export interface RejectModalProps {
  isOpen: boolean;
  postTitle?: string;
  authorName?: string;
  loading?: boolean;
  errorMessage?: string;
  onConfirm: (reason: string) => void | Promise<void>;
  onClose: () => void;
}

const PRESET_FEEDBACK = [
  "Please improve the SEO meta description and keyword density.",
  "Needs additional real-world case studies or practical examples.",
  "Check and fix formatting, headings, and readability.",
  "Revise tone to match brand guidelines and SME audience.",
];

export default function RejectModal({
  isOpen,
  postTitle,
  authorName,
  loading = false,
  errorMessage,
  onConfirm,
  onClose,
}: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setValidationError("");
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setValidationError("Please enter a reason or specific instructions for revision.");
      return;
    }
    setValidationError("");
    onConfirm(trimmed);
  };

  const handleApplyPreset = (preset: string) => {
    setReason((prev) => {
      if (!prev.trim()) return preset;
      return `${prev.trim()}\n• ${preset}`;
    });
    setValidationError("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 shadow-xs">
            <XCircle className="h-5 w-5" />
          </div>

          <div className="min-w-0 pr-4">
            <h3 className="font-display text-base font-bold text-navy-900">
              Reject Article & Request Revisions
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Send this article back to the author with revision notes. The status will revert to draft until updated and resubmitted.
            </p>
          </div>
        </div>

        {/* Article Summary Box */}
        {postTitle && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Article to Revise
            </div>
            <div className="font-bold text-navy-900 mt-0.5 truncate">
              {postTitle}
            </div>
            {authorName && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                Submitted by: <span className="font-medium text-slate-700">{authorName}</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="rejection-reason"
                className="text-xs font-semibold text-navy-900"
              >
                Revision Feedback & Reason *
              </label>
              <span className="text-[10px] text-slate-400">
                Visible to article author
              </span>
            </div>

            <textarea
              id="rejection-reason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError("");
              }}
              placeholder="Explain clearly what changes or additions are needed before this article can be approved (e.g. SEO keywords, missing data sources, clearer subheadings)..."
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 disabled:opacity-60 resize-none"
            />

            {(validationError || errorMessage) && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{validationError || errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick preset suggestions */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_FEEDBACK.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={loading}
                  onClick={() => handleApplyPreset(preset)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer text-left"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Reject with Reason
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

