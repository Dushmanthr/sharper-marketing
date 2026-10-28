"use client";

import { useEffect, useRef } from "react";

interface Stage3DHologramProps {
  activeIndex: number;
  className?: string;
}

// Global script loader for Three.js
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
 * - Self-manages its WebGL canvas and safely handles WebGL initialization
 * - Subtle, performant, and 100% compliant with theme colors.
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

    let isDisposed = false;
    let animId: number | null = null;
    let isVisible = true;
    let cleanupThree: (() => void) | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

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
          domElement.className = "h-full w-full pointer-events-none";
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
            opacity: 0.35,
          });
          const outerIco = new THREE.Mesh(icoGeo, icoMat);
          emblemGroup.add(outerIco);

          // Inner wireframe Octahedron
          const octGeo = new THREE.OctahedronGeometry(1.2, 0);
          const octMat = new THREE.MeshBasicMaterial({
            color: COLOR_AMBER,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
          });
          const innerOct = new THREE.Mesh(octGeo, octMat);
          emblemGroup.add(innerOct);

          // Concentric orbit ring
          const ringGeo = new THREE.TorusGeometry(3.1, 0.03, 16, 48);
          const ringMat = new THREE.MeshBasicMaterial({
            color: COLOR_ORANGE,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
          });
          const orbitRing = new THREE.Mesh(ringGeo, ringMat);
          orbitRing.rotation.x = Math.PI / 3;
          emblemGroup.add(orbitRing);

          // Floating orbiting vertices
          const orbitVerticesCount = 18;
          const orbitGeo = new THREE.BufferGeometry();
          const orbitPos = new Float32Array(orbitVerticesCount * 3);
          for (let i = 0; i < orbitVerticesCount; i++) {
            const angle = (i / orbitVerticesCount) * Math.PI * 2;
            orbitPos[i * 3] = Math.cos(angle) * 3.1;
            orbitPos[i * 3 + 1] = Math.sin(angle) * 3.1 * Math.cos(Math.PI / 3);
            orbitPos[i * 3 + 2] = Math.sin(angle) * 3.1 * Math.sin(Math.PI / 3);
          }
          orbitGeo.setAttribute("position", new THREE.BufferAttribute(orbitPos, 3));
          const orbitMat = new THREE.PointsMaterial({
            size: 0.18,
            color: COLOR_AMBER,
            transparent: true,
            opacity: 0.75,
          });
          const orbitPoints = new THREE.Points(orbitGeo, orbitMat);
          emblemGroup.add(orbitPoints);

          // Resize
          const handleResize = () => {
            if (!container || !renderer || !camera) return;
            width = container.clientWidth || 240;
            height = container.clientHeight || 240;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          };
          const resizeObs = new ResizeObserver(handleResize);
          resizeObs.observe(container);

          // Track active index change for dynamic spin acceleration
          let lastActive = activeIndexRef.current;
          let spinBoost = 0;

          const clock = new THREE.Clock();
          const animate = () => {
            if (isDisposed) return;

            if (isVisible) {
              const time = clock.getElapsedTime();

              if (activeIndexRef.current !== lastActive) {
                lastActive = activeIndexRef.current;
                spinBoost = 0.08; // smooth energy kick on service switch
              }

              spinBoost *= 0.94; // damp spin boost
              const currentSpin = 0.006 + spinBoost;

              outerIco.rotation.y += currentSpin;
              outerIco.rotation.x += currentSpin * 0.6;

              innerOct.rotation.y -= currentSpin * 1.4;
              innerOct.rotation.z += currentSpin * 0.8;

              orbitRing.rotation.z += currentSpin * 0.8;
              orbitPoints.rotation.z += currentSpin * 0.8;

              emblemGroup.position.y = Math.sin(time * 0.8) * 0.15;

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
    />
  );
}
