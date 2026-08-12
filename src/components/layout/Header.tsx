'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MegaMenu from './MegaMenu';

const promoMessages = [
  '۱۰٪ تخفیف با کد B2510',
  'ارسال رایگان برای خریدهای بالای ۱ میلیون تومان',
  'تعویض و مرجوعی رایگان تا ۳۰ روز',
  'کالکشن جدید پاییزه رسید!',
];

export function Header() {
  // تایپ newborn رو به استیت اضافه کردیم تا هدر بشناسدش
  const [activeMenu, setActiveMenu] = useState<'kids' | 'baby' | 'preteen' | 'newborn' | null>(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPromoIndex((prev) => (prev + 1) % promoMessages.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextPromo = () => {
    setFade(false);
    setTimeout(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
      setFade(true);
    }, 300);
  };

  const prevPromo = () => {
    setFade(false);
    setTimeout(() => {
      setPromoIndex((prev) => (prev - 1 + promoMessages.length) % promoMessages.length);
      setFade(true);
    }, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 top-[112px] bg-black/20 z-40 transition-opacity duration-300 ${
          activeMenu ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setActiveMenu(null)}
      />

      <div className="w-full sticky top-0 z-50 flex flex-col bg-white" dir="rtl">
        {/* نوار اطلاع‌رسانی لایو (Live Carousel) */}
        <div className="bg-[#d97757] text-white text-[11px] md:text-xs font-medium py-2.5 px-4 flex justify-between items-center w-full relative z-50">
          <button onClick={prevPromo} className="hidden md:block px-2 opacity-70 hover:opacity-100 transition-opacity">
            ‹
          </button>

          <div className="flex-1 text-center tracking-wide overflow-hidden flex justify-center items-center h-4">
            <span
              className={`transition-opacity duration-500 ease-in-out ${
                fade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {promoMessages[promoIndex]}
            </span>
          </div>

          <button onClick={nextPromo} className="hidden md:block px-2 opacity-70 hover:opacity-100 transition-opacity">
            ›
          </button>
        </div>

        <header className="w-full border-b border-gray-200 relative z-50 bg-white">
          <div
            className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="flex items-center gap-10 lg:gap-14 h-full">
              {/* لوگوی فانتزی «کودک» */}
              <Link
                href="/"
                className="text-4xl font-black tracking-tighter mb-1 text-[#d97757] hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                کودک
              </Link>

              {/* کانتینر اصلی نویگیشن */}
              <nav
                className="hidden md:flex items-center gap-7 h-full relative"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu('kids')}>
                  <Link
                    href="/category/kids"
                    className={`text-[14px] transition-colors relative h-full flex items-center ${
                      activeMenu === 'kids'
                        ? 'text-black font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#d97757]'
                        : 'text-gray-700 hover:text-black font-medium'
                    }`}
                  >
                    کودک
                  </Link>
                </div>

                <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu('baby')}>
                  <Link
                    href="/category/baby"
                    className={`text-[14px] transition-colors relative h-full flex items-center ${
                      activeMenu === 'baby'
                        ? 'text-black font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#d97757]'
                        : 'text-gray-700 hover:text-black font-medium'
                    }`}
                  >
                    نوزاد
                  </Link>
                </div>

                {/* استایل اکتیو و رویداد هاور برای تازه متولد شده اضافه شد */}
                <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu('newborn')}>
                  <Link
                    href="/category/newborn"
                    className={`text-[14px] transition-colors relative h-full flex items-center ${
                      activeMenu === 'newborn'
                        ? 'text-black font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#d97757]'
                        : 'text-gray-700 hover:text-black font-medium'
                    }`}
                  >
                    تازه متولد شده
                  </Link>
                </div>

                <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu('preteen')}>
                  <Link
                    href="/category/preteen"
                    className={`text-[14px] transition-colors relative h-full flex items-center ${
                      activeMenu === 'preteen'
                        ? 'text-black font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#d97757]'
                        : 'text-gray-700 hover:text-black font-medium'
                    }`}
                  >
                    نوجوان
                  </Link>
                </div>

                <div className="h-full flex items-center">
                  <Link
                    href="/sale"
                    className="text-[14px] font-bold text-[#ff5a00] hover:text-[#e04f00] transition-colors"
                  >
                    حراج ویژه
                  </Link>
                </div>

                {/* مگامنوها در سطح نویگیشن */}
                <MegaMenu type="kids" isOpen={activeMenu === 'kids'} />
                <MegaMenu type="baby" isOpen={activeMenu === 'baby'} />
                <MegaMenu type="preteen" isOpen={activeMenu === 'preteen'} />
                {/* فراخوانی مگامنوی جدید */}
                <MegaMenu type="newborn" isOpen={activeMenu === 'newborn'} />
              </nav>
            </div>

            <div className="flex items-center gap-5 text-gray-700">
              <button type="button" aria-label="جستجو" className="hover:text-black transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
              <button type="button" aria-label="علاقه‌مندی‌ها" className="hover:text-black transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
              <button type="button" aria-label="حساب کاربری" className="hover:text-black transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button type="button" aria-label="سبد خرید" className="hover:text-black transition-colors relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="absolute -top-1.5 -right-2 bg-white border border-gray-300 text-[#d97757] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  ۰
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default Header;