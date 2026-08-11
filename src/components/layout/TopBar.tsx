"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const topBarAnnouncements = [
  "ارسال رایگان برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان",
  "بازگشت رایگان کالا تا ۷ روز",
  "کالکشن جدید پاییز و زمستان از راه رسید",
  "حراج ویژه با تخفیف تا ۵۰٪",
];

export function TopBar() {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((index) => (index + 1) % topBarAnnouncements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () =>
    setAnnouncementIndex(
      (index) => (index - 1 + topBarAnnouncements.length) % topBarAnnouncements.length
    );
  const goToNext = () =>
    setAnnouncementIndex((index) => (index + 1) % topBarAnnouncements.length);

  return (
    <div className="w-full bg-rose-900 text-white">
      <div className="mx-auto max-w-7xl">
        <div
          dir="rtl"
          className="flex h-8 items-center justify-between px-8 text-xs"
        >
          <div className="flex flex-1" aria-hidden="true" />

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="پیام قبلی"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <p
              key={announcementIndex}
              className="max-w-[160px] truncate font-medium animate-in fade-in sm:max-w-[340px]"
            >
              {topBarAnnouncements[announcementIndex]}
            </p>
            <button
              type="button"
              onClick={goToNext}
              aria-label="پیام بعدی"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <Link
              href="/loyalty"
              className="flex items-center gap-1 font-medium transition-colors hover:text-white/80"
            >
              باشگاه مشتریان ↖
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
