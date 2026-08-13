'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MegaMenu from './MegaMenu';
import { SearchModal } from '@/components/modules/SearchModal';
import { useCartStore } from '@/store/useCart';

const promoMessages = [
  '۱۰٪ تخفیف با کد B2510',
  'ارسال رایگان برای خریدهای بالای ۱ میلیون تومان',
  'تعویض و مرجوعی رایگان تا ۳۰ روز',
  'کالکشن جدید پاییزه رسید!',
];

const mobileLinks = [
  { href: '/category/kids', label: 'کودک' },
  { href: '/category/kids?gender=girl', label: 'کودک دخترانه' },
  { href: '/category/kids?gender=boy', label: 'کودک پسرانه' },
  { href: '/category/baby', label: 'نوزاد' },
  { href: '/category/sisooni', label: 'سیسمونی' },
  { href: '/category/preteen', label: 'نوجوان' },
  { href: '/sale', label: 'حراج ویژه', highlight: true },
  { href: '/products', label: 'همه محصولات' },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<'kids' | 'baby' | 'preteen' | 'newborn' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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

  // قفل اسکرول وقتی منوی موبایل باز است
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
      {/* Overlay دسکتاپ برای مگامنو */}
      <div
        className={`fixed inset-0 top-[112px] bg-black/20 z-40 transition-opacity duration-300 ${
          activeMenu ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setActiveMenu(null)}
      />

      {/* Overlay موبایل */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* پنل منوی موبایل */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-[70] md:hidden shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-gray-100">
          <span className="text-2xl font-black text-[#d97757]">کودک</span>
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-3 py-4 overflow-y-auto h-[calc(100%-72px)]">
          {mobileLinks.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors mb-1 ${
                item.highlight
                  ? 'text-[#ff5a00] font-bold hover:bg-orange-50'
                  : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="w-full sticky top-0 z-50 flex flex-col bg-white" dir="rtl">
        {/* نوار پرومو */}
        <div className="bg-[#d97757] text-white text-[11px] md:text-xs font-medium py-2.5 px-4 flex justify-between items-center w-full relative z-50">
          <button onClick={prevPromo} className="hidden md:block px-2 opacity-70 hover:opacity-100 transition-opacity">
            ‹
          </button>
          <div className="flex-1 text-center tracking-wide overflow-hidden flex justify-center items-center h-4">
            <span className={`transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {promoMessages[promoIndex]}
            </span>
          </div>
          <button onClick={nextPromo} className="hidden md:block px-2 opacity-70 hover:opacity-100 transition-opacity">
            ›
          </button>
        </div>

        <header className="w-full border-b border-gray-200 relative z-50 bg-white">
          <div
            className="max-w-[1400px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="flex items-center gap-4 md:gap-10 lg:gap-14 h-full">
              {/* دکمه همبرگر — فقط موبایل */}
              <button
                type="button"
                aria-label="باز کردن منو"
                className="md:hidden w-10 h-10 flex items-center justify-center -mr-1"
                onClick={() => setMobileOpen(true)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link
                href="/"
                className="text-3xl md:text-4xl font-black tracking-tighter mb-1 text-[#d97757] hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              >
                کودک
              </Link>

              {/* نویگیشن دسکتاپ */}
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

                <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu('newborn')}>
                  <Link
                    href="/category/sisooni"
                    className={`text-[14px] transition-colors relative h-full flex items-center ${
                      activeMenu === 'newborn'
                        ? 'text-black font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#d97757]'
                        : 'text-gray-700 hover:text-black font-medium'
                    }`}
                  >
                    سیسمونی
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

                <div className="h-full flex items-center">
                  <Link
                    href="/products"
                    className="text-[14px] font-medium text-gray-700 hover:text-black transition-colors"
                  >
                    همه محصولات
                  </Link>
                </div>

                <MegaMenu type="kids" isOpen={activeMenu === 'kids'} />
                <MegaMenu type="baby" isOpen={activeMenu === 'baby'} />
                <MegaMenu type="preteen" isOpen={activeMenu === 'preteen'} />
                <MegaMenu type="newborn" isOpen={activeMenu === 'newborn'} />
              </nav>
            </div>

            {/* آیکون‌ها */}
            <div className="flex items-center gap-4 md:gap-5 text-gray-700">
              <button type="button" aria-label="جستجو" onClick={() => setSearchOpen(true)} className="hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
              <button type="button" aria-label="علاقه‌مندی‌ها" className="hover:text-black transition-colors hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
              <button type="button" aria-label="حساب کاربری" className="hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="سبد خرید"
                onClick={openCart}
                className="hover:text-black transition-colors relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#d97757] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 99 ? "۹۹+" : cartCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Header;