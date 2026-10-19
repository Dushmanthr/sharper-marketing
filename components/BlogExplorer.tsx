"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Calendar,
  Sparkles,
  Tag,
  Filter,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogExplorerProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featured = filteredPosts[0] || posts[0];
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="space-y-12">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-100 bg-white p-4 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, strategies, SEO topics..."
            className="w-full rounded-full border border-navy-200 bg-surface-muted py-2.5 pl-11 pr-4 text-sm text-navy-900 placeholder-navy-400 focus:border-orange-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-navy-900 text-white shadow-xs"
                    : "bg-surface-muted text-navy-700 hover:bg-navy-100 hover:text-navy-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-navy-200 p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">No articles found</p>
          <p className="mt-2 text-sm text-ink-muted">
            Try adjusting your search query or reset category filter to see all insights.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full bg-navy-900 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured Post Card (Hero Spotlight) */}
          {featured && (
            <article className="group relative overflow-hidden rounded-3xl border border-navy-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-xl sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-navy-950 sm:aspect-16/9 lg:col-span-7">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-navy-900/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
                    <Sparkles className="h-3 w-3" /> Featured Insight
                  </span>
                </div>

                <div className="flex flex-col justify-between lg:col-span-5">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-ink-muted">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-600 border border-orange-200/60 font-semibold">
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-navy-400" /> {featured.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-navy-400" /> {featured.publishedAt}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy-900 group-hover:text-orange-600 transition-colors sm:text-3xl">
                      <Link href={`/blog/${featured.slug}`} className="focus:outline-hidden">
                        {featured.title}
                      </Link>
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-navy-100 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full bg-navy-100">
                        <Image
                          src={featured.author.avatar}
                          alt={featured.author.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy-900">{featured.author.name}</p>
                        <p className="text-[11px] text-ink-muted">{featured.author.role}</p>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 group-hover:translate-x-1 transition-transform"
                    >
                      Read Guide <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid of Remaining Posts */}
          {gridPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-navy-100 bg-white p-5 shadow-xs transition-all duration-300 hover:border-orange-200 hover:shadow-lg sm:p-6"
                >
                  <div>
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-navy-950">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-navy-900/80 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-orange-400">
                        {post.category}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2.5 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-navy-400" /> {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                    </div>

                    <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-orange-600 transition-colors">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4">
                    <span className="text-[11px] font-medium text-navy-600">
                      {post.author.name}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-navy-900 transition-colors"
                    >
                      Read <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
