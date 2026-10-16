import type { ReactNode } from "react";
import { basePath } from "@/lib/site";

/**
 * Full-width section with a fixed (parallax) background image and a navy
 * overlay for legibility. The image is a CSS background, so we prefix the
 * subdirectory basePath manually (the next/image loader does not apply here).
 */
export default function ParallaxBand({
  image,
  children,
  className = "",
}: {
  image: string;
  children: ReactNode;
  className?: string;
}) {
  const src = `${basePath}${image.startsWith("/") ? image : `/${image}`}`;
  return (
    <section
      className={`parallax-band relative isolate overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(13,23,48,0.82), rgba(13,23,48,0.82)), url(${src})`,
      }}
    >
      <div className="container-page relative py-20 text-center text-white sm:py-24 lg:py-28">
        {children}
      </div>
    </section>
  );
}
