import type { NextConfig } from "next";

// Derive the subdirectory the site is hosted under from NEXT_PUBLIC_SITE_URL.
// e.g. "https://dev.sharper-labs.com/" -> "" (domain root); a future
// "https://dev.sharper-labs.com/something/" -> "/something". This makes all
// _next assets, routes and links resolve correctly whether the site is hosted
// at the domain root or inside a subfolder.
function deriveBasePath(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return "";
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    return path === "" ? "" : path;
  } catch {
    return "";
  }
}

const basePath = deriveBasePath();

const nextConfig: NextConfig = {
  // Support static export when explicitly requested (e.g., cPanel shared hosting),
  // otherwise default to standard dynamic Next.js server to support backend API routes.
  ...(process.env.NEXT_STATIC_EXPORT === "true" ? { output: "export" } : {}),

  // Every route is emitted as `route/index.html` so Apache serves it directly
  // without rewrite rules.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // Host under a subdirectory when NEXT_PUBLIC_SITE_URL has a path.
  // Without this, assets are requested from the domain root and the page
  // hangs when the site actually lives in a subfolder.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // Enable Gzip/Brotli compression for all text assets
  compress: true,

  // Optimise bundle imports for icon and animation libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // High-performance image optimization (AVIF + WebP with mobile breakpoints).
  // Custom loader is reserved for static export or subfolder basePath.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    ...(process.env.NEXT_STATIC_EXPORT === "true" || basePath
      ? {
          loader: "custom",
          loaderFile: "./image-loader.ts",
        }
      : {}),
  },

  // Security & Crawler Headers
  async headers() {
    if (process.env.NEXT_STATIC_EXPORT === "true") return [];
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
