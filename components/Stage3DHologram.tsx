"use client";

import { useEffect, useRef, useState } from "react";

interface Stage3DHologramProps {
  activeIndex: number;
  className?: string;
}

// Global script loader for Three.js (lazy loaded on desktop only when visible)
function loadThreeJs(): Promise<any> {
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

/**
 * Stage3DHologram
 * - Elegant 3D rotating geometric emblem in theme colors (Orange #f97316 & Amber #f59e0b)
 * - Lightweight SVG vector fallback for mobile devices (0KB external JS download)
 * - Dynamic Three.js initialization on desktop only when scrolled into view.
 */
export default function Stage3DHologram({
  activeIndex,
  className = "",
}: Stage3DHologramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // On mobile screens (< 1024px), skip external 600KB Three.js download entirely to keep mobile performance 90+
    if (window.innerWidth < 1024) return;

    let isDisposed = false;
    let animId: number | null = null;
    let isVisible = false;
    let cleanupThree: (() => void) | null = null;
    let hasLoaded = false;

    const startThree = () => {
      if (hasLoaded || isDisposed) return;
      hasLoaded = true;

      loadThreeJs()
        .then((THREE) => {
          if (isDisposed || !container) return;

          try {
            let width = container.clientWidth || 240;
            let height = container.clientHeight || 240;

            const renderer = new THREE.WebGLRenderer({
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0);

            const domElement = renderer.domElement;
            domElement.className = "h-full w-full pointer-events-none relative z-10";
            container.appendChild(domElement);

            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.set(0, 0, 8.5);

            const scene = new THREE.Scene();
            const emblemGroup = new THREE.Group();
            scene.add(emblemGroup);

            const COLOR_ORANGE = 0xf97316;
            const COLOR_AMBER = 0xf59e0b;

            // Outer wireframe Icosahedron
            const icoGeo = new THREE.IcosahedronGeometry(2.3, 1);
            const icoMat = new THREE.MeshBasicMaterial({
              color: COLOR_ORANGE,
              wireframe: true,
              transparent: true,
              opacity: 0.55,
            });
            const icoMesh = new THREE.Mesh(icoGeo, icoMat);
            emblemGroup.add(icoMesh);

            // Inner wireframe Octahedron
            const octGeo = new THREE.OctahedronGeometry(1.4, 0);
            const octMat = new THREE.MeshBasicMaterial({
              color: COLOR_AMBER,
              wireframe: true,
              transparent: true,
              opacity: 0.85,
            });
            const octMesh = new THREE.Mesh(octGeo, octMat);
            emblemGroup.add(octMesh);

            // Orbit Ring
            const ringGeo = new THREE.TorusGeometry(3.1, 0.02, 16, 64);
            const ringMat = new THREE.MeshBasicMaterial({
              color: COLOR_ORANGE,
              transparent: true,
              opacity: 0.35,
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 3;
            emblemGroup.add(ringMesh);

            // Second orthogonal tilted ring
            const orbitGeo = new THREE.TorusGeometry(3.1, 0.02, 16, 64);
            const orbitMat = new THREE.MeshBasicMaterial({
              color: COLOR_AMBER,
              transparent: true,
              opacity: 0.35,
            });
            const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
            orbitMesh.rotation.y = Math.PI / 3;
            emblemGroup.add(orbitMesh);

            const handleResize = () => {
              if (!container) return;
              const w = container.clientWidth || 240;
              const h = container.clientHeight || 240;
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
              renderer.setSize(w, h);
            };

            const resizeObs = new ResizeObserver(handleResize);
            resizeObs.observe(container);

            let clock = 0;
            const animate = () => {
              if (isDisposed) return;

              if (isVisible) {
                clock += 0.015;

                // Rotations
                icoMesh.rotation.x += 0.005;
                icoMesh.rotation.y += 0.007;

                octMesh.rotation.x -= 0.008;
                octMesh.rotation.y -= 0.009;

                ringMesh.rotation.z += 0.006;
                orbitMesh.rotation.z -= 0.006;

                // Subtle floating breathing pulsation
                const pulse = 1 + Math.sin(clock) * 0.05;
                emblemGroup.scale.set(pulse, pulse, pulse);

                renderer.render(scene, camera);
              }

              animId = requestAnimationFrame(animate);
            };

            animate();

            cleanupThree = () => {
              resizeObs.disconnect();
              if (domElement.parentNode === container) {
                container.removeChild(domElement);
              }
              renderer.dispose();
              icoGeo.dispose();
              octGeo.dispose();
              ringGeo.dispose();
              orbitGeo.dispose();
            };
          } catch (e) {
            console.warn("Stage 3D hologram WebGL skipped:", e);
          }
        })
        .catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          startThree();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (cleanupThree) cleanupThree();
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Lightweight hardware-accelerated CSS/SVG vector geometric hologram (active on mobile & before Three.js loads) */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full opacity-60 animate-[spin_40s_linear_infinite]"
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#f97316"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.4"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1"
          opacity="0.5"
        />
        <polygon
          points="100,30 160,140 40,140"
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <polygon
          points="100,170 40,60 160,60"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="100" cy="100" r="8" fill="#f97316" opacity="0.8" />
      </svg>
    </div>
  );
}
