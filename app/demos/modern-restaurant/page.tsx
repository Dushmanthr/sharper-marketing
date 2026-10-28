"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Wine,
  Flame,
  ChevronRight,
  ArrowUpRight,
  Compass,
  Star,
  MapPin,
  X,
} from "lucide-react";
import { loadThreeJs } from "@/lib/threeLoader";

const menuCategories = ["Tasting Menu", "Main Courses", "Cocktails & Cellar"];

const menuItems = {
  "Tasting Menu": [
    {
      name: "Wild Truffle & Smoked Brioche",
      desc: "Foraged Périgord black winter truffles, cultured churned butter, 48hr fermented brioche crumb.",
      price: "£28",
      tag: "Signature",
    },
    {
      name: "Glacier King Salmon Tataki",
      desc: "Yuzu kosho glaze, smoked dashi emulsion, pickled daikon radish blossoms, sea fennel oil.",
      price: "£36",
      tag: "Fresh Catch",
    },
    {
      name: "Dry-Aged Wagyu A5 Ribeye",
      desc: "Kagoshima prefecture beef, fermented black garlic jus, charred maitake mushroom puree.",
      price: "£68",
      tag: "Chef Selection",
    },
  ],
  "Main Courses": [
    {
      name: "Heritage Duck Breast Royale",
      desc: "Roasted over binchotan charcoal, spiced blood orange gastrique, heritage baby carrots.",
      price: "£42",
      tag: "Charcoal Wood",
    },
    {
      name: "Roasted Turbot on the Bone",
      desc: "Cornish turbot, razor clam chowder, brown butter verbena foam, crispy sea buckthorn.",
      price: "£46",
      tag: "Sustainable",
    },
    {
      name: "Charred Morel & Sunchoke Risotto",
      desc: "Acquerello aged carnaroli rice, slow-roasted Jerusalem artichoke, 36-month Reggiano.",
      price: "£32",
      tag: "Plant Based",
    },
  ],
  "Cocktails & Cellar": [
    {
      name: "Smoked Saffron Old Fashioned",
      desc: "Small-batch Japanese bourbon, Persian saffron syrup, Andean smoke mist, aromatic bitters.",
      price: "£19",
      tag: "Craft Bar",
    },
    {
      name: "Champagne Velvet Reserve 2014",
      desc: "Blanc de Blancs Grand Cru, chalk minerality, toasted brioche and white peach finish.",
      price: "£24 / glass",
      tag: "Sommelier Pick",
    },
    {
      name: "Nordic Botanical Cloud",
      desc: "Distilled lingonberry spirit, birch sap mist, wild thyme infused dry vermouth.",
      price: "£18",
      tag: "Botanical",
    },
  ],
};

