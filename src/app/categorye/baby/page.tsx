'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';

function BabyCategoryContent() {
  const searchParams = useSearchParams();
  
  const urlGender = (searchParams.get('gender') as 'all' | 'girl' | 'boy') || 'all';
  const urlType = searchParams.get('type') || 'all';

  const [activeGender, setActiveGender] = useState<'all' | 'girl' | 'boy'>(urlGender);
  const [activeType, setActiveType] = useState(urlType);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // اضافه کردن استیت محصولات دیتابیس بدون تغییر ظاهر دیزاین
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveGender(urlGender);
    setActiveType(urlType);
  }, [urlGender, urlType]);

  // لود کردن محصولات واقعی از دیتابیسِ خودت
  useEffect(() => {
    async function loadProductsFromDB() {
      try {
        const res = await fetch('/api/products?category=baby', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data)) {
          // مپ کردن محصولات دیتابیس به همون ساختاری که دیزاینت انتظار داره
          const formatted = data.map((p: any) => ({
            id: p.id,
            name: p.title || p.name,
            price: p.price ? `${p.price.toLocaleString()} تومان` : '۰ تومان',
            rawPrice: p.price || 0,
            hasColors: Boolean(p.colors && p.colors.length > 0),
            gender: p.ageGroup || 'girl',
            type: 'dress',
            img1: p.images?.[0] || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop',
            img2: p.images?.[1] || p.images?.[0] || 'https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop',
          }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProductsFromDB();
  }, []);

  let displayedProducts = [...products];
  if (activeGender !== 'all') {
    displayedProducts = displayedProducts.filter(product => product.gender === activeGender);
  }
  if (activeType !== 'all') {
    displayedProducts = displayedProducts.filter(product => product.type === activeType);
  }

  if (sortBy === 'price-asc') displayedProducts.sort((a, b) => a.rawPrice - b.rawPrice);
  else if (sortBy === 'price-desc') displayedProducts.sort((a, b) => b.rawPrice - a.rawPrice);

  return (
    <div className="min-h-screen bg-[#e8f5e9] text-[#1a1a1a] font-sans pb-20" dir="rtl">
      
      <Header />

      {/* عنوان اصلی */}
      <div className="w-full px-4 md:px-12 pt-12 pb-8 flex flex-col items-center justify-center">
        <div className="text-[11px] md:text-xs text-gray-500 flex items-center gap-2 tracking-wide mb-4 font-medium">
          <Link href="/" className="hover:text-black transition-colors uppercase">خانه</Link>
          <span className="text-gray-400">/</span>
          <span className="text-black uppercase">پوشاک نوزاد (۶ ماه تا ۴ سال)</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#15803d] via-[#4ade80] to-[#0ea5e9] drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] px-2 py-1 mb-4">
          <span>🧸</span>
          {activeType === 'dress' ? 'پیراهن و سرهمی' : 
           activeType === 'set' ? 'ست نوزادی' : 
           activeType === 'tshirt' ? 'تی‌شرت و بلوز' : 
           activeType === 'pants' ? 'شلوار و شورت' : 
           activeType === 'knitwear' ? 'ژاکت' : 
           activeType === 'socks' ? 'جوراب و پاپوش' : 'پوشاک نوزاد'}
          <span>🌱</span>
        </h1>
        <span className="text-sm font-bold text-gray-600 bg-white/80 px-5 py-2 rounded-full shadow-sm border border-gray-200">۶ ماه تا ۴ سال</span>
      </div>

      {/* دکمه‌های دخترانه / پسرانه */}
      <div className="w-full flex justify-center mb-10">
        <div className="bg-white border border-gray-200 rounded-full p-1.5 flex gap-1 shadow-sm">
          <button 
            onClick={() => setActiveGender(activeGender === 'girl' ? 'all' : 'girl')}
            className={`px-10 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${activeGender === 'girl' ? 'bg-[#ff6b6b] text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}
          >
            دخترانه
          </button>
          <button 
            onClick={() => setActiveGender(activeGender === 'boy' ? 'all' : 'boy')}
            className={`px-10 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${activeGender === 'boy' ? 'bg-[#4dabf7] text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}
          >
            پسرانه
          </button>
        </div>
      </div>

      {/* نوار فیلتر و مرتب‌سازی */}
      <div className="sticky top-0 z-30 w-full bg-[#f4f7f6]/95 backdrop-blur-md border-y border-gray-200/60 px-4 md:px-12 py-3 shadow-sm">
        <div className="flex justify-between items-center text-[12px]">
          <div className="flex items-center gap-6 md:gap-8">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 font-bold transition-colors ${isFilterOpen ? 'text-[#ff6b6b]' : 'text-gray-800 hover:text-[#ff6b6b]'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              فیلترها
            </button>
            {activeType !== 'all' && (
              <button onClick={() => setActiveType('all')} className="text-red-500 hover:text-red-600 font-bold">نمایش همه دسته‌ها ✕</button>
            )}
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <span className="hidden md:inline-block text-gray-500 font-medium">{displayedProducts.length} محصول</span>
            <div className="relative border-r border-gray-300 pr-4 md:pr-6">
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-transparent border-none outline-none cursor-pointer text-gray-800 font-bold hover:text-[#ff6b6b] transition-colors">
                {sortBy === 'newest' && 'مرتب‌سازی: جدیدترین‌ها'}
                {sortBy === 'price-asc' && 'ارزان‌ترین به گران‌ترین'}
                {sortBy === 'price-desc' && 'گران‌ترین به ارزان‌ترین'}
                <svg className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50">
                  <div onClick={() => { setSortBy('newest'); setIsSortOpen(false); }} className={`px-4 py-3 text-[12px] cursor-pointer hover:bg-gray-50 transition-colors ${sortBy === 'newest' ? 'text-[#ff6b6b] font-bold bg-orange-50/50' : 'text-gray-600 font-medium'}`}>جدیدترین‌ها</div>
                  <div onClick={() => { setSortBy('price-asc'); setIsSortOpen(false); }} className={`px-4 py-3 text-[12px] cursor-pointer hover:bg-gray-50 transition-colors ${sortBy === 'price-asc' ? 'text-[#ff6b6b] font-bold bg-orange-50/50' : 'text-gray-600 font-medium'}`}>ارزان‌ترین به گران‌ترین</div>
                  <div onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }} className={`px-4 py-3 text-[12px] cursor-pointer hover:bg-gray-50 transition-colors ${sortBy === 'price-desc' ? 'text-[#ff6b6b] font-bold bg-orange-50/50' : 'text-gray-600 font-medium'}`}>گران‌ترین به ارزان‌ترین</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isFilterOpen && (
          <div className="w-full bg-white border border-gray-100 rounded-xl p-6 mt-4 shadow-lg flex gap-12">
            <div>
              <h4 className="font-bold mb-3 text-sm text-gray-800">سایز</h4>
              <div className="flex flex-col gap-2 text-xs text-gray-600 font-medium">
                <label className="flex items-center gap-2 cursor-pointer hover:text-black"><input type="checkbox" className="rounded" /> ۶ تا ۱۲ ماه</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-black"><input type="checkbox" className="rounded" /> ۱۲ تا ۲۴ ماه</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-black"><input type="checkbox" className="rounded" /> ۲ تا ۴ سال</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* محصولات */}
      <div className="w-full px-4 md:px-12 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">در حال بارگذاری محصولات...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">محصولی در این دسته‌بندی یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex flex-col group cursor-pointer bg-white rounded-[32px] p-3 border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-full aspect-[3/4] bg-[#f8f8f8] mb-4 rounded-2xl overflow-hidden">
                  <img src={product.img1} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0" />
                  <img src={product.img2} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 transform group-hover:scale-105" />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path></svg>
                  </button>
                </div>
                {product.hasColors && (
                  <div className="flex gap-1.5 mb-2.5 px-1">
                    <div className="w-3 h-3 rounded-full bg-[#d2b48c] border border-gray-200"></div>
                    <div className="w-3 h-3 rounded-full bg-[#5f9ea0] border border-gray-200"></div>
                  </div>
                )}
                {!product.hasColors && <div className="h-[22px]"></div>}
                <div className="flex flex-col px-1 pb-1">
                  <h3 className="text-[13px] text-gray-600 font-bold mb-1.5 line-clamp-1">{product.name}</h3>
                  <p className="text-[16px] font-black text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BabyCategoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen font-bold text-gray-500">در حال بارگذاری...</div>}>
      <BabyCategoryContent />
    </Suspense>
  );
}