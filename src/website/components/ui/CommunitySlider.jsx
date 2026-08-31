import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSliderImages } from "../../../services/sliderService";

/**
 * CommunitySlider
 *
 * Displays community images in an auto-advancing slider.
 * - Fetches images from the backend on mount.
 * - Renders nothing if no images are available yet.
 * - Supports keyboard navigation and pause on hover.
 */
const CommunitySlider = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSliderImages();
        setImages(res.data || []);
      } catch (err) {
        console.error("CommunitySlider: failed to load images", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [images.length, paused, next]);

  // Don't render anything while loading or if no images
  if (loading || images.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-500 font-medium">
            Our Community
          </span>
          <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
            Life at MCN
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-base lg:text-lg max-w-2xl mx-auto">
            A glimpse into the vibrant community of Muslim Community Network —
            meetings, connections, and moments of growth.
          </p>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden select-none border border-zinc-200 dark:border-zinc-800"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Images */}
          <div className="relative w-full h-[340px] sm:h-[460px] lg:h-[560px] bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img
                  src={images[current]?.imageUrl}
                  alt={images[current]?.title || `MCN Community ${current + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                {/* Caption */}
                {images[current]?.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-white text-lg font-semibold drop-shadow-lg">
                      {images[current].title}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows (only if more than one image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-sm
                  text-white transition-colors
                "
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-sm
                  text-white transition-colors
                "
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === current
                      ? "w-6 h-2.5 bg-[#0C831F]"
                      : "w-2.5 h-2.5 bg-zinc-300/60 dark:bg-white/40 hover:bg-zinc-400 dark:hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Image Count */}
        {images.length > 1 && (
          <p className="text-center text-zinc-500 dark:text-zinc-600 text-xs mt-4">
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </section>
  );
};

export default CommunitySlider;
