"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface Story {
  id: string;
  title: string;
  productId: string;
  productTitle: string;
  price: number;
  slides: string[];
}

const SLIDE_DURATION = 4500;

export default function ProductStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/products?limit=10&sort=best-selling");
        const data: { id: string; title: string; price: number; images: string[] }[] =
          await res.json();
        if (Array.isArray(data)) {
          const mapped = data
            .map((p) => ({
              id: p.id,
              title: p.title,
              productId: p.id,
              productTitle: p.title,
              price: p.price,
              slides: (p.images || []).filter((img) => typeof img === "string" && img.length > 0),
            }))
            .filter((s) => s.slides.length > 0);
          setStories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const closeViewer = useCallback(() => {
    setOpenIndex(null);
    setSlideIndex(0);
  }, []);

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    const story = stories[openIndex];
    if (slideIndex < story.slides.length - 1) {
      setSlideIndex((i) => i + 1);
    } else if (openIndex < stories.length - 1) {
      setOpenIndex((i) => (i === null ? i : i + 1));
      setSlideIndex(0);
    } else {
      setOpenIndex(0);
      setSlideIndex(0);
    }
  }, [openIndex, slideIndex, stories]);

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    if (slideIndex > 0) {
      setSlideIndex((i) => i - 1);
    } else if (openIndex > 0) {
      setOpenIndex((i) => (i === null ? i : i - 1));
      setSlideIndex(stories[openIndex - 1].slides.length - 1);
    } else {
      const last = stories.length - 1;
      setOpenIndex(last);
      setSlideIndex(stories[last].slides.length - 1);
    }
  }, [openIndex, slideIndex, stories]);

  useEffect(() => {
    if (openIndex === null) return;
    const timer = setTimeout(() => {
      goNext();
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [openIndex, slideIndex, goNext]);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, goNext, goPrev, closeViewer]);

  const handleTouch = useCallback(
    (startX: number, endX: number) => {
      const delta = endX - startX;
      if (delta < -40) goNext();
      else if (delta > 40) goPrev();
    },
    [goNext, goPrev]
  );

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-rose-50/60 py-4">
        <div className="container mx-auto px-4 relative">
          <div className="flex gap-5 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="h-20 w-20 rounded-full bg-neutral-200" />
                <div className="h-3 w-16 rounded-full bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  const activeStory = openIndex === null ? null : stories[openIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-rose-50/60 py-4">
      <div aria-hidden className="absolute top-6 left-10 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl" />
      <div aria-hidden className="absolute bottom-4 right-10 h-28 w-28 rounded-full bg-sky-100/70 blur-2xl" />
      <div aria-hidden className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full border-2 border-dashed border-amber-300/60 animate-[spin_35s_linear_infinite]" />

      <style>{`@keyframes storyProgress { from { width: 0% } to { width: 100% } }`}</style>

      <div className="container mx-auto px-4 relative">
        <div
          dir="rtl"
          className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setOpenIndex(index);
                setSlideIndex(0);
              }}
              className="group flex flex-col items-center gap-2.5 flex-shrink-0 w-20 lg:w-24 snap-start"
              aria-label={`مشاهده استوری ${story.productTitle}`}
            >
              <span className="rounded-full bg-gradient-to-tr from-rose-400 via-amber-400 to-sky-400 p-[3px] group-hover:scale-105 transition-transform duration-200">
                <span className="block rounded-full bg-white p-[3px]">
                  <img
                    src={story.slides[0]}
                    alt={story.productTitle}
                    className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover aspect-square"
                  />
                </span>
              </span>
              <span className="w-full text-center text-[11px] lg:text-xs font-semibold text-neutral-700 line-clamp-2 leading-snug">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Viewer */}
      {activeStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          dir="rtl"
          onClick={closeViewer}
        >
          <div
            className="relative w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              const t = e.touches[0];
              (e.currentTarget as HTMLDivElement).dataset.touchX = String(t.clientX);
            }}
            onTouchEnd={(e) => {
              const start = Number((e.currentTarget as HTMLDivElement).dataset.touchX || 0);
              const end = e.changedTouches[0].clientX;
              handleTouch(start, end);
            }}
          >
            {/* Progress bars */}
            <div className="absolute top-3 inset-x-3 z-20 flex gap-1.5">
              {activeStory.slides.map((_, i) => (
                <div key={i} className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden">
                  {i < slideIndex && <div className="h-full bg-white" />}
                  {i === slideIndex && (
                    <div
                      key={`${openIndex}-${slideIndex}`}
                      className="h-full bg-white rounded-full"
                      style={{ animation: `storyProgress ${SLIDE_DURATION}ms linear forwards` }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="بستن استوری"
              className="absolute top-2.5 left-2.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Media */}
            <div className="absolute inset-0">
              <img
                key={`${openIndex}-${slideIndex}`}
                src={activeStory.slides[slideIndex]}
                alt={activeStory.productTitle}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="استوری قبلی"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="استوری بعدی"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Product overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 pt-12">
              <p className="text-white text-sm font-bold line-clamp-1 mb-0.5">
                {activeStory.productTitle}
              </p>
              <p className="text-amber-300 text-base font-extrabold mb-3">
                {activeStory.price.toLocaleString("fa-IR")} تومان
              </p>
              <Link
                href={`/products/${activeStory.productId}`}
                onClick={closeViewer}
                className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-5 py-2.5 text-xs font-bold shadow-lg hover:bg-amber-100 transition-colors"
              >
                مشاهده محصول
                <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
