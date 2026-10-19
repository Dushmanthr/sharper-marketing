"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown,
  UploadCloud,
  X,
  Image as ImageIcon,
} from "lucide-react";

export interface BlogSectionItem {
  id: string;
  heading: string;
  paragraphs: string[];
  keyTakeaways?: string[];
  quote?: {
    text: string;
    author?: string;
  };
}

export interface BlogFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readTime: string;
  tags: string[];
  metaDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  content: BlogSectionItem[];
}

interface BlogEditorProps {
  initialData?: BlogFormData;
  isEditing?: boolean;
}

const CATEGORIES = [
  "Data & ROI",
  "SME Growth",
  "Web & Conversion",
  "International Strategy",
  "Consultancy",
  "Brand Strategy",
];

const PRESET_IMAGES = [
  "/images/hero-data-analytics.jpg",
  "/images/hero-marketing-team.jpg",
  "/images/brand-marketing-03.png",
  "/images/hero-brand-design.jpg",
  "/images/marketing-landing-1.jpeg",
  "/images/brand-marketing-01.png",
  "/images/brand-marketing-04.png",
  "/images/brand-marketing-05.png",
  "/images/brand-marketing-06.png",
];

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleImageFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size exceeds the 10MB limit.");
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: "",
      slug: "",
      excerpt: "",
      category: CATEGORIES[0],
      coverImage: PRESET_IMAGES[0],
      readTime: "6 min read",
      tags: ["Digital marketing agency UK", "Business growth"],
      metaDescription: "",
      status: "DRAFT",
      featured: false,
      content: [
        {
          id: "section-1",
          heading: "Introduction & Context",
          paragraphs: [
            "In modern digital marketing, clarity and measurable commercial outcomes outperform surface vanity metrics every time.",
          ],
          keyTakeaways: ["Align marketing spend with gross margins and customer lifetime value."],
        },
      ],
    }
  );

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEditing && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Tags management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (t: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== t) }));
  };

  // Section builders
  const addSection = () => {
    const newId = `section-${formData.content.length + 1}`;
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          id: newId,
          heading: "New Strategic Section",
          paragraphs: ["Add detailed paragraphs here to explain the strategy..."],
          keyTakeaways: [],
        },
      ],
    }));
  };

  const updateSectionHeading = (idx: number, heading: string) => {
    setFormData((prev) => {
      const content = [...prev.content];
      content[idx] = { ...content[idx], heading };
      return { ...prev, content };
    });
  };

  const updateSectionParagraphs = (idx: number, text: string) => {
    const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
    setFormData((prev) => {
      const content = [...prev.content];
      content[idx] = { ...content[idx], paragraphs };
      return { ...prev, content };
    });
  };

  const updateSectionTakeaway = (idx: number, text: string) => {
    const keyTakeaways = text.split("\n").filter((t) => t.trim().length > 0);
    setFormData((prev) => {
      const content = [...prev.content];
      content[idx] = { ...content[idx], keyTakeaways };
      return { ...prev, content };
    });
  };

  const removeSection = (idx: number) => {
    if (formData.content.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== idx),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.slug) {
      setError("Title and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing
        ? `/api/admin/blogs/${formData.id}`
        : "/api/admin/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save article.");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-navy-900">
              {isEditing ? "Edit Article" : "Create New Strategic Article"}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing ? `Editing /blog/${formData.slug}` : "Draft and publish to the live knowledge base"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "edit" ? "bg-white text-navy-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "preview" ? "bg-white text-navy-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Live Preview
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {formData.status === "PUBLISHED" ? "Publish Changes" : "Save Draft"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === "edit" ? (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Fields (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            {/* Title & Slug Box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Measure Digital Marketing ROI: A Practical Framework"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-navy-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  URL Slug (canonical path) *
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                  <span className="text-slate-400 font-mono">/blog/</span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                    }
                    placeholder="how-to-measure-digital-marketing-roi"
                    className="w-full bg-transparent font-mono text-navy-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Excerpt / Lead Standfirst
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="A concise 2-sentence teaser summarizing the core commercial takeaway..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Structured Sections Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-navy-900">
                    Article Sections Builder
                  </h2>
                  <p className="text-xs text-slate-500">
                    Structure content into headings, paragraphs, and strategic key takeaways.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-slate-50"
                >
                  <Plus className="h-3.5 w-3.5 text-orange-500" /> Add Section
                </button>
              </div>

              {formData.content.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Section {idx + 1}
                    </span>
                    {formData.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => updateSectionHeading(idx, e.target.value)}
                      placeholder="e.g. Navigating Multi-Touch Attribution"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-navy-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Body Paragraphs (Separate paragraphs with an empty line)
                    </label>
                    <textarea
                      rows={5}
                      value={sec.paragraphs.join("\n\n")}
                      onChange={(e) => updateSectionParagraphs(idx, e.target.value)}
                      placeholder="Write your in-depth analysis here..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-800 font-sans focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Takeaways / Bullet Highlights (One per line)
                    </label>
                    <textarea
                      rows={2}
                      value={(sec.keyTakeaways || []).join("\n")}
                      onChange={(e) => updateSectionTakeaway(idx, e.target.value)}
                      placeholder="Takeaway bullet point 1&#10;Takeaway bullet point 2"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Publishing Controls (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Publishing Status Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-900 block border-b border-slate-100 pb-2">
                Publishing Controls
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-navy-900 focus:outline-hidden"
                >
                  <option value="DRAFT">Draft (Hidden from public site)</option>
                  <option value="PUBLISHED">Published (Visible on live /blog)</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded-md border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-navy-900">
                  Featured Spotlight Hero Post
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-navy-900 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, readTime: e.target.value }))
                  }
                  placeholder="e.g. 6 min read"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-navy-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Cover Image Uploader & Picker */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Article Cover Image
                </span>
                {formData.coverImage?.startsWith("/uploads/") ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Uploaded File
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    Preset Graphic
                  </span>
                )}
              </div>

              {/* Cover Preview */}
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-navy-950 border border-slate-200 shadow-inner group">
                <Image
                  src={formData.coverImage || PRESET_IMAGES[0]}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-navy-900 shadow-lg hover:bg-white backdrop-blur-xs transition-colors"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-orange-600" /> Replace Image
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-slate-200 bg-slate-50/60 hover:border-orange-400 hover:bg-orange-50/20"
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                      <span className="text-xs font-semibold text-slate-600">
                        Uploading image to media library...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs text-orange-500 border border-slate-100">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-900">
                          Click or drag & drop to upload image
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          PNG, JPG, WEBP, SVG or AVIF (up to 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Preset Graphic Picker Collapsible/Accordion */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                  Or select standard brand preset:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setFormData((prev) => ({ ...prev, coverImage: img }))}
                      className={`relative aspect-16/10 overflow-hidden rounded-lg border-2 transition-all ${
                        formData.coverImage === img
                          ? "border-orange-500 scale-95"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="thumb" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Or Custom Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                  }
                  placeholder="/images/hero-data-analytics.jpg"
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* SEO & Tags */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-900 block border-b border-slate-100 pb-2">
                SEO & Tags
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                  placeholder="Target keywords in 160 characters for Google snippet..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keywords & Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="rounded-xl bg-navy-900 px-3 text-xs font-bold text-white"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-navy-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Live Preview Tab */
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-6">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 border border-orange-200">
              {formData.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-navy-900">
              {formData.title || "Untitled Article"}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span>{formData.readTime}</span>
              <span>•</span>
              <span>Sharper Labs Advisory</span>
            </div>
          </div>

          <div className="relative aspect-16/9 w-full my-6 overflow-hidden rounded-2xl bg-navy-950">
            <Image
              src={formData.coverImage || PRESET_IMAGES[0]}
              alt="cover"
              fill
              className="object-cover"
            />
          </div>

          <div className="rounded-2xl border-l-4 border-orange-500 bg-slate-50 p-5 mb-8">
            <p className="font-display text-base font-medium text-navy-900">
              {formData.excerpt || "Article excerpt will appear here..."}
            </p>
          </div>

          <div className="space-y-8">
            {formData.content.map((sec, i) => (
              <div key={i} className="space-y-3">
                <h2 className="font-display text-xl font-bold text-navy-900">
                  {i + 1}. {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm leading-relaxed text-slate-700">
                    {p}
                  </p>
                ))}

                {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                  <div className="rounded-2xl bg-navy-900 p-5 text-white my-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">
                      Key Takeaways
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {sec.keyTakeaways.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-orange-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
