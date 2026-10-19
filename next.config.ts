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

  // Static export can't use the default image optimiser (needs a server). A
  // custom loader keeps next/image static AND prefixes the subdirectory so
  // local images resolve correctly (see image-loader.ts).
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;
