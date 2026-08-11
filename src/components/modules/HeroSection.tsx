"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "دخترانه", href: "/products?age=girl" },
  { label: "پسرانه", href: "/products?age=boy" },
  { label: "نوزاد دختر", href: "/products?age=newborn" },
  { label: "نوزاد پسر", href: "/products?age=newborn" },
  { label: "نوجوان", href: "/products?age=pre-teen" },
];

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[560px] md:h-[680px] overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-10">
        <Image
          src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1920&q=80"
          alt="کالکشن جدید"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/55 via-black/15 to-black/20" />

      <div
        className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-14 px-6 text-center"
        dir="rtl"
      >
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          کالکشن جدید
        </h1>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm lg:text-base text-white/90">
          {quickLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && (
                <span aria-hidden className="text-white/40 select-none">
                  |
                </span>
              )}
              <Link
                href={link.href}
                className="font-medium tracking-[0.08em] hover:text-white hover:underline underline-offset-4 transition-colors"
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
