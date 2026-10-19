"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Building,
  Mail,
  BarChart3,
} from "lucide-react";

interface EnquiryItem {
  id: string;
  type: "CONTACT" | "CONSULTATION" | "QUOTATION" | "AUDIT";
  status: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  createdAt: string;
}

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  viewCount: number;
  publishedAt: string | null;
}

export default function AdminDashboardPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [enqRes, blogRes] = await Promise.all([
          fetch("/api/admin/enquiries"),
          fetch("/api/admin/blogs"),
        ]);

        if (enqRes.ok) {
          const enqData = await enqRes.json();
          setEnquiries(enqData.enquiries || []);
          
          // Map counts by type
          const countMap: { [key: string]: number } = {};
          (enqData.counts || []).forEach((c: { type: string; _count: { id: number } }) => {
            countMap[c.type] = c._count.id;
          });
          setCounts(countMap);
        }

        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogs(blogData.posts || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "NEW").length;
  const quotationCount = counts["QUOTATION"] || 0;
  const consultationCount = counts["CONSULTATION"] || 0;
  const publishedBlogsCount = blogs.filter((b) => b.status === "PUBLISHED").length;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "QUOTATION":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CONSULTATION":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "AUDIT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-orange-100 text-orange-800 font-bold";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800";
      case "WON":
        return "bg-emerald-100 text-emerald-800 font-bold";
      case "PROPOSAL_SENT":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Overview & Operations
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Marketing Management Console
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor international inbound requests, review consultation schedules, and manage published articles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-navy-900 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-orange-500" /> Business Analytics
          </Link>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Create Article
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-navy-800 transition-colors"
          >
            <Inbox className="h-4 w-4" /> View All Leads
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Inquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Enquiries
            </span>
            <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <Inbox className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-navy-900">
            {loading ? "..." : totalEnquiries}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{newEnquiriesCount} new leads awaiting review</span>
          </div>
        </div>

        {/* Quotations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quotations
            </span>
            <span className="rounded-xl bg-purple-50 p-2 text-purple-700">
              <FileText className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-navy-900">
            {loading ? "..." : quotationCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">Bespoke scope & budget proposals</p>
        </div>

        {/* Consultations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Consultations
            </span>
            <span className="rounded-xl bg-blue-50 p-2 text-blue-700">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-navy-900">
            {loading ? "..." : consultationCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">Multi-timezone discovery sessions</p>
        </div>

        {/* Blog Posts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Blogs
            </span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-navy-900">
            {loading ? "..." : publishedBlogsCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">Live SEO & AEO strategic articles</p>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries & Blogs */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Enquiries (8 columns) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">
                Recent Inbound Enquiries
              </h2>
              <p className="text-xs text-slate-500">Latest submissions across website forms</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-navy-900 transition-colors"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-xs text-slate-400">Loading recent enquiries...</p>
            ) : enquiries.length === 0 ? (
              <div className="py-12 text-center">
                <Inbox className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-xs font-medium text-slate-500">No enquiries submitted yet.</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Submissions from your contact page and consultation modal will appear here.
                </p>
              </div>
            ) : (
              enquiries.slice(0, 5).map((enq) => (
                <div
                  key={enq.id}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeBadge(
                        enq.type
                      )}`}
                    >
                      {enq.type}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-navy-900">{enq.name}</p>
                      <p className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{enq.company || "Independent"}</span>
                        <span>•</span>
                        <span>{enq.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                        enq.status
                      )}`}
                    >
                      {enq.status}
                    </span>
                    <Link
                      href="/admin/enquiries"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-navy-900"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Highlights (4 columns) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">Live Articles</h2>
              <p className="text-xs text-slate-500">Strategic blog library</p>
            </div>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-navy-900"
            >
              All Posts <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {blogs.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 hover:border-orange-200 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-orange-600">{post.category}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                    {post.status}
                  </span>
                </div>
                <h3 className="font-display text-xs font-bold text-navy-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Slug: /{post.slug}</span>
                  <Link
                    href={`/admin/blogs/${post.id}`}
                    className="font-semibold text-navy-900 hover:text-orange-600"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/admin/blogs/new"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Add New Strategic Article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
