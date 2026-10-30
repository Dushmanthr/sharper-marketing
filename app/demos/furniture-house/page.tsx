"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  RotateCw,
  Ruler,
  ShieldCheck,
  Leaf,
  ChevronDown,
  ArrowRight,
  Check,
  Play,
  X,
  Compass,
  Sparkles,
  Truck,
  Award,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { loadThreeJs } from "@/lib/threeLoader";
import FurnitureNav from "@/components/demos/FurnitureNav";
import DemoBadge from "@/components/demos/DemoBadge";

// Swatch options for 3D Customizer
const finishes = [
  {
    id: "travertine",
    name: "Honed Tuscan Travertine",
    hex: 0xd6c7b2,
    colorClass: "bg-[#d6c7b2]",
    materialDesc: "Porous warm Italian limestone with gentle cream veining",
  },
  {
    id: "amber-oak",
    name: "Smoked Jutland Oak",
    hex: 0x704d30,
    colorClass: "bg-[#704d30]",
    materialDesc: "FSC® certified Danish oak seasoned 90 days in open air",
  },
  {
    id: "boucle-white",
    name: "Nordic Bouclé Cream",
    hex: 0xe8e4dc,
    colorClass: "bg-[#e8e4dc]",
    materialDesc: "Heavyweight Danish wool bouclé with tactile loop weave",
  },
  {
    id: "carrara-nero",
    name: "Matte Carrara Nero",
    hex: 0x232428,
    colorClass: "bg-[#232428]",
    materialDesc: "Deep charcoal honed stone with micro-crystalline quartz",
  },
];

// 4 Signature Designs matching the sample image's top product grid
const signatureDesigns = [
  {
    id: "travertine-console",
    name: "Monolith Travertine Console",
    category: "Living Consoles",
    material: "Honed Tuscan Travertine",
    price: 2450,
    dimensions: "W 160cm × D 42cm × H 82cm",
    tag: "Atelier Signature",
    weight: "84 kg",
  },
  {
    id: "pebble-table",
    name: "Elliptical Pebble Coffee Table",
    category: "Low Tables",
    material: "Solid Travertine & Oak Spheres",
    price: 1890,
    dimensions: "L 145cm × W 78cm × H 36cm",
    tag: "Architect Choice",
    weight: "68 kg",
  },
  {
    id: "fluted-plinth",
    name: "Fluted Pedestal Plinth",
    category: "Sculptural Plinths",
    material: "Hand-Chiseled Travertine",
    price: 1150,
    dimensions: "W 38cm × D 38cm × H 85cm",
    tag: "Master Chiseled",
    weight: "42 kg",
  },
  {
    id: "cantilever-desk",
    name: "Cantilever Travertine Table",
    category: "Architectural Tables",
    material: "Travertine Slabs & Smoked Oak",
    price: 2850,
    dimensions: "L 200cm × W 90cm × H 76cm",
    tag: "Limited Release",
    weight: "112 kg",
  },
];

// 3 Editorial Articles from the Journal
const journalArticles = [
  {
    id: "travertine-patina",
    title: "The Timeless Patina of Tuscan Travertine in Contemporary Living",
    category: "Materiality",
    readTime: "5 min read",
    date: "Autumn 2026",
    excerpt:
      "Formed by thermal mineral springs over millennia, Italian travertine introduces organic warmth and irreplaceable tactile topography to modern architectural interiors.",
  },
  {
    id: "low-plinth",
    title: "Monolithic Simplicity: How Low Plinth Tables Anchor High-Ceiling Spaces",
    category: "Spatial Design",
    readTime: "4 min read",
    date: "Autumn 2026",
    excerpt:
      "By keeping horizon lines low and surfaces massive, monolithic low tables allow light and proportion to breathe in generous contemporary residences.",
  },
  {
    id: "quarry-selection",
    title: "Selecting the Ideal Stone Block: Natural Cavities, Hone & Vein Direction",
    category: "Provenance",
    readTime: "6 min read",
    date: "Winter 2026",
    excerpt:
      "Inside the historic Rapolano Terme quarry, our artisans inspect raw extracted blocks to curate slabs where natural porosity and density achieve ideal balance.",
  },
];

