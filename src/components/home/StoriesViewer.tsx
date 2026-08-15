"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export type StoryItem = {
  id: string;
  title: string;
  mediaUrl: string;
  type: "image" | "video";
  thumbnail?: string;
  badge: string | null;
  isActive: boolean;
  order: number;
  productId: string;
  productTitle: string;
  productPrice: number;
};

const SLIDE_DURATION = 5000;

function StoryMedia({ story }: { story: StoryItem }) {
  const [mediaFallback, setMediaFallback] = useState(false);
  const [videoBroken, setVideoBroken] = useState(false);

  if (story.type === "video" && !videoBroken) {
    return (
      <video
        src={story.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        poster={story.thumbnail}
        onError={() => setVideoBroken(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  if (mediaFallback || videoBroken) {
    if (!story.thumbnail) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL types (base64/external) bypass the optimizer
      <img
        src={story.thumbnail}
        alt={story.title}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL types (base64/external) bypass the optimizer
    <img
      src={story.mediaUrl}
      alt={story.title}
      onError={() => setMediaFallback(true)}
      className="h-full w-full object-cover"
    />
  );
}

export function StoriesViewer({
  stories,
  initialIndex,
  onClose,
}: {
  stories: StoryItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const story = stories[index];

  const goNext = useCallback(() => {
    if (index < stories.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [index, stories.length, onClose]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      goNext();
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goNext, goPrev]);

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      dir="rtl"
      onClick={onClose}
    >
      <style>{`@keyframes storyProgress { from { width: 0% } to { width: 100% } }`}</style>

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
          if (end - start < -40) goNext();
          else if (end - start > 40) goPrev();
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-3 inset-x-3 z-20 flex gap-1.5">
          <div
            key={story.id}
            className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden"
          >
            <div
              className="h-full bg-[#d97757] rounded-full"
              style={{ animation: `storyProgress ${SLIDE_DURATION}ms linear forwards` }}
            />
          </div>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن استوری"
          className="absolute top-2.5 left-2.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media */}
        <div className="absolute inset-0 bg-neutral-950">
          <StoryMedia key={story.id} story={story} />
        </div>

        {/* Prev / Next */}
        {index > 0 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="استوری قبلی"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        {index < stories.length - 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="استوری بعدی"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Product overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 pt-12">
          {story.badge && (
            <span className="mb-2 inline-block rounded-full bg-[#d97757] px-3 py-1 text-[11px] font-bold text-white">
              {story.badge}
            </span>
          )}
          <p className="text-white text-sm font-bold line-clamp-1 mb-0.5">
            {story.productTitle}
          </p>
          <p className="text-amber-300 text-base font-extrabold mb-3">
            {story.productPrice.toLocaleString("fa-IR")} تومان
          </p>
          <Link
            href={`/products/${story.productId}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-5 py-2.5 text-xs font-bold shadow-lg hover:bg-orange-100 transition-colors"
          >
            مشاهده محصول
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
