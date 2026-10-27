"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, AlertCircle, Info, Loader2, X, CheckCircle2 } from "lucide-react";

export type ConfirmVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on Escape key press
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

  const iconConfig = {
    danger: {
      bg: "bg-red-50 border-red-100 text-red-600",
      icon: <Trash2 className="h-5 w-5" />,
      buttonBg: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    },
    warning: {
      bg: "bg-amber-50 border-amber-100 text-amber-600",
      icon: <AlertTriangle className="h-5 w-5" />,
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20",
    },
    info: {
      bg: "bg-blue-50 border-blue-100 text-blue-600",
      icon: <Info className="h-5 w-5" />,
      buttonBg: "bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20",
    },
    success: {
      bg: "bg-emerald-50 border-emerald-100 text-emerald-600",
      icon: <CheckCircle2 className="h-5 w-5" />,
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
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

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${iconConfig.bg} shadow-xs`}
          >
            {iconConfig.icon}
          </div>

          <div className="min-w-0 pr-4">
            <h3 className="font-display text-base font-bold text-navy-900">
              {title}
            </h3>
            <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all disabled:opacity-60 cursor-pointer ${iconConfig.buttonBg}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
