"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface Story {
  id: string;
  title: string;
  mediaUrl: string;
  badge: string | null;
  productId: string;
  productTitle: string;
  price: number;
  productImage: string;
}

const SLIDE_DURATION = 4500;

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i;

const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

export default function ProductStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const data: {
          id: string;
          title: string;
          mediaUrl: string;
          badge: string | null;
          product: {
            id: string;
            title: string;
            price: number;
            images: string[];
          };
        }[] = await res.json();
        if (Array.isArray(data)) {
          const mapped = data
            .filter((s) => s.mediaUrl && s.product)
            .map((s) => ({
              id: s.id,
              title: s.title,
              mediaUrl: s.mediaUrl,
              badge: s.badge,
              productId: s.product.id,
              productTitle: s.product.title,
              price: s.product.price,
              productImage:
                s.product.images && s.product.images.length > 0
                  ? s.product.images[0]
                  : "",
            }));
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
  }, []);

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((i) => (i === null ? i : (i + 1) % stories.length));
  }, [openIndex, stories.length]);

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((i) =>
      i === null ? i : (i - 1 + stories.length) % stories.length
    );
  }, [openIndex, stories.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const timer = setTimeout(() => {
      goNext();
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [openIndex, goNext]);

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
      <section className="bg-white py-4 border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-hidden justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 animate-pulse">
                <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-neutral-100 ring-1 ring-neutral-200" />
                <div className="h-3 w-16 rounded-full bg-neutral-100" />
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

  const bubbleImage = (story: Story) =>
    isVideoUrl(story.mediaUrl) ? story.productImage : story.mediaUrl;

  return (
    <section className="bg-white py-6 border-b border-neutral-100">
      <style>{`@keyframes storyProgress { from { width: 0% } to { width: 100% } }`}</style>

      <div className="container mx-auto px-4">
        <div
          dir="rtl"
          className="flex gap-4 lg:gap-7 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group flex flex-col items-center gap-2.5 flex-shrink-0 w-20 lg:w-24 snap-start"
              aria-label={`مشاهده استوری ${story.title}`}
            >
              <span className="rounded-full ring-1 ring-neutral-200 p-0.5 transition-transform duration-300 group-hover:scale-105 group-hover:ring-neutral-400">
                <img
                  src={bubbleImage(story)}
                  alt={story.title}
                  className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover aspect-square"
                />
              </span>
              <span className="w-full text-center text-[11px] lg:text-xs font-medium text-neutral-600 line-clamp-2 leading-snug group-hover:text-neutral-900 transition-colors">
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
            {/* Progress bar */}
            <div className="absolute top-3 inset-x-3 z-20 flex gap-1.5">
              <div key={activeStory.id} className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ animation: `storyProgress ${SLIDE_DURATION}ms linear forwards` }}
                />
              </div>
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
              {isVideoUrl(activeStory.mediaUrl) ? (
                <video
                  key={activeStory.id}
                  src={activeStory.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  key={activeStory.id}
                  src={activeStory.mediaUrl}
                  alt={activeStory.title}
                  className="h-full w-full object-cover"
                />
              )}
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
              {activeStory.badge && (
                <span className="mb-2 inline-block rounded-full bg-rose-500 px-3 py-1 text-[11px] font-bold text-white">
                  {activeStory.badge}
                </span>
              )}
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
