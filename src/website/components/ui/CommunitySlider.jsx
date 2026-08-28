import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="py-12 lg:py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-10">
          <span className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-medium">
            Our Community
          </span>
          <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-white">
            Life at MCN
          </h2>
          <p className="mt-4 text-zinc-400 text-base lg:text-lg max-w-2xl mx-auto">
            A glimpse into the vibrant community of Muslim Community Network —
            meetings, connections, and moments of growth.
          </p>
        </div>

        {/* Slider Container */}
        <div
          className="relative rounded-3xl overflow-hidden select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Images */}
          <div className="relative w-full h-[340px] sm:h-[460px] lg:h-[560px]">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title || `MCN Community ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Caption */}
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-white text-lg font-semibold drop-shadow-lg">
                      {img.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows (only if more than one image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2 z-20
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-black/50 hover:bg-black/80
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
                  rounded-full bg-black/50 hover:bg-black/80
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
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image Count */}
        {images.length > 1 && (
          <p className="text-center text-zinc-600 text-xs mt-4">
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </section>
  );
};

export default CommunitySlider;
