"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Armchair,
  Sparkles,
  ShoppingBag,
  RotateCw,
  Ruler,
  ShieldCheck,
  Leaf,
  ChevronRight,
  ArrowRight,
  Check,
  Sliders,
  Plus,
} from "lucide-react";
import { loadThreeJs } from "@/lib/threeLoader";

const finishes = [
  { id: "amber-oak", name: "Smoked Amber Oak", hex: 0xb47238, colorClass: "bg-[#b47238]" },
  { id: "boucle-white", name: "Nordic Bouclé Cream", hex: 0xe8e4dc, colorClass: "bg-[#e8e4dc]" },
  { id: "slate-charcoal", name: "Matte Slate Charcoal", hex: 0x272b30, colorClass: "bg-[#272b30]" },
  { id: "terracotta", name: "Terracotta Earth", hex: 0xaa4c33, colorClass: "bg-[#aa4c33]" },
];

const catalogItems = [
  {
    name: "København Lounge Chair",
    category: "Armchairs",
    price: "£1,480",
    material: "Solid Oak & Bouclé",
    badge: "Bestseller",
  },
  {
    name: "Strata Floating Coffee Table",
    category: "Living Tables",
    price: "£890",
    material: "Honed Carrara Marble",
    badge: "New Release",
  },
  {
    name: "Linear Arc Floor Lamp",
    category: "Architectural Lighting",
    price: "£540",
    material: "Hand-Spun Brushed Brass",
    badge: "Eco Rated",
  },
];

