"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[550px] overflow-hidden bg-slate-900">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-300/80 blur-3xl" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-sky-300/80 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-2/3 bg-amber-200/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-1/3 h-2/3 bg-emerald-200/80 blur-3xl" />
      </div>

      <div className="absolute inset-0 z-10 w-full h-full opacity-90">
        <Image
          src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1920&q=80"
          alt="کودکان شاد با لباس‌های مد روز"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 z-20 bg-gradient-to-l from-black/20 via-transparent to-transparent" />

      <div className="relative z-30 max-w-7xl mx-auto h-full px-6 flex items-center justify-end" dir="rtl">
        <div className="text-right max-w-md space-y-4 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl p-6 mr-8 md:mr-16 my-auto">

          <span className="inline-flex items-center gap-2 rounded-full bg-rose-500 text-white px-4 py-1.5 text-[11px] font-bold shadow-md shadow-rose-300">
            ✨ بهار و تابستان ۱۴۰۵
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-neutral-900">
            کالکشن جدید
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
            استایل‌های مدرن و دوست‌داشتنی برای نوزادان، کودکان و نوجوانان
          </p>

          <div className="pt-1">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 group"
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
