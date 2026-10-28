"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  FileText,
  PlusCircle,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  Tag,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  readTime: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  author: {
    name: string;
    email: string;
    role?: "SUPER_ADMIN" | "MODERATOR" | string;
  };
}

interface StatusCounts {
  total: number;
  published: number;
  pending: number;
  draft: number;
  archived: number;
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0,
    archived: 0,
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Confirm delete modal state
  const [deletePostTarget, setDeletePostTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Quick approve modal state
  const [approvePostTarget, setApprovePostTarget] = useState<{ id: string; title: string } | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    fetchPosts();

    // Check user role for action permissions
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.admin?.role) {
          setUserRole(data.admin.role);
        }
      })
      .catch(() => {});
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        const loadedPosts: BlogPost[] = data.posts || [];
        setPosts(loadedPosts);

        if (data.counts) {
          setCounts(data.counts);
        } else {
          // Fallback calculation
          setCounts({
            total: loadedPosts.length,
            published: loadedPosts.filter((p) => p.status === "PUBLISHED").length,
            pending: loadedPosts.filter((p) => p.status === "PENDING_APPROVAL").length,
            draft: loadedPosts.filter((p) => p.status === "DRAFT").length,
            archived: loadedPosts.filter((p) => p.status === "ARCHIVED").length,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  }

  const executeDeletePost = async () => {
    if (!deletePostTarget) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/blogs/${deletePostTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== deletePostTarget.id));
        setDeletePostTarget(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const executeApprovePost = async () => {
    if (!approvePostTarget) return;
    setApproveLoading(true);

    try {
      const res = await fetch(`/api/admin/blogs/${approvePostTarget.id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === approvePostTarget.id
              ? { ...p, status: "PUBLISHED", publishedAt: new Date().toISOString() }
              : p
          )
        );
        setApprovePostTarget(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to approve post:", err);
    } finally {
      setApproveLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ["ALL", ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchStatus = selectedStatus === "ALL" || post.status === selectedStatus;
      const matchCategory = selectedCategory === "ALL" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);

      return matchStatus && matchCategory && matchSearch;
    });
  }, [posts, selectedStatus, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            SEO & Content Engine
          </span>
          <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Blog Articles & Strategic Guides
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Author, review, and publish strategic marketing articles to drive organic search growth.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors self-start"
        >
          <PlusCircle className="h-4 w-4" /> Create New Article
        </Link>
      </div>

      {/* Super Admin Review Alert Banner */}
      {userRole === "SUPER_ADMIN" && counts.pending > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-amber-300 bg-amber-50/90 p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-800 shadow-2xs">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                {counts.pending} {counts.pending === 1 ? "Article" : "Articles"} Waiting for Approval
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">
                Moderators have submitted new articles that require your review and approval before publishing live.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedStatus("PENDING_APPROVAL")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors self-start sm:self-auto cursor-pointer shadow-xs shrink-0"
          >
            Review Pending Articles &rarr;
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            selectedStatus === "ALL"
              ? "bg-navy-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Articles
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              selectedStatus === "ALL" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {counts.total}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("PENDING_APPROVAL")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            selectedStatus === "PENDING_APPROVAL"
              ? "bg-amber-600 text-white shadow-xs"
              : counts.pending > 0
              ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Pending Approval
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              selectedStatus === "PENDING_APPROVAL"
                ? "bg-white/20 text-white"
                : counts.pending > 0
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("PUBLISHED")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            selectedStatus === "PUBLISHED"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Published
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              selectedStatus === "PUBLISHED" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {counts.published}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("DRAFT")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            selectedStatus === "DRAFT"
              ? "bg-slate-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Drafts
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              selectedStatus === "DRAFT" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {counts.draft}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("ARCHIVED")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            selectedStatus === "ARCHIVED"
              ? "bg-slate-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Archived
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
              selectedStatus === "ARCHIVED" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {counts.archived}
          </span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, or excerpt..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-navy-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Read Time</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
                    <p className="mt-2">Loading articles...</p>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No articles match your criteria in this view.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-navy-950 shrink-0 border border-slate-200">
                          <Image
                            src={post.coverImage || "/images/marketing-landing-1.jpeg"}
                            alt={post.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            {post.featured && (
                              <span className="rounded-md bg-orange-100 px-1.5 py-0.2 text-[9px] font-bold text-orange-700 uppercase">
                                Featured
                              </span>
                            )}
                            <h3 className="font-bold text-navy-900 truncate">{post.title}</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Published
                        </span>
                      ) : post.status === "PENDING_APPROVAL" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                          <Clock className="h-3 w-3 text-amber-600" />
                          Pending Approval
                        </span>
                      ) : post.status === "DRAFT" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{post.author?.name || "Admin"}</span>
                        {post.author?.role === "MODERATOR" && (
                          <span className="inline-flex items-center w-fit rounded-sm bg-purple-50 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 uppercase tracking-wider">
                            Moderator
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {post.readTime}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : post.status === "PENDING_APPROVAL"
                        ? "Pending"
                        : "Draft"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick 1-click Approve for Super Admin on Pending posts */}
                        {userRole === "SUPER_ADMIN" && post.status === "PENDING_APPROVAL" && (
                          <button
                            onClick={() => setApprovePostTarget({ id: post.id, title: post.title })}
                            title="Approve & Publish to Live Site"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Approve
                          </button>
                        )}

                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="View on Public Site"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/blogs/${post.id}`}
                          title="Edit Article"
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-navy-900 hover:text-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        {userRole === "SUPER_ADMIN" && (
                          <button
                            onClick={() => setDeletePostTarget({ id: post.id, title: post.title })}
                            title="Delete Article"
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Approve Blog Modal */}
      <ConfirmModal
        isOpen={Boolean(approvePostTarget)}
        title="Approve & Publish Article"
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to approve the article{" "}
              <strong className="text-navy-900">&ldquo;{approvePostTarget?.title}&rdquo;</strong>?
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              Upon approval, this article will immediately be published and made publicly visible on the main website blog index.
            </p>
          </div>
        }
        confirmText="Approve & Publish Live"
        variant="success"
        loading={approveLoading}
        onConfirm={executeApprovePost}
        onClose={() => setApprovePostTarget(null)}
      />

      {/* Confirm Delete Blog Modal */}
      <ConfirmModal
        isOpen={Boolean(deletePostTarget)}
        title="Delete Article"
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to permanently delete the article{" "}
              <strong className="text-navy-900">&ldquo;{deletePostTarget?.title}&rdquo;</strong>?
            </p>
            <p className="text-[11px] text-red-600 font-semibold">
              This article will be immediately removed from the live website and search index. This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Yes, Delete Article"
        variant="danger"
        loading={deleteLoading}
        onConfirm={executeDeletePost}
        onClose={() => setDeletePostTarget(null)}
      />
    </div>
  );
}
