"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] min-h-[550px] overflow-hidden bg-slate-900">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-300/80 blur-3xl" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-sky-300/80 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-2/3 bg-amber-200/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-1/3 h-2/3 bg-emerald-200/80 blur-3xl" />
      </div>

      <div className="absolute inset-0 z-10 w-full h-full mix-blend-multiply opacity-85">
        <Image
          src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1920&auto=format&fit=crop"
          alt="کالکشن لباس کودک و نوزاد"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 z-20 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />

      <div className="relative z-30 max-w-7xl mx-auto h-full px-6 flex items-center justify-end" dir="rtl">
        <div className="text-right text-white max-w-xl space-y-5">
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight drop-shadow-xl">
            کالکشن جدید
          </h1>

          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed drop-shadow">
            استایل‌های مدرن و دوست‌داشتنی برای نوزادان، کودکان و نوجوانان
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-white text-slate-900 hover:bg-sky-500 hover:text-white px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 shadow-2xl hover:shadow-sky-500/30 group"
            >
              <span>مشاهده کالکشن جدید</span>
              <span className="group-hover:-translate-x-1 transition-transform duration-300">
                ←
              </span>
            </Link>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-2.5 z-30 bg-gradient-to-r from-rose-500 via-sky-400 via-amber-400 via-emerald-400 to-purple-500" />
    </section>
  );
};
