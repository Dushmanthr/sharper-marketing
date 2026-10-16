// Custom next/image loader for static export under a subdirectory.
//
// With `output: 'export'` + a subfolder basePath, next/image does NOT
// automatically prefix local image src, so images would 404. This loader
// prepends the subdirectory (derived from NEXT_PUBLIC_SITE_URL) to every
// local image. It runs both at build (prerender) and in the browser.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

function deriveBasePath(): string {
  if (!SITE_URL) return "";
  try {
    const path = new URL(SITE_URL).pathname.replace(/\/+$/, "");
    return path === "" ? "" : path;
  } catch {
    return "";
  }
}

const BASE_PATH = deriveBasePath();

export default function imageLoader(params: { src: string; width?: number; quality?: number }): string {
  const { src, width, quality } = params;
  // Leave absolute/remote URLs untouched.
  if (/^https?:\/\//.test(src)) return src;
  const normalised = src.startsWith("/") ? src : `/${src}`;
  const query = new URLSearchParams();
  if (width) query.set("w", String(width));
  if (quality) query.set("q", String(quality));
  const queryString = query.toString();

  return `${BASE_PATH}${normalised}${queryString ? `?${queryString}` : ""}`;
}
