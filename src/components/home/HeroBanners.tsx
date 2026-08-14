'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroBanners() {
  return (
    <section className="w-full flex flex-col bg-white" dir="rtl">
      
      {/* =========================================
          بخش اول: بنر اصلی 
      ========================================= */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group">
        <img
          src="/images/back-to-school.jpg"
          alt="شیک بپوش"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10s] ease-out group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 text-white z-10 px-4">
          {/* متن شیک بپوش با فونت بزرگ‌تر، ضخیم‌تر و سایه جذاب‌تر */}
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            شیک بپوش
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-[10px] md:text-[11px] font-bold tracking-widest uppercase drop-shadow-md">
            <Link href="/category/kids?gender=girl" className="hover:text-gray-300 transition-colors">دخترانه</Link>
            <Link href="/category/kids?gender=boy" className="hover:text-gray-300 transition-colors">پسرانه</Link>
            <Link href="/category/baby?gender=girl" className="hover:text-gray-300 transition-colors">نوزاد دختر</Link>
            <Link href="/category/baby?gender=boy" className="hover:text-gray-300 transition-colors">نوزاد پسر</Link>
            <Link href="/category/preteen?gender=girl" className="hover:text-gray-300 transition-colors">نوجوان دختر</Link>
            <Link href="/category/preteen?gender=boy" className="hover:text-gray-300 transition-colors">نوجوان پسر</Link>
          </div>
        </div>
      </div>

      {/* =========================================
          بخش دوم: دو بنر کنار هم (T-shirts & Pants)
      ========================================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-1 bg-white mt-1">
        
        {/* بنر سمت راست: تی‌شرت */}
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden group">
          <Link
            href="/category/kids?type=tshirt"
            aria-label="مشاهده تی‌شرت‌ها"
            className="absolute inset-0 z-[5] block cursor-pointer"
          >
            <img
              src="/images/t-shirts.jpg"
              alt="تی‌شرت"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10s] ease-out group-hover:scale-105"
            />
          </Link>
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30 pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white z-10 px-4 pointer-events-none">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 tracking-wide drop-shadow-md">
              تی‌شرت
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-[10px] font-bold tracking-widest uppercase">
              <Link href="/category/kids?gender=girl&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">دخترانه</Link>
              <Link href="/category/kids?gender=boy&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">پسرانه</Link>
              <Link href="/category/baby?gender=girl&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">نوزاد دختر</Link>
              <Link href="/category/baby?gender=boy&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">نوزاد پسر</Link>
              <Link href="/category/preteen?gender=girl&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">نوجوان دختر</Link>
              <Link href="/category/preteen?gender=boy&type=tshirt" className="hover:text-gray-300 transition-colors pointer-events-auto">نوجوان پسر</Link>
            </div>
          </div>
        </div>

        {/* بنر سمت چپ: شلوار */}
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden group">
          <Link
            href="/category/kids?type=pants"
            aria-label="مشاهده شلوارها"
            className="absolute inset-0 z-[5] block cursor-pointer"
          >
            <img
              src="/images/pants.jpg"
              alt="شلوار"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10s] ease-out group-hover:scale-105"
            />
          </Link>
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30 pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white z-10 px-4 pointer-events-none">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 tracking-wide drop-shadow-md">
              شلوار
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-[10px] font-bold tracking-widest uppercase">
              <Link href="/category/kids?gender=girl&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">دخترانه</Link>
              <Link href="/category/kids?gender=boy&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">پسرانه</Link>
              <Link href="/category/baby?gender=girl&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">نوزاد دختر</Link>
              <Link href="/category/baby?gender=boy&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">نوزاد پسر</Link>
              <Link href="/category/preteen?gender=girl&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">نوجوان دختر</Link>
              <Link href="/category/preteen?gender=boy&type=pants" className="hover:text-gray-300 transition-colors pointer-events-auto">نوجوان پسر</Link>
            </div>
          </div>
        </div>

      </div>

     {/* =========================================
          بخش سوم: بنر کالکشن جدید
      ========================================= */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group mt-1 bg-[#f1ece5]">
        <img
          src="/images/new-collection.jpg"
          alt="کالکشن جدید"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 text-white z-10 px-4">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 opacity-90 drop-shadow-md">
            پیشگامِ ترندها باشید!
          </span>
          <h2 className="text-4xl md:text-5xl font-normal mb-8 tracking-wide drop-shadow-lg">
            کالکشن جدید
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-[10px] md:text-[11px] font-bold tracking-widest uppercase drop-shadow-md">
            <Link href="/category/sisooni?gender=girl" className="hover:text-gray-300 transition-colors">سیسمونی دخترانه</Link>
            <Link href="/category/sisooni?gender=boy" className="hover:text-gray-300 transition-colors">سیسمونی پسرانه</Link>
            <Link href="/category/baby?gender=girl" className="hover:text-gray-300 transition-colors">نوزاد دختر</Link>
            <Link href="/category/baby?gender=boy" className="hover:text-gray-300 transition-colors">نوزاد پسر</Link>
            <Link href="/category/kids?gender=girl" className="hover:text-gray-300 transition-colors">دخترانه</Link>
            <Link href="/category/kids?gender=boy" className="hover:text-gray-300 transition-colors">پسرانه</Link>
            <Link href="/category/preteen?gender=girl" className="hover:text-gray-300 transition-colors">نوجوان دختر</Link>
            <Link href="/category/preteen?gender=boy" className="hover:text-gray-300 transition-colors">نوجوان پسر</Link>
          </div>
        </div>
      </div>

      {/* =========================================
          بخش چهارم: گرید ۴ ستونه
      ========================================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-white mt-1">
        
        {/* ستون ۱ */}
        <Link href="/category/unisex" className="relative w-full h-[450px] lg:h-[550px] overflow-hidden group">
          <img src="/images/unisex.jpg" alt="لباس مشترک" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-white z-10 flex flex-col items-start text-right">
            <span className="text-[10px] md:text-[11px] tracking-widest font-bold mb-1 opacity-90 uppercase">لباس مشترک</span>
            <strong className="text-xl md:text-2xl font-normal drop-shadow-md">برای همه</strong>
          </div>
        </Link>

        {/* ستون ۲ */}
        <Link href="/category/sisooni?gender=boy" className="relative w-full h-[450px] lg:h-[550px] overflow-hidden group">
          <img src="/images/newborn-boy-layette.jpg" alt="سیسمونی پسرانه" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-white z-10 flex flex-col items-start text-right">
            <span className="text-[10px] md:text-[11px] tracking-widest font-bold mb-1 opacity-90 uppercase">سیسمونی پسرانه</span>
            <strong className="text-xl md:text-2xl font-normal drop-shadow-md">سیسمونی</strong>
          </div>
        </Link>

        {/* ستون ۳ */}
        <Link href="/category/sisooni?gender=girl" className="relative w-full h-[450px] lg:h-[550px] overflow-hidden group">
          <img src="/images/newborn-girl-layette.jpg" alt="سیسمونی دخترانه" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-white z-10 flex flex-col items-start text-right">
            <span className="text-[10px] md:text-[11px] tracking-widest font-bold mb-1 opacity-90 uppercase">سیسمونی دخترانه</span>
            <strong className="text-xl md:text-2xl font-normal drop-shadow-md">سیسمونی</strong>
          </div>
        </Link>

        {/* ستون ۴ */}
        <Link href="/category/accessories" className="relative w-full h-[450px] lg:h-[550px] overflow-hidden group">
          <img src="/images/maternity-accessories.jpg" alt="اکسسوری‌های مادر و نوزاد" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-white z-10 flex flex-col items-start text-right">
            <strong className="text-xl md:text-2xl font-normal drop-shadow-md pb-1">اکسسوری‌های مادر و نوزاد</strong>
          </div>
        </Link>

      </div>
    </section>
  );
}