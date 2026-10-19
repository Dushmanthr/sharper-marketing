"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogEditor, { BlogFormData } from "@/components/admin/BlogEditor";
import { Loader2 } from "lucide-react";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load article.");
        }
        const data = await res.json();
        const raw = data.post;
        
        // Format raw DB record into BlogFormData
        const formatted: BlogFormData = {
          id: raw.id,
          title: raw.title,
          slug: raw.slug,
          excerpt: raw.excerpt || "",
          category: raw.category || "Data & ROI",
          coverImage: raw.coverImage || "/images/hero-data-analytics.jpg",
          readTime: raw.readTime || "5 min read",
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          metaDescription: raw.metaDescription || "",
          status: raw.status || "DRAFT",
          featured: Boolean(raw.featured),
          content: Array.isArray(raw.content) ? raw.content : [],
        };

        setPost(formatted);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load post.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <p className="text-xs text-slate-500">Loading article editor...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700">
        <p className="font-bold">{error || "Article not found."}</p>
        <button
          onClick={() => router.push("/admin/blogs")}
          className="mt-3 rounded-xl bg-navy-900 px-4 py-2 font-bold text-white"
        >
          Return to Blog List
        </button>
      </div>
    );
  }

  return <BlogEditor initialData={post} isEditing={true} />;
}
