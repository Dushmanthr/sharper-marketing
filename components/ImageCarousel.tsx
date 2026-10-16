"use client";

import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/images/hero-marketing-team.jpg",
    alt: "Sharper Labs Marketing consultancy team in London office reviewing growth dashboard",
    pos: "object-center",
  },
  {
    src: "/images/hero-data-analytics.jpg",
    alt: "Senior digital marketing strategist analyzing global performance analytics and search data",
    pos: "object-center",
  },
  {
    src: "/images/hero-brand-design.jpg",
    alt: "Brand marketing and UI/UX design strategists collaborating on campaign prototypes",
    pos: "object-center",
  },
];

const SLIDE_DURATION = 4200; // ms, must match the interval below
const ZOOM_SCALE = 1.08;
const SWIPE_DISTANCE_THRESHOLD = 50; // px
const SWIPE_VELOCITY_THRESHOLD = 300; // px/s

export default function ImageCarousel({ fill = false }: { fill?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startAutoplay = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoplay();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startAutoplay();
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    startAutoplay();
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      goToNext();
    } else if (offset.x > SWIPE_DISTANCE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      goToPrevious();
    }
  };

  return (
    <div
      className={
        fill
          ? "relative h-full w-full overflow-hidden"
          : "relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      }
    >
      <motion.div
        className={
          fill
            ? "relative h-full w-full cursor-grab active:cursor-grabbing"
            : "relative aspect-4/5 cursor-grab active:cursor-grabbing sm:aspect-video lg:aspect-21/9"
        }
        style={{ touchAction: "pan-y" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <motion.div
                key={isActive ? `zoom-${currentIndex}` : "idle"}
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? ZOOM_SCALE : 1 }}
                transition={{ duration: (SLIDE_DURATION + 800) / 1000, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover ${slide.pos}`}
                  draggable={false}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <motion.button
        type="button"
        onClick={goToPrevious}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        suppressHydrationWarning
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-navy-900 shadow-md backdrop-blur transition-colors hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      <motion.button
        type="button"
        onClick={goToNext}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        suppressHydrationWarning
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-navy-900 shadow-md backdrop-blur transition-colors hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToIndex(index)}
            suppressHydrationWarning
            className="flex cursor-pointer items-center justify-center p-2"
            aria-label={`Show slide ${index + 1}`}
          >
            <span
              aria-hidden
              className={`block h-2.5 rounded-full transition-all ${
                index === currentIndex ? "w-6 bg-orange-400" : "w-2.5 bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