export default function ModernRestaurantDemo() {
  const [activeTab, setActiveTab] = useState<keyof typeof menuItems>("Tasting Menu");
  const [reservationModal, setReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [partySize, setPartySize] = useState("2 Guests");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const threeCanvasRef = useRef<HTMLDivElement>(null);

  // Initialize Three.js interactive 3D culinary torus & orbiting golden particles
  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | null = null;

    loadThreeJs().then((THREE) => {
      const container = threeCanvasRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Central sculptural 3D Torus knot (abstract culinary presentation dish)
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 16);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,
        emissive: 0x221500,
        roughness: 0.2,
        metalness: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        wireframe: false,
      });
      const torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);

      // Orbiting Golden Culinary Particles
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 8;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xf59e0b,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xf59e0b, 2, 50);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xd97706, 1.5, 50);
      pointLight2.position.set(-5, -5, 2);
      scene.add(pointLight2);

      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.008;

        // Subtle mouse parallax response
        torusKnot.rotation.y += (mouseX * 0.5 - torusKnot.rotation.y) * 0.05;
        torusKnot.rotation.x += (-mouseY * 0.5 - torusKnot.rotation.x) * 0.05;

        particleSystem.rotation.y -= 0.002;
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
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }).catch(() => {});

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setReservationModal(false);
    }, 2400);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0d13] text-[#f4efe6] font-sans selection:bg-[#d4af37] selection:text-black">
      {/* 1. Modern Restaurant Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0d13]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37] text-black font-serif font-bold text-sm">
            A
          </div>
          <span className="font-serif tracking-widest text-sm sm:text-base font-semibold uppercase text-white">
            Aura Mayfair
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-white/70">
          <a href="#about" className="hover:text-[#d4af37] transition-colors">Philosophy</a>
          <a href="#menu" className="hover:text-[#d4af37] transition-colors">Menu</a>
          <a href="#cellar" className="hover:text-[#d4af37] transition-colors">Wine Cellar</a>
          <a href="#private-dining" className="hover:text-[#d4af37] transition-colors">Private Dining</a>
        </div>

        <button
          onClick={() => setReservationModal(true)}
          className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          Reserve Table
        </button>
      </nav>

      {/* 2. Hero Section with Three.js 3D Interactive Sculpture */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden px-4 sm:px-8 lg:px-16 py-12">
        <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              <Sparkles className="h-3 w-3" />
              <span>Michelin 2026 Guide Selection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white">
              An Elevated <br />
              <span className="italic font-normal text-[#d4af37]">Gastronomic Symphony</span> <br />
              In London Mayfair
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/70 font-light">
              Experience modern culinary artistry crafted from wild British produce, rare Japanese coastal delicacies, and a cellar curated across three centuries.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setReservationModal(true)}
                className="rounded-full bg-[#d4af37] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-black transition-transform hover:scale-105"
              >
                Book Your Experience
              </button>
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs sm:text-sm font-medium tracking-wider text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
              >
                <span>Explore Tasting Menu</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <span className="font-serif text-2xl font-normal text-[#d4af37]">3 Stars</span>
                <p className="text-[11px] text-white/60">Gastronomy Award</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-normal text-[#d4af37]">1,400+</span>
                <p className="text-[11px] text-white/60">Cellar Labels</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-normal text-[#d4af37]">100%</span>
                <p className="text-[11px] text-white/60">Wild &amp; Organic</p>
              </div>
            </div>
          </div>

          {/* Three.js Interactive 3D Canvas */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[450px] w-full flex items-center justify-center">
            <div
              ref={threeCanvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              title="Move your cursor to interact with the 3D sculpture"
            />
            <div className="pointer-events-none absolute bottom-4 text-center">
              <span className="text-[10px] tracking-widest uppercase text-white/40">
                ⚡ Interactive 3D Culinary Sculpture · Move cursor to tilt
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Seasonal Menu Section */}
      <section id="menu" className="py-16 px-4 sm:px-8 lg:px-16 border-t border-white/10 bg-[#0e111a]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-widest text-[#d4af37]">Culinary Creations</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-white">Autumn Degustation Menu</h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto">
              Prepared fresh daily under the guidance of Executive Chef Julian Thorne.
            </p>
          </div>

          {/* Category Switcher Pills */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat as any)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === cat
                    ? "bg-[#d4af37] text-black shadow-md"
                    : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems[activeTab].map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 transition-all hover:border-[#d4af37]/50 hover:bg-white/[0.06] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 px-2 py-0.5 text-[10px] font-medium text-[#d4af37]">
                    {item.tag}
                  </span>
                  <span className="font-serif text-base font-semibold text-[#d4af37]">
                    {item.price}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#d4af37] transition-colors">
                  {item.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Reservation Modal */}
      <AnimatePresence>
        {reservationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-[#d4af37]/40 bg-[#121520] p-6 text-white shadow-2xl"
            >
              <button
                onClick={() => setReservationModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-[#d4af37]">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Table Reservation</span>
              </div>
              <h3 className="font-serif text-xl font-light text-white mb-4">Book Your Table at Aura</h3>

              {reservationSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-[#d4af37] mx-auto animate-bounce" />
                  <h4 className="font-serif text-lg font-medium text-white">Table Confirmed!</h4>
                  <p className="text-xs text-white/70">
                    We have reserved your table for {partySize} at {selectedTime}. Confirmation sent to your concierge.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookTable} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Party Size
                    </label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#d4af37]"
                    >
                      <option value="2 Guests" className="bg-[#121520]">2 Guests (Intimate)</option>
                      <option value="4 Guests" className="bg-[#121520]">4 Guests (Standard)</option>
                      <option value="6 Guests" className="bg-[#121520]">6 Guests (Chef&apos;s Table)</option>
                      <option value="8+ Private Salon" className="bg-[#121520]">8+ Guests (Private Salon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Preferred Seating Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["18:00", "19:30", "20:45", "21:30"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`rounded-lg py-1.5 text-xs font-semibold ${
                            selectedTime === t
                              ? "bg-[#d4af37] text-black"
                              : "border border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e5c158] py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:scale-[1.02]"
                  >
                    Confirm Reservation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
