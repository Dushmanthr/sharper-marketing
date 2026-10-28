// Global script loader for Three.js (r128 via Cloudflare CDN)
export function loadThreeJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).THREE) return Promise.resolve((window as any).THREE);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("three-script-cdn");
    if (existing) {
      if ((window as any).THREE) return resolve((window as any).THREE);
      existing.addEventListener("load", () => resolve((window as any).THREE));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "three-script-cdn";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => resolve((window as any).THREE);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
