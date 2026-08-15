"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { StoriesViewer, type StoryItem } from "./StoriesViewer";

export function StoriesBarContent({ stories }: { stories: StoryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section dir="rtl" className="w-full bg-white border-b border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`مشاهده استوری ${story.title}`}
              className="group flex flex-col items-center gap-2 flex-shrink-0 w-[76px]"
            >
              <span className="relative rounded-full p-[3px] bg-gradient-to-tr from-[#d97757] via-[#e8915f] to-[#f5b896] transition-transform duration-300 group-hover:scale-105">
                <span className="block rounded-full p-[3px] bg-white">
                  <span className="block w-[62px] h-[62px] rounded-full overflow-hidden bg-neutral-100 ring-1 ring-neutral-200">
                    {story.type === "video" ? (
                      <video
                        src={story.mediaUrl}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={story.mediaUrl}
                        alt={story.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                </span>
                {story.type === "video" && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                    <Play className="h-3 w-3 fill-current" />
                  </span>
                )}
                {story.badge && (
                  <span className="absolute top-0 right-0 rounded-full bg-[#d97757] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    {story.badge}
                  </span>
                )}
              </span>
              <span className="w-full text-center text-[11px] font-medium text-neutral-700 leading-snug truncate group-hover:text-neutral-900 transition-colors">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <StoriesViewer
          stories={stories}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