export default function FurnitureHouseDemo() {
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [cartCount, setCartCount] = useState(0);
  const [cartToast, setCartToast] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const threeCanvasRef = useRef<HTMLDivElement>(null);
  const chairMeshRef = useRef<any>(null);

  // Initialize Three.js 3D Sculptural Chair customizer
  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | null = null;

    loadThreeJs().then((THREE) => {
      const container = threeCanvasRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(3, 2.5, 4.5);
      camera.lookAt(0, 0.2, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Create procedural 3D Designer Armchair Group
      const chairGroup = new THREE.Group();

      // Cushion Material
      const cushionMat = new THREE.MeshPhysicalMaterial({
        color: selectedFinish.hex,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.1,
      });

      // Frame / Legs Material
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x3d2716,
        roughness: 0.4,
        metalness: 0.05,
      });

      // 1. Seat Cushion (rounded cuboid)
      const seatGeo = new THREE.BoxGeometry(1.6, 0.28, 1.5);
      const seat = new THREE.Mesh(seatGeo, cushionMat);
      seat.position.y = 0.55;
      seat.castShadow = true;
      seat.receiveShadow = true;
      chairGroup.add(seat);

      // 2. Curved Ergonomic Backrest
      const backGeo = new THREE.BoxGeometry(1.6, 1.1, 0.25);
      const back = new THREE.Mesh(backGeo, cushionMat);
      back.position.set(0, 1.15, -0.65);
      back.rotation.x = -0.15;
      back.castShadow = true;
      chairGroup.add(back);

      // 3. Side Armrests
      const armLeftGeo = new THREE.BoxGeometry(0.18, 0.5, 1.3);
      const armLeft = new THREE.Mesh(armLeftGeo, cushionMat);
      armLeft.position.set(-0.85, 0.85, -0.05);
      armLeft.castShadow = true;
      chairGroup.add(armLeft);

      const armRight = armLeft.clone();
      armRight.position.x = 0.85;
      chairGroup.add(armRight);

      // 4. Wooden Legs (cylinders angled)
      const legGeo = new THREE.CylinderGeometry(0.045, 0.03, 0.65, 16);
      const legPositions = [
        [-0.7, 0.25, 0.6, 0.1, -0.1],
        [0.7, 0.25, 0.6, 0.1, 0.1],
        [-0.7, 0.25, -0.6, -0.15, -0.1],
        [0.7, 0.25, -0.6, -0.15, 0.1],
      ];
      legPositions.forEach(([x, y, z, rx, rz]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(x, y, z);
        leg.rotation.x = rx;
        leg.rotation.z = rz;
        leg.castShadow = true;
        chairGroup.add(leg);
      });

      chairGroup.position.y = -0.5;
      scene.add(chairGroup);
      chairMeshRef.current = cushionMat;

      // Studio Lighting
      const ambient = new THREE.AmbientLight(0xfff8f0, 0.75);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
      keyLight.position.set(5, 8, 4);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xd9b38c, 0.6);
      fillLight.position.set(-5, 3, -3);
      scene.add(fillLight);

      // Interactive mouse drag to rotate
      let isDragging = false;
      let prevMouseX = 0;
      let targetRotationY = 0.4;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.008;
        prevMouseX = e.clientX;
      };
      const onMouseUp = () => {
        isDragging = false;
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        // Smooth dampening rotation
        chairGroup.rotation.y += (targetRotationY - chairGroup.rotation.y) * 0.08;
        if (!isDragging) {
          targetRotationY += 0.002; // subtle continuous idle rotation
        }
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }).catch(() => {});

    return () => {
      if (cleanup) cleanup();
    };
  }, [selectedFinish.hex]);

  // Handle Dynamic Material Swatch Update
  const handleSelectFinish = (finish: typeof finishes[0]) => {
    setSelectedFinish(finish);
    if (chairMeshRef.current) {
      chairMeshRef.current.color.setHex(finish.hex);
    }
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2600);
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f5f0] text-[#1a1c20] font-sans selection:bg-[#aa4c33] selection:text-white">
      {/* 1. Nordic Atelier Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-[#e5e0d4] bg-[#f7f5f0]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Armchair className="h-5 w-5 text-[#856046]" />
          <span className="font-display font-bold tracking-tight text-sm sm:text-base uppercase text-[#1a1c20]">
            Nordic &amp; Form Atelier
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-[#5a5f68]">
          <a href="#customizer" className="hover:text-black transition-colors font-medium">Lounge Studio</a>
          <a href="#materials" className="hover:text-black transition-colors font-medium">Sustainable Craft</a>
          <a href="#collection" className="hover:text-black transition-colors font-medium">Living Collection</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="relative flex items-center gap-2 rounded-full border border-[#d8d3c5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1a1c20] shadow-xs hover:border-[#aa4c33]"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#aa4c33]" />
            <span>Bag</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#aa4c33] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* 2. Main 3D Customizer Studio */}
      <section id="customizer" className="px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
        <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Info & Swatches */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ebe7dc] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#73523b]">
              <Sparkles className="h-3 w-3" />
              <span>Architectural Series · Copenhagen 2026</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1a1c20] leading-tight">
              København <br />
              <span className="text-[#856046] font-normal italic">Lounge Chair</span>
            </h1>

            <p className="text-sm leading-relaxed text-[#555a64]">
              Sculpted from sustainable European oak and wrapped in high-tactility bouclé fabric. Ergonomically contoured for enduring postural comfort and timeless spatial harmony.
            </p>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#1a1c20]">
                £1,480
              </span>
              <span className="text-xs text-[#707682]">Includes complimentary white-glove UK delivery</span>
            </div>

            {/* Material Swatches Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#1a1c20]">Select Finish &amp; Textile:</span>
                <span className="text-[#856046]">{selectedFinish.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFinish(f)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      selectedFinish.id === f.id
                        ? "border-[#aa4c33] scale-110 shadow-md"
                        : "border-white/80 hover:scale-105"
                    }`}
                    title={f.name}
                  >
                    <span className={`h-8 w-8 rounded-full ${f.colorClass}`} />
                    {selectedFinish.id === f.id && (
                      <Check className="h-3.5 w-3.5 text-white absolute" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-[#1a1c20] px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#aa4c33] shadow-md hover:scale-[1.02]"
              >
                Add To Bag (£1,480)
              </button>

              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className="flex items-center gap-1.5 rounded-full border border-[#d8d3c5] bg-white px-4 py-3.5 text-xs font-semibold text-[#1a1c20] hover:bg-[#ebe7dc] transition-colors"
              >
                <Ruler className="h-3.5 w-3.5 text-[#856046]" />
                <span>{showDimensions ? "Hide Spec" : "Dimensions"}</span>
              </button>
            </div>

            {/* Dimensions Overlay */}
            {showDimensions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-[#d8d3c5] bg-white p-3.5 text-xs grid grid-cols-3 gap-2 text-center"
              >
                <div>
                  <span className="text-[#856046] font-semibold">Width:</span>
                  <p className="font-bold text-[#1a1c20]">84 cm</p>
                </div>
                <div>
                  <span className="text-[#856046] font-semibold">Height:</span>
                  <p className="font-bold text-[#1a1c20]">78 cm</p>
                </div>
                <div>
                  <span className="text-[#856046] font-semibold">Seat Depth:</span>
                  <p className="font-bold text-[#1a1c20]">82 cm</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: 3D Interactive Three.js Studio Canvas */}
          <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] w-full rounded-3xl border border-[#e5e0d4] bg-white/70 shadow-inner flex items-center justify-center overflow-hidden">
            <div
              ref={threeCanvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              title="Click and drag to rotate the chair 360° in 3D"
            />

            {/* 3D Prompt Indicator */}
            <div className="pointer-events-none absolute bottom-4 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-semibold text-[#5a5f68] shadow-xs backdrop-blur-xs">
              <RotateCw className="h-3 w-3 text-[#aa4c33] animate-spin" />
              <span>Drag to rotate 360° · Material updates live</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sustainable Craft Highlights */}
      <section id="materials" className="py-12 px-4 sm:px-8 lg:px-16 border-t border-[#e5e0d4] bg-white">
        <div className="container mx-auto grid sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#ebe7dc] bg-[#fbf9f5] p-5 space-y-2">
            <Leaf className="h-5 w-5 text-[#3a6d4c]" />
            <h3 className="font-display text-sm font-bold text-[#1a1c20]">FSC European Oak</h3>
            <p className="text-xs text-[#555a64] leading-relaxed">
              Harvested strictly from certified regeneration forests in Denmark and Bavaria.
            </p>
          </div>
          <div className="rounded-2xl border border-[#ebe7dc] bg-[#fbf9f5] p-5 space-y-2">
            <ShieldCheck className="h-5 w-5 text-[#856046]" />
            <h3 className="font-display text-sm font-bold text-[#1a1c20]">10-Year Warranty</h3>
            <p className="text-xs text-[#555a64] leading-relaxed">
              Tested for over 150,000 compression cycles to guarantee lifetime durability.
            </p>
          </div>
          <div className="rounded-2xl border border-[#ebe7dc] bg-[#fbf9f5] p-5 space-y-2">
            <Sparkles className="h-5 w-5 text-[#aa4c33]" />
            <h3 className="font-display text-sm font-bold text-[#1a1c20]">Artisan Hand-Stitched</h3>
            <p className="text-xs text-[#555a64] leading-relaxed">
              Every seam is finished by master upholsterers in our Copenhagen atelier.
            </p>
          </div>
        </div>
      </section>

      {/* Cart Toast Notification */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1a1c20] px-4 py-3 text-white shadow-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#aa4c33] text-white">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Added to Shopping Bag</p>
              <p className="text-[11px] text-white/70">København Lounge Chair ({selectedFinish.name})</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
