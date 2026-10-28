"use client";

import { useEffect, useRef } from "react";

interface Services3DHighlightProps {
  activeIndex: number;
  totalServices?: number;
  className?: string;
}

// Global Three.js script loader (loads r128 via Cloudflare CDN once)
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
 * Three.js 3D Interactive Animation for Six Disciplines.
 * - Highlights the 6 services with theme-colored 3D orbital nodes and a floating particle constellation.
 * - Uses ONLY website theme colors: Warm Orange (#f97316), Amber (#f59e0b), Navy (#0a1128).
 * - Self-manages its WebGL canvas to avoid any 2D/WebGL context collision.
 * - Wrapped with robust try/catch for safe execution across all environments.
 */
export default function Services3DHighlight({
  activeIndex,
  totalServices = 6,
  className = "",
}: Services3DHighlightProps) {
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

    // Mouse coordinates for subtle 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Performance: Pause animation when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Load Three.js and initialize the 3D scene cleanly
    loadThreeJs()
      .then((THREE) => {
        if (isDisposed || !container) return;

        try {
          // Get container dimensions
          let width = container.clientWidth || 900;
          let height = container.clientHeight || 140;

          // Renderer (Three.js creates its own clean WebGL canvas)
          const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.setClearColor(0x000000, 0);

          const domElement = renderer.domElement;
          domElement.className = "h-full w-full opacity-70 transition-opacity duration-700 pointer-events-none";
          container.appendChild(domElement);

          // Camera
          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
          camera.position.set(0, 0, 12);

          // Scene
          const scene = new THREE.Scene();

          // 3D Group holding all elements
          const masterGroup = new THREE.Group();
          scene.add(masterGroup);

          // Theme Color Constants
          const COLOR_ORANGE = 0xf97316; // Warm Orange
          const COLOR_AMBER = 0xf59e0b; // Amber Gold
          const COLOR_AMBER_LIGHT = 0xfdba74; // Light Warm Peach/Orange

          // 1. Create 6 3D Nodes corresponding to the 6 Services
          const nodeCount = totalServices;
          const nodeSpacing = 3.2; // 3D units between cards
          const startX = -((nodeCount - 1) * nodeSpacing) / 2;

          const nodes: Array<{
            group: any;
            outerRing: any;
            innerSphere: any;
            targetScale: number;
            currentScale: number;
          }> = [];

          for (let i = 0; i < nodeCount; i++) {
            const nodeGroup = new THREE.Group();
            nodeGroup.position.set(startX + i * nodeSpacing, 0, 0);

            // Outer Torus Ring in theme orange wireframe
            const ringGeo = new THREE.TorusGeometry(0.75, 0.04, 16, 32);
            const ringMat = new THREE.MeshBasicMaterial({
              color: COLOR_ORANGE,
              wireframe: true,
              transparent: true,
              opacity: 0.25,
            });
            const outerRing = new THREE.Mesh(ringGeo, ringMat);
            nodeGroup.add(outerRing);

            // Inner geometric core in amber
            const coreGeo = new THREE.OctahedronGeometry(0.24, 0);
            const coreMat = new THREE.MeshBasicMaterial({
              color: COLOR_AMBER,
              wireframe: true,
              transparent: true,
              opacity: 0.45,
            });
            const innerSphere = new THREE.Mesh(coreGeo, coreMat);
            nodeGroup.add(innerSphere);

            masterGroup.add(nodeGroup);
            nodes.push({
              group: nodeGroup,
              outerRing,
              innerSphere,
              targetScale: 1,
              currentScale: 1,
            });
          }

          // 2. Connecting 3D Coordination Lines between the 6 nodes
          const linePositions: number[] = [];
          for (let i = 0; i < nodeCount - 1; i++) {
            const x1 = startX + i * nodeSpacing;
            const x2 = startX + (i + 1) * nodeSpacing;
            linePositions.push(x1, 0, 0, x2, 0, 0);
          }
          const lineGeo = new THREE.BufferGeometry();
          lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
          const lineMat = new THREE.LineBasicMaterial({
            color: COLOR_ORANGE,
            transparent: true,
            opacity: 0.2,
          });
          const connectingLines = new THREE.LineSegments(lineGeo, lineMat);
          masterGroup.add(connectingLines);

          // 3. Floating 3D Micro-Particle Constellation
          const particleCount = 75;
          const particlePositions = new Float32Array(particleCount * 3);
          const particleVelocities: Array<{ x: number; y: number; z: number }> = [];

          for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 22;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

            particleVelocities.push({
              x: (Math.random() - 0.5) * 0.006,
              y: (Math.random() - 0.5) * 0.006,
              z: (Math.random() - 0.5) * 0.004,
            });
          }

          const particleGeo = new THREE.BufferGeometry();
          particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

          // In-memory texture for soft glow points
          const pCanvas = document.createElement("canvas");
          pCanvas.width = 32;
          pCanvas.height = 32;
          const pCtx = pCanvas.getContext("2d");
          if (pCtx) {
            const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.3, "rgba(249,115,22,0.8)");
            grad.addColorStop(0.7, "rgba(245,158,11,0.3)");
            grad.addColorStop(1, "rgba(249,115,22,0)");
            pCtx.fillStyle = grad;
            pCtx.fillRect(0, 0, 32, 32);
          }
          const pTexture = new THREE.CanvasTexture(pCanvas);

          const particleMat = new THREE.PointsMaterial({
            size: 0.35,
            map: pTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: COLOR_AMBER_LIGHT,
          });

          const particles = new THREE.Points(particleGeo, particleMat);
          masterGroup.add(particles);

          // Resize handler
          const handleResize = () => {
            if (!container || !renderer || !camera) return;
            width = container.clientWidth || 900;
            height = container.clientHeight || 140;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          };

          const resizeObserver = new ResizeObserver(handleResize);
          resizeObserver.observe(container);

          // Animation Loop
          const clock = new THREE.Clock();
          const render3D = () => {
            if (isDisposed) return;

            if (isVisible) {
              const delta = clock.getDelta();
              const time = clock.getElapsedTime();

              // Smooth mouse parallax lerp
              mouseX += (targetMouseX - mouseX) * 0.05;
              mouseY += (targetMouseY - mouseY) * 0.05;

              // Camera subtle parallax tilt
              camera.position.x = mouseX * 0.7;
              camera.position.y = mouseY * 0.4;
              camera.lookAt(0, 0, 0);

              // Animate master constellation tilt
              masterGroup.rotation.y = Math.sin(time * 0.25) * 0.08 + mouseX * 0.05;
              masterGroup.rotation.x = Math.cos(time * 0.2) * 0.04 - mouseY * 0.05;

              // Animate each of the 6 service nodes
              const currentActive = activeIndexRef.current;
              nodes.forEach((node, idx) => {
                const isActive = idx === currentActive;

                // Active node expands, glows, and rotates with high prominence
                node.targetScale = isActive ? 1.45 : 0.95;
                node.currentScale += (node.targetScale - node.currentScale) * 0.1;
                node.group.scale.set(node.currentScale, node.currentScale, node.currentScale);

                // Continuous gentle rotation in 3D
                node.outerRing.rotation.x += isActive ? 0.025 : 0.008;
                node.outerRing.rotation.y += isActive ? 0.03 : 0.01;
                node.innerSphere.rotation.y -= isActive ? 0.04 : 0.015;
                node.innerSphere.rotation.z += isActive ? 0.02 : 0.008;

                // Material opacity boost for the active discipline
                const targetRingOpacity = isActive ? 0.85 : 0.2;
                const targetCoreOpacity = isActive ? 0.95 : 0.35;
                node.outerRing.material.opacity +=
                  (targetRingOpacity - node.outerRing.material.opacity) * 0.1;
                node.innerSphere.material.opacity +=
                  (targetCoreOpacity - node.innerSphere.material.opacity) * 0.1;
              });

              // Animate 3D particles drifting
              const posAttr = particleGeo.attributes.position;
              const posArray = posAttr.array as Float32Array;
              for (let i = 0; i < particleCount; i++) {
                posArray[i * 3] += particleVelocities[i].x;
                posArray[i * 3 + 1] +=
                  particleVelocities[i].y + Math.sin(time + posArray[i * 3]) * 0.001;
                posArray[i * 3 + 2] += particleVelocities[i].z;

                // Wrap bounds
                if (posArray[i * 3] < -12) posArray[i * 3] = 12;
                if (posArray[i * 3] > 12) posArray[i * 3] = -12;
                if (posArray[i * 3 + 1] < -3) posArray[i * 3] = 3;
                if (posArray[i * 3 + 1] > 3) posArray[i * 3] = -3;
              }
              posAttr.needsUpdate = true;

              // Render 3D frame
              renderer.render(scene, camera);
            }

            animId = requestAnimationFrame(render3D);
          };

          render3D();

          // Teardown function for Three.js
          cleanupThree = () => {
            resizeObserver.disconnect();
            if (domElement.parentNode === container) {
              container.removeChild(domElement);
            }
            renderer.dispose();
            lineGeo.dispose();
            particleGeo.dispose();
            pTexture.dispose();
          };
        } catch (e) {
          // Graceful catch if WebGL is disabled or unsupported
          console.warn("Three.js WebGL initialization skipped:", e);
        }
      })
      .catch(() => {});

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (cleanupThree) cleanupThree();
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [totalServices]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
