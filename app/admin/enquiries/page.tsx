"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building,
  Globe,
  Calendar,
  X,
  FileText,
  Trash2,
  Send,
  Loader2,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  admin: { name: string };
}

interface Enquiry {
  id: string;
  type: "CONTACT" | "CONSULTATION" | "QUOTATION" | "AUDIT";
  status: string;
  name: string;
  email: string;
  phone: string | null;
  countryIso: string | null;
  company: string | null;
  website: string | null;
  service: string | null;
  selectedServices: string[] | null;
  budgetRange: string | null;
  preferredTimezone: string | null;
  preferredDate: string | null;
  subject: string | null;
  message: string | null;
  auditPriority: string | null;
  sourceUrl: string | null;
  createdAt: string;
  notes: Note[];
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const matchType = selectedType === "ALL" || item.type === selectedType;
      const matchStatus = selectedStatus === "ALL" || item.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.service && item.service.toLowerCase().includes(q));

      return matchType && matchStatus && matchSearch;
    });
  }, [enquiries, selectedType, selectedStatus, searchQuery]);

  // Handle status update
  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
        if (activeEnquiry && activeEnquiry.id === enquiryId) {
          setActiveEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add team note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry || !noteContent.trim()) return;

    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${activeEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteContent }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveEnquiry(data.enquiry);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === activeEnquiry.id ? data.enquiry : e))
        );
        setNoteContent("");
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
        if (activeEnquiry?.id === enquiryId) {
          setActiveEnquiry(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const typePills = [
    { label: "All Requests", value: "ALL", count: enquiries.length },
    {
      label: "Quotations",
      value: "QUOTATION",
      count: enquiries.filter((e) => e.type === "QUOTATION").length,
    },
    {
      label: "Consultations",
      value: "CONSULTATION",
      count: enquiries.filter((e) => e.type === "CONSULTATION").length,
    },
    {
      label: "Contact Forms",
      value: "CONTACT",
      count: enquiries.filter((e) => e.type === "CONTACT").length,
    },
    {
      label: "Audits",
      value: "AUDIT",
      count: enquiries.filter((e) => e.type === "AUDIT").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">
            Inbound Enquiries & Quotations
          </h1>
          <p className="text-xs text-slate-500">
            View customer requests, schedule consultations, and track deal stages.
          </p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <Clock className="h-3.5 w-3.5 text-slate-400" /> Refresh Data
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {typePills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => setSelectedType(pill.value)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedType === pill.value
                ? "bg-navy-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{pill.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedType === pill.value
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {pill.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Status Dropdown */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company, service..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-navy-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Unread)</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="CONTACTED">Contacted</option>
            <option value="PROPOSAL_SENT">Proposal Sent</option>
            <option value="WON">Won (Converted)</option>
            <option value="CLOSED">Closed</option>
            <option value="SPAM">Spam</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Service & Scope</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                    <p className="mt-2">Loading submissions...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setActiveEnquiry(enq)}
                    className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${
                          enq.type === "QUOTATION"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : enq.type === "CONSULTATION"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : enq.type === "AUDIT"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {enq.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-navy-900">{enq.name}</p>
                      <p className="text-[11px] text-slate-400">{enq.company || "—"}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700">{enq.email}</p>
                      <p className="text-[11px] text-slate-400">{enq.phone || "—"}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <p className="font-medium text-slate-800">
                        {enq.service || (enq.selectedServices?.join(", ") ?? "General")}
                      </p>
                      {enq.budgetRange && (
                        <p className="text-[11px] text-orange-600 font-semibold">{enq.budgetRange}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          enq.status === "NEW"
                            ? "bg-orange-100 text-orange-800"
                            : enq.status === "WON"
                            ? "bg-emerald-100 text-emerald-800"
                            : enq.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEnquiry(enq);
                        }}
                        className="rounded-lg bg-navy-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-orange-600 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Inspection Drawer / Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-xs">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                  {activeEnquiry.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: #{activeEnquiry.id.slice(-6)}
                </span>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Client Profile */}
            <div className="mt-6 space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900">
                  {activeEnquiry.name}
                </h2>
                <p className="text-xs text-slate-500">{activeEnquiry.company || "Independent Client"}</p>
              </div>

              {/* Status Selector Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Update Lead Status
                </label>
                <select
                  value={activeEnquiry.status}
                  onChange={(e) => handleStatusChange(activeEnquiry.id, e.target.value)}
                  disabled={updatingStatus}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-navy-900 focus:outline-hidden"
                >
                  <option value="NEW">NEW (Unread / Needs follow-up)</option>
                  <option value="IN_REVIEW">IN_REVIEW (Consultant reviewing)</option>
                  <option value="CONTACTED">CONTACTED (Follow-up email/call made)</option>
                  <option value="PROPOSAL_SENT">PROPOSAL_SENT (Quotation or audit delivered)</option>
                  <option value="WON">WON (Converted Client)</option>
                  <option value="CLOSED">CLOSED (Archived / Inactive)</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>

              {/* Contact Information Cards */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Email</span>
                  <a
                    href={`mailto:${activeEnquiry.email}`}
                    className="mt-1 block font-bold text-navy-900 hover:text-orange-600 truncate"
                  >
                    {activeEnquiry.email}
                  </a>
                </div>

                <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Phone</span>
                  <p className="mt-1 font-bold text-navy-900">
                    {activeEnquiry.phone || "Not provided"}
                  </p>
                </div>

                {activeEnquiry.website && (
                  <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50 sm:col-span-2">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Website</span>
                    <a
                      href={activeEnquiry.website.startsWith("http") ? activeEnquiry.website : `https://${activeEnquiry.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 font-bold text-orange-600 hover:underline"
                    >
                      {activeEnquiry.website} <Globe className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Consultation / Quotation Details */}
              {(activeEnquiry.preferredTimezone || activeEnquiry.preferredDate || activeEnquiry.budgetRange || activeEnquiry.selectedServices) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
                  <span className="font-bold text-navy-900 uppercase tracking-wider text-[10px] text-orange-600 block mb-2">
                    Scope & Scheduling Details
                  </span>

                  {activeEnquiry.budgetRange && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Budget Range:</span>
                      <span className="font-bold text-navy-900">{activeEnquiry.budgetRange}</span>
                    </div>
                  )}

                  {activeEnquiry.preferredTimezone && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Timezone:</span>
                      <span className="font-bold text-navy-900">{activeEnquiry.preferredTimezone}</span>
                    </div>
                  )}

                  {activeEnquiry.preferredDate && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Preferred Date:</span>
                      <span className="font-bold text-navy-900">
                        {new Date(activeEnquiry.preferredDate).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  )}

                  {activeEnquiry.selectedServices && (
                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1">Selected Services:</span>
                      <div className="flex flex-wrap gap-1">
                        {activeEnquiry.selectedServices.map((s, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              {activeEnquiry.message && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="font-bold text-navy-900 uppercase tracking-wider text-[10px] text-slate-400 block mb-1.5">
                    Client Message
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {activeEnquiry.message}
                  </p>
                </div>
              )}

              {/* Internal Team Notes */}
              <div className="border-t border-slate-200 pt-6">
                <span className="font-display text-sm font-bold text-navy-900 block mb-3">
                  Internal Team Notes & Timeline
                </span>

                <form onSubmit={handleAddNote} className="mb-4">
                  <textarea
                    rows={2}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add an internal note or next action step..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingNote || !noteContent.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                    >
                      {savingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Add Note
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-2">
                  {activeEnquiry.notes?.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-3">No internal notes added yet.</p>
                  ) : (
                    activeEnquiry.notes?.map((n) => (
                      <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-navy-900">{n.admin?.name || "Admin"}</span>
                          <span>{new Date(n.createdAt).toLocaleString("en-GB")}</span>
                        </div>
                        <p className="text-slate-700">{n.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                  onClick={() => handleDeleteEnquiry(activeEnquiry.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Enquiry
                </button>
                <button
                  onClick={() => setActiveEnquiry(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close Drawer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