// 4 Cinematic Video Showcase Steps
const provenanceSteps = [
  {
    id: "quarry",
    step: "01",
    title: "Tuscan Mountain Quarry Extraction",
    location: "Rapolano Terme, Siena, Italy",
    desc: "Blocks of premium travertine are selected at the quarry face using diamond-wire saws, respecting natural fault lines to ensure structural integrity across generations.",
    duration: "1:45 min",
  },
  {
    id: "diamond-cut",
    step: "02",
    title: "Precision Diamond Gang-Saw Slicing",
    location: "Artisan Stoneworks, Carrara",
    desc: "Raw boulders weighing up to 18 tonnes are calibrated and sliced into monolithic 50mm slabs with water-cooled multi-diamond blades to reveal hidden geologic veining.",
    duration: "2:10 min",
  },
  {
    id: "shaping",
    step: "03",
    title: "Multi-Axis CNC Milling & Hand Chiseling",
    location: "Copenhagen Atelier, Denmark",
    desc: "Architectural components are dimensioned with sub-millimeter precision before master stonemasons hand-soften every radius and chiseled fluting detail.",
    duration: "2:35 min",
  },
  {
    id: "finishing",
    step: "04",
    title: "Organic Linseed & Beeswax Finishing",
    location: "Finishing Hall, Copenhagen",
    desc: "Surfaces are hand-buffed with non-toxic botanical oils and breathable natural waxes that nourish the stone while preserving its velvety matte tactile sensation.",
    duration: "1:55 min",
  },
];

export default function FurnitureHouseDemo() {
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [cartCount, setCartCount] = useState(1);
  const [cartToast, setCartToast] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });
  const [showDimensions, setShowDimensions] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const threeCanvasRef = useRef<HTMLDivElement>(null);
  const chairMeshRef = useRef<any>(null);

  // Initialize Three.js 3D Sculptural Model with Touch & Mouse Drag
  useEffect(() => {
    let animId: number;
    let isMounted = true;
    let cleanup: (() => void) | null = null;

    loadThreeJs()
      .then((THREE) => {
        if (!isMounted) return;
        const container = threeCanvasRef.current;
        if (!container) return;

        // Clear any previous canvas element
        container.innerHTML = "";

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
        camera.position.set(3.2, 2.4, 4.6);
        camera.lookAt(0, 0.2, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Procedural 3D Designer Armchair / Sculptural Table Group
        const chairGroup = new THREE.Group();

        // Cushion / Stone Material
        const mainMaterial = new THREE.MeshPhysicalMaterial({
          color: selectedFinish.hex,
          roughness: 0.55,
          metalness: 0.1,
          clearcoat: 0.2,
          clearcoatRoughness: 0.2,
        });

        // Frame / Legs Wood Material
        const woodMat = new THREE.MeshStandardMaterial({
          color: 0x3d2716,
          roughness: 0.45,
          metalness: 0.05,
        });

        // 1. Monolithic Seat Slab
        const seatGeo = new THREE.BoxGeometry(1.65, 0.26, 1.5);
        const seat = new THREE.Mesh(seatGeo, mainMaterial);
        seat.position.y = 0.55;
        seat.castShadow = true;
        seat.receiveShadow = true;
        chairGroup.add(seat);

        // 2. Sculpted Curved Backrest
        const backGeo = new THREE.BoxGeometry(1.65, 1.15, 0.24);
        const back = new THREE.Mesh(backGeo, mainMaterial);
        back.position.set(0, 1.18, -0.65);
        back.rotation.x = -0.15;
        back.castShadow = true;
        chairGroup.add(back);

        // 3. Side Plinth Armrests
        const armLeftGeo = new THREE.BoxGeometry(0.2, 0.52, 1.35);
        const armLeft = new THREE.Mesh(armLeftGeo, mainMaterial);
        armLeft.position.set(-0.88, 0.86, -0.05);
        armLeft.castShadow = true;
        chairGroup.add(armLeft);

        const armRight = armLeft.clone();
        armRight.position.x = 0.88;
        chairGroup.add(armRight);

        // 4. Solid Angled Timber Legs
        const legGeo = new THREE.CylinderGeometry(0.048, 0.032, 0.65, 16);
        const legPositions = [
          [-0.72, 0.25, 0.6, 0.1, -0.1],
          [0.72, 0.25, 0.6, 0.1, 0.1],
          [-0.72, 0.25, -0.6, -0.15, -0.1],
          [0.72, 0.25, -0.6, -0.15, 0.1],
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
        chairMeshRef.current = mainMaterial;

        // Warm Editorial Studio Lighting
        const ambient = new THREE.AmbientLight(0xfff6ea, 0.85);
        scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
        keyLight.position.set(6, 8, 4);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const warmFill = new THREE.DirectionalLight(0xd4af37, 0.5);
        warmFill.position.set(-5, 4, -3);
        scene.add(warmFill);

        // Interactive 360° Drag (Mouse + Touch Support for Mobile & Tablets)
        let isDragging = false;
        let prevX = 0;
        let targetRotationY = 0.4;

        const handleStart = (clientX: number) => {
          isDragging = true;
          prevX = clientX;
        };

        const handleMove = (clientX: number) => {
          if (!isDragging) return;
          const deltaX = clientX - prevX;
          targetRotationY += deltaX * 0.008;
          prevX = clientX;
        };

        const handleEnd = () => {
          isDragging = false;
        };

        // Desktop mouse events
        const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onMouseUp = () => handleEnd();

        // Touch events
        const onTouchStart = (e: TouchEvent) => {
          if (e.touches.length > 0) handleStart(e.touches[0].clientX);
        };
        const onTouchMove = (e: TouchEvent) => {
          if (e.touches.length > 0) handleMove(e.touches[0].clientX);
        };
        const onTouchEnd = () => handleEnd();

        container.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        container.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        // Animation Loop with smooth inertial damping
        const animate = () => {
          animId = requestAnimationFrame(animate);
          chairGroup.rotation.y += (targetRotationY - chairGroup.rotation.y) * 0.08;
          if (!isDragging) {
            targetRotationY += 0.0015; // Slow ambient architectural drift
          }
          renderer.render(scene, camera);
        };
        animate();

        // Responsive Resizing
        const onResize = () => {
          if (!container || !isMounted) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          container.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          container.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", onTouchEnd);
          window.removeEventListener("resize", onResize);
          cancelAnimationFrame(animId);
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, []); // Run once! In-place swatch updates prevent tearing down the scene

  // Dynamic Swatch Update (Updates material in-place without resetting camera rotation)
  const handleSelectFinish = (finish: (typeof finishes)[0]) => {
    setSelectedFinish(finish);
    if (chairMeshRef.current) {
      chairMeshRef.current.color.setHex(finish.hex);
    }
  };

  const handleAddToCart = (productName: string) => {
    setCartCount((c) => c + 1);
    setCartToast({ open: true, title: productName });
    setTimeout(() => setCartToast({ open: false, title: "" }), 2800);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setNewsletterSuccess(false);
    }, 3500);
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfbfa] text-[#191716] font-sans selection:bg-[#c9a87d] selection:text-black">
      {/* 1. Atelier Luxury Navbar */}
      <FurnitureNav cartCount={cartCount} />
      <DemoBadge studySlug="furniture-house" studyName="Nordic & Form" />

      {/* 2. Full-Bleed Editorial Hero: TRAVERTINE COLLECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex flex-col items-center justify-between overflow-hidden bg-[#735843] text-white px-4 sm:px-8 py-12 select-none">
        {/* Warm Ambient Studio Vignette & Architectural Table Graphic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none z-10" />

        {/* Artistic Architectural Console Table Silhouette Composition */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85">
          <svg
            className="w-full h-full max-w-5xl object-cover scale-110 sm:scale-100 transition-transform duration-1000"
            viewBox="0 0 1000 650"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="travertineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d9caa8" />
                <stop offset="50%" stopColor="#bfae8b" />
                <stop offset="100%" stopColor="#9e8b69" />
              </linearGradient>
              <linearGradient id="legGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b8a786" />
                <stop offset="100%" stopColor="#6e5e45" />
              </linearGradient>
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="25" stdDeviation="28" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Back Studio Shadow */}
            <ellipse cx="500" cy="560" rx="420" ry="45" fill="#000000" opacity="0.35" filter="url(#softShadow)" />

            {/* Solid Console Table Top Slab */}
            <path
              d="M 120 220 Q 500 200 880 220 L 890 260 Q 500 240 110 260 Z"
              fill="url(#travertineGrad)"
              filter="url(#softShadow)"
            />

            {/* Slab Bevel Thickness */}
            <path d="M 110 260 Q 500 240 890 260 L 885 280 Q 500 260 115 280 Z" fill="#8c7a5c" />

            {/* Left Monolithic Pillar Leg */}
            <path d="M 240 270 L 320 270 L 300 550 L 220 550 Z" fill="url(#legGrad)" filter="url(#softShadow)" />
            {/* Fluting Line Accents */}
            <line x1="265" y1="272" x2="245" y2="550" stroke="#68563d" strokeWidth="2" opacity="0.6" />
            <line x1="295" y1="272" x2="275" y2="550" stroke="#68563d" strokeWidth="2" opacity="0.6" />

            {/* Right Monolithic Pillar Leg */}
            <path d="M 680 270 L 760 270 L 780 550 L 700 550 Z" fill="url(#legGrad)" filter="url(#softShadow)" />
            <line x1="705" y1="272" x2="725" y2="550" stroke="#68563d" strokeWidth="2" opacity="0.6" />
            <line x1="735" y1="272" x2="755" y2="550" stroke="#68563d" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        {/* Top spacer */}
        <div />

        {/* Central Hero Titles matching the sample image */}
        <div className="relative z-20 text-center space-y-4 max-w-4xl mx-auto mt-12 sm:mt-24">
          <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.35em] text-[#e8ded3] font-medium block">
            Copenhagen Atelier · Autumn 2026 Archive
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-normal tracking-[0.22em] uppercase text-white leading-tight drop-shadow-md">
            Travertine Collection
          </h1>

          <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-[#e6ded5] font-light max-w-lg mx-auto">
            Honed Italian Stone &amp; Generational Danish Joinery
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#signature-designs"
              className="rounded-full bg-white px-7 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#171513] hover:bg-[#c9a87d] hover:text-black transition-all shadow-lg hover:scale-102"
            >
              Explore Signature Pieces
            </a>
            <a
              href="#bespoke-studio"
              className="rounded-full border border-white/40 bg-black/25 backdrop-blur-md px-7 py-3 text-[11px] font-medium tracking-[0.2em] uppercase text-white hover:border-white transition-all hover:bg-black/40"
            >
              3D Interactive Studio
            </a>
          </div>
        </div>

        {/* Bottom Circular Scroll Indicator */}
        <div className="relative z-20 pb-4">
          <a
            href="#signature-designs"
            aria-label="Scroll down to signature designs"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* 3. SIGNATURE DESIGNS (4-Column Minimalist Grid matching sample image) */}
      <section id="signature-designs" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#fbf9f5] border-b border-[#e5dfd4]">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center space-y-2 mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8e7861] font-semibold">
              Curated Architectural Works
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-[0.2em] uppercase text-[#171513] font-normal">
              Signature Designs
            </h2>
            <div className="w-12 h-0.5 bg-[#8e7861]/40 mx-auto mt-4" />
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {signatureDesigns.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-[#e5ded2] p-5 sm:p-6 transition-all duration-300 hover:border-[#171513] hover:shadow-xl"
              >
                <div>
                  {/* Clean Sculptural Geometric Illustration for each piece */}
                  <div className="relative aspect-4/3 w-full rounded-xl bg-[#f5f1ea] border border-[#ece6db] flex items-center justify-center overflow-hidden mb-5">
                    {/* Minimalist SVG Stone Furniture Art */}
                    {idx === 0 && (
                      <svg className="w-4/5 h-4/5 object-contain" viewBox="0 0 200 140" fill="none">
                        <rect x="20" y="38" width="160" height="14" rx="2" fill="#d6c7b2" />
                        <rect x="42" y="52" width="22" height="65" fill="#c4b39b" />
                        <rect x="136" y="52" width="22" height="65" fill="#c4b39b" />
                        <ellipse cx="100" cy="120" rx="75" ry="6" fill="#000" opacity="0.08" />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg className="w-4/5 h-4/5 object-contain" viewBox="0 0 200 140" fill="none">
                        <path d="M 30 55 Q 100 35 170 55 Q 180 75 160 80 Q 90 85 40 75 Z" fill="#d6c7b2" />
                        <circle cx="65" cy="95" r="18" fill="#a8957c" />
                        <circle cx="135" cy="95" r="18" fill="#a8957c" />
                        <ellipse cx="100" cy="116" rx="65" ry="5" fill="#000" opacity="0.08" />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg className="w-4/5 h-4/5 object-contain" viewBox="0 0 200 140" fill="none">
                        <rect x="70" y="24" width="60" height="10" fill="#d6c7b2" />
                        <path d="M 75 34 L 125 34 L 120 110 L 80 110 Z" fill="#c4b39b" />
                        <line x1="88" y1="34" x2="90" y2="110" stroke="#9a8770" strokeWidth="1.5" />
                        <line x1="100" y1="34" x2="100" y2="110" stroke="#9a8770" strokeWidth="1.5" />
                        <line x1="112" y1="34" x2="110" y2="110" stroke="#9a8770" strokeWidth="1.5" />
                        <rect x="65" y="110" width="70" height="10" fill="#a8957c" />
                        <ellipse cx="100" cy="122" rx="45" ry="4" fill="#000" opacity="0.08" />
                      </svg>
                    )}
                    {idx === 3 && (
                      <svg className="w-4/5 h-4/5 object-contain" viewBox="0 0 200 140" fill="none">
                        <rect x="18" y="35" width="164" height="12" fill="#d6c7b2" />
                        <path d="M 30 47 L 55 47 L 70 112 L 45 112 Z" fill="#704d30" />
                        <path d="M 145 47 L 170 47 L 155 112 L 130 112 Z" fill="#704d30" />
                        <ellipse cx="100" cy="118" rx="70" ry="5" fill="#000" opacity="0.08" />
                      </svg>
                    )}

                    <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/90 text-[#8e7861] border border-[#e5ded2]">
                      {product.tag}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#8e7861]">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-base font-medium tracking-wide text-[#171513] group-hover:text-[#8e7861] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#6e6861] leading-relaxed">
                      {product.material} · {product.dimensions}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f0eae0] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8e7861] block">Price</span>
                    <span className="font-serif text-base font-bold text-[#171513]">
                      £{product.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product.name)}
                    className="flex items-center gap-1.5 rounded-full bg-[#171513] px-3.5 py-1.5 text-[11px] font-medium tracking-wider uppercase text-white hover:bg-[#8e7861] transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Acquire</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Centered View All CTA matching sample image */}
          <div className="text-center mt-12 sm:mt-16">
            <Link
              href="/demos/furniture-house/collection"
              className="inline-flex items-center gap-2 rounded-full bg-[#171513] px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-[#e8dfd5] hover:bg-[#8e7861] hover:text-white transition-all shadow-md hover:scale-102"
            >
              <span>View All Collection Pieces</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Architect & Studio Endorsement Ticker */}
      <div className="border-y border-[#e2dcd0] bg-[#f5f1ea] py-6 px-4 text-center select-none">
        <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.3em] text-[#6d6357] font-medium">
          Trusted by leading interior designers and architectural practices across London, Copenhagen &amp; New York
        </p>
      </div>

      {/* 5. Mid-Page Dramatic Showcase: "BESPOKE MARBLE & TIMBER FURNISHINGS" with 3D Studio */}
      <section id="bespoke-studio" className="relative py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#141210] text-[#f7f5f0] overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c9a87d]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-3 mb-12 sm:mb-16">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a87d] font-semibold">
              Interactive Architectural Configurator
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase text-white font-normal">
              Bespoke Marble &amp; Timber Furnishings
            </h2>
            <p className="text-xs sm:text-sm text-white/60 tracking-wider uppercase max-w-xl mx-auto font-light">
              Rotate 360° to inspect joinery tolerances, contours &amp; live material swatches
            </p>
            <div className="w-12 h-0.5 bg-[#c9a87d]/50 mx-auto mt-4" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* 3D WebGL Canvas */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[520px] w-full rounded-3xl border border-white/10 bg-[#1a1715]/90 shadow-2xl flex items-center justify-center overflow-hidden">
              <div
                ref={threeCanvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                title="Drag to rotate 360°"
              />

              {/* 3D Controls Hint */}
              <div className="pointer-events-none absolute bottom-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-[10px] sm:text-[11px] font-medium text-white/90 backdrop-blur-md shadow-lg">
                <RotateCw className="h-3.5 w-3.5 text-[#c9a87d] animate-spin" />
                <span>Drag to inspect 360° · Touch &amp; Mouse supported</span>
              </div>
            </div>

            {/* Customizer Controls & Specification */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a87d]/30 bg-[#c9a87d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c9a87d]">
                <Sparkles className="h-3 w-3" />
                <span>Custom Atelier Studio</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white">
                  København Sculptural Lounge Chair
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mt-2">
                  Engineered with an ergonomic steam-bent curved backrest, interlocking solid oak dowels, and monolithic side plinths. Hand-rubbed in Copenhagen.
                </p>
              </div>

              {/* Material Swatches */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60 uppercase tracking-wider text-[11px]">Active Material Finish:</span>
                  <span className="text-[#c9a87d] font-serif font-medium">{selectedFinish.name}</span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectFinish(f)}
                      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                        selectedFinish.id === f.id
                          ? "border-[#c9a87d] bg-white/10 scale-102 shadow-lg"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <span className={`h-7 w-7 rounded-full shadow-inner ${f.colorClass}`} />
                      <span className="text-[9px] uppercase tracking-wider text-white/70 text-center truncate w-full">
                        {f.id}
                      </span>
                      {selectedFinish.id === f.id && (
                        <Check className="h-3 w-3 text-[#c9a87d] absolute top-1.5 right-1.5" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/50 italic">{selectedFinish.materialDesc}</p>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    £1,480
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#c9a87d]">
                    White-Glove Delivery Included
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(`København Chair (${selectedFinish.name})`)}
                    className="flex-1 rounded-full bg-gradient-to-r from-[#c9a87d] to-[#e4cbab] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#141210] shadow-xl hover:scale-102 transition-transform"
                  >
                    Acquire Configured Piece (£1,480)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDimensions(!showDimensions)}
                    className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-3.5 text-xs font-medium text-white hover:border-[#c9a87d] transition-colors"
                  >
                    <Ruler className="h-3.5 w-3.5 text-[#c9a87d]" />
                    <span>{showDimensions ? "Hide Spec" : "Dimensions"}</span>
                  </button>
                </div>

                {/* Dimension Schematics Drawer */}
                {showDimensions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-white/15 bg-white/5 p-3.5 text-xs grid grid-cols-3 gap-2 text-center"
                  >
                    <div>
                      <span className="text-[#c9a87d] text-[10px] uppercase tracking-wider block">Width</span>
                      <p className="font-serif text-sm font-bold text-white">86 cm</p>
                    </div>
                    <div>
                      <span className="text-[#c9a87d] text-[10px] uppercase tracking-wider block">Depth</span>
                      <p className="font-serif text-sm font-bold text-white">92 cm</p>
                    </div>
                    <div>
                      <span className="text-[#c9a87d] text-[10px] uppercase tracking-wider block">Seat Height</span>
                      <p className="font-serif text-sm font-bold text-white">44 cm</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FROM THE BLOG / ATELIER JOURNAL (3-Column Minimalist Cards matching sample image) */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#fbf9f5] border-b border-[#e5dfd4]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#8e7861] font-semibold">
              Design Essays &amp; Materiality
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-[0.2em] uppercase text-[#171513] font-normal">
              From The Atelier Journal
            </h2>
            <div className="w-12 h-0.5 bg-[#8e7861]/40 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {journalArticles.map((article, idx) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-[#e5ded2] p-6 hover:border-[#171513] transition-all duration-300 hover:shadow-lg"
              >
                <div>
                  {/* Clean Editorial Architectural Art */}
                  <div className="aspect-16/10 w-full rounded-xl bg-[#f5f1ea] border border-[#ece6db] flex items-center justify-center overflow-hidden mb-5">
                    {idx === 0 && (
                      <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-radial from-[#eadecc] to-[#c7b599]">
                        <span className="font-serif text-base tracking-widest uppercase text-[#5a4c38] text-center">
                          Tuscan Travertine
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#7d6b52] mt-1">
                          Mineral Cavities &amp; Patina
                        </span>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-radial from-[#dfd7ca] to-[#b3a896]">
                        <span className="font-serif text-base tracking-widest uppercase text-[#473e31] text-center">
                          Monolithic Plinths
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#6d6150] mt-1">
                          Low Horizon Lines
                        </span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-radial from-[#ece5db] to-[#c2b7a7]">
                        <span className="font-serif text-base tracking-widest uppercase text-[#524535] text-center">
                          Vein Direction
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#776751] mt-1">
                          Quarry Face Selection
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8e7861] mb-2">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#171513] group-hover:text-[#8e7861] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6e6861] leading-relaxed mt-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#f0eae0] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e7861]">
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171513] group-hover:text-[#8e7861] transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/demos/furniture-house/craft"
              className="inline-flex items-center gap-2 rounded-full border border-[#171513] px-7 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#171513] hover:bg-[#171513] hover:text-white transition-all"
            >
              <span>Discover All Journal Essays</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. VIP Atelier Circle Newsletter ("JOIN THE ATELIER CIRCLE") */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#f5f1ea] border-b border-[#e5dfd4] text-center select-none">
        <div className="container mx-auto max-w-xl space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8e7861] font-semibold block">
            Private Client Register
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#171513] font-normal">
            Join The Atelier Circle
          </h2>
          <p className="text-xs text-[#6e6861] leading-relaxed">
            Receive private preview invitations for limited stone slab releases, bespoke commissions, and architectural journal editions.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 rounded-full bg-white border border-[#c9a87d] text-xs font-medium text-[#171513] inline-flex items-center gap-2 shadow-sm">
              <Check className="h-4 w-4 text-[#8e7861]" />
              <span>You have been registered to the private atelier register.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 pt-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#dcd6c8] rounded-full px-5 py-3 text-xs text-[#171513] placeholder-[#8e7861] focus:outline-hidden focus:border-[#171513]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#171513] px-7 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-white hover:bg-[#8e7861] transition-colors"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. Cinematic Craft & Quarry Process ("THE PROVENANCE SERIES" - 4 Stacked Video Showcases) */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#171513] text-[#f7f5f0]">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a87d] font-semibold">
              The Material Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-[0.2em] uppercase text-white font-normal">
              Provenance &amp; Craftsmanship
            </h2>
            <p className="text-xs text-white/60 tracking-wider uppercase max-w-md mx-auto">
              From ancient mountain stone quarries to generational hand finishing
            </p>
            <div className="w-12 h-0.5 bg-[#c9a87d]/50 mx-auto mt-4" />
          </div>

          {/* 4 Stacked Video Showcase Banners matching sample image */}
          <div className="space-y-8">
            {provenanceSteps.map((step, idx) => (
              <div
                key={step.id}
                className="relative rounded-3xl border border-white/10 bg-[#211d1a] overflow-hidden group shadow-2xl transition-all hover:border-[#c9a87d]/40"
              >
                {/* Visual Banner Styling */}
                <div className="relative aspect-21/9 sm:aspect-24/8 w-full flex items-center justify-center overflow-hidden">
                  {/* Procedural Landscape Gradient representation for each process */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${
                      idx === 0
                        ? "bg-gradient-to-r from-[#3e3429] via-[#635342] to-[#2b241d]"
                        : idx === 1
                        ? "bg-gradient-to-r from-[#29323c] via-[#485563] to-[#1e2329]"
                        : idx === 2
                        ? "bg-gradient-to-r from-[#36322d] via-[#524b43] to-[#26231f]"
                        : "bg-gradient-to-r from-[#423223] via-[#6e5338] to-[#2e2318]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs" />

                  {/* Centered Circular Play Button */}
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(step.title)}
                    className="relative z-10 flex flex-col items-center gap-2 group/btn"
                  >
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md shadow-2xl transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-black">
                      <Play className="h-6 w-6 ml-0.5 fill-current" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/80 group-hover/btn:text-white">
                      Play {step.duration}
                    </span>
                  </button>
                </div>

                {/* Information Card beneath visual */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 bg-[#1a1715]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#c9a87d]">
                        {step.step}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#c9a87d] shrink-0">
                    {step.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Four Value Pillars / Atelier Guarantees Bar (matching sample image) */}
      <section className="py-14 px-4 sm:px-8 lg:px-16 bg-[#fbf9f5] border-t border-[#e5dfd4]">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <Truck className="h-6 w-6 text-[#8e7861] mx-auto sm:mx-0" />
            <h4 className="font-serif text-sm font-semibold tracking-wide text-[#171513]">
              White-Glove Delivery
            </h4>
            <p className="text-[11px] text-[#6e6861] leading-relaxed">
              Two-man inside room delivery, assembly, and packaging removal worldwide.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <Award className="h-6 w-6 text-[#8e7861] mx-auto sm:mx-0" />
            <h4 className="font-serif text-sm font-semibold tracking-wide text-[#171513]">
              10-Year Warranty
            </h4>
            <p className="text-[11px] text-[#6e6861] leading-relaxed">
              Every timber and natural travertine joint is warranted for enduring decades.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <Leaf className="h-6 w-6 text-[#8e7861] mx-auto sm:mx-0" />
            <h4 className="font-serif text-sm font-semibold tracking-wide text-[#171513]">
              FSC® Certified Sourcing
            </h4>
            <p className="text-[11px] text-[#6e6861] leading-relaxed">
              100% European white oak harvested from managed Scandinavian regeneration reserves.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <Compass className="h-6 w-6 text-[#8e7861] mx-auto sm:mx-0" />
            <h4 className="font-serif text-sm font-semibold tracking-wide text-[#171513]">
              Architectural Concierge
            </h4>
            <p className="text-[11px] text-[#6e6861] leading-relaxed">
              Direct consultation with our Copenhagen design studio for bespoke dimensions.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Refined Minimalist Luxury Footer matching sample image */}
      <footer className="border-t border-[#e2dcd0] bg-[#f5f1ea] px-4 sm:px-8 py-16 text-xs text-[#6e6861]">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <span className="font-serif tracking-[0.25em] text-base uppercase text-[#171513] block">
              Nordic &amp; Form
            </span>
            <p className="text-[11px] leading-relaxed text-[#6e6861] max-w-xs">
              Architectural stone and generational Danish timber furniture crafted for enduring high-ceiling living spaces. Copenhagen, Denmark.
            </p>
            <p className="text-[10px] font-mono text-[#8e7861]">
              Atelier: Bredgade 42, 1260 København K
            </p>
          </div>

          {/* Collection Col */}
          <div className="space-y-2">
            <span className="font-serif text-[11px] tracking-wider uppercase text-[#171513] font-semibold block">
              Collections
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/demos/furniture-house/collection" className="hover:text-[#171513]">
                  Travertine Consoles
                </Link>
              </li>
              <li>
                <Link href="/demos/furniture-house/collection" className="hover:text-[#171513]">
                  Low Plinth Tables
                </Link>
              </li>
              <li>
                <Link href="/demos/furniture-house/collection" className="hover:text-[#171513]">
                  Sculptural Seating
                </Link>
              </li>
              <li>
                <Link href="/demos/furniture-house/collection" className="hover:text-[#171513]">
                  Architectural Lighting
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Col */}
          <div className="space-y-2">
            <span className="font-serif text-[11px] tracking-wider uppercase text-[#171513] font-semibold block">
              Provenance
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/demos/furniture-house/craft" className="hover:text-[#171513]">
                  Tuscan Quarries
                </Link>
              </li>
              <li>
                <Link href="/demos/furniture-house/craft" className="hover:text-[#171513]">
                  Mortise Joinery
                </Link>
              </li>
              <li>
                <Link href="/demos/furniture-house/craft" className="hover:text-[#171513]">
                  Material Swatches
                </Link>
              </li>
              <li>
                <Link href="/case-studies/furniture-house" className="hover:text-[#171513]">
                  Case Study Dossier
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div className="space-y-2">
            <span className="font-serif text-[11px] tracking-wider uppercase text-[#171513] font-semibold block">
              Care &amp; Terms
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <span className="hover:text-[#171513] cursor-pointer">White-Glove Transport</span>
              </li>
              <li>
                <span className="hover:text-[#171513] cursor-pointer">Stone Care Guide</span>
              </li>
              <li>
                <span className="hover:text-[#171513] cursor-pointer">10-Year Warranty Terms</span>
              </li>
              <li>
                <span className="hover:text-[#171513] cursor-pointer">Private Commissions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="border-t border-[#e2dcd0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8e7861]">
          <p>© 2026 Nordic &amp; Form Atelier ApS. All rights reserved.</p>
          <div className="flex items-center gap-3 tracking-widest uppercase">
            <span>Apple Pay</span>
            <span>·</span>
            <span>Visa</span>
            <span>·</span>
            <span>Mastercard</span>
            <span>·</span>
            <span>Amex</span>
            <span>·</span>
            <span>Wire Transfer</span>
          </div>
        </div>
      </footer>

      {/* Video Modal Lightbox for Provenance Steps */}
      <AnimatePresence>
        {activeVideoModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#141210] p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-serif text-sm tracking-widest uppercase text-[#c9a87d]">
                  Atelier Provenance: {activeVideoModal}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1 rounded-full text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cinematic Simulated Video Player */}
              <div className="relative aspect-16/9 rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-white/10">
                <div className="text-center space-y-2 p-6">
                  <Play className="h-12 w-12 text-[#c9a87d] mx-auto animate-pulse" />
                  <p className="font-serif text-lg uppercase tracking-wider text-white">
                    {activeVideoModal}
                  </p>
                  <p className="text-xs text-white/60 max-w-md mx-auto">
                    4K Cinematic Master Recording from the Tuscan extraction quarries &amp; Copenhagen finishing hall.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Toast Notification */}
      <AnimatePresence>
        {cartToast.open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#171513] border border-[#c9a87d]/40 px-5 py-3 text-white shadow-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a87d] text-black">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Added to Atelier Bag</p>
              <p className="text-[11px] text-white/70">{cartToast.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
