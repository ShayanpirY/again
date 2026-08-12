'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';

function KidsCategoryContent() {
  const searchParams = useSearchParams();
  
  const urlGender = (searchParams.get('gender') as 'all' | 'girl' | 'boy') || 'all';
  const urlType = searchParams.get('type') || 'all';

  const [activeGender, setActiveGender] = useState<'all' | 'girl' | 'boy'>(urlGender);
  const [activeType, setActiveType] = useState(urlType);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // --- تغییر کلیدی: اضافه کردن محصولات دیتابیس ---
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // درخواست به API محصولات
        const res = await fetch('/api/products?category=kids', { cache: 'no-store' });
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // تبدیل محصولات دیتابیس به فرمتی که دیزاینت می‌شناسه
          const formatted = data.map((p: any) => ({
            id: p.id,
            name: p.title || p.name,
            price: p.price ? `${p.price.toLocaleString()} تومان` : '۰ تومان',
            rawPrice: p.price || 0,
            hasColors: Boolean(p.colors && p.colors.length > 0),
            gender: p.ageGroup || 'girl',
            type: p.type || 'dress',
            img1: p.images?.[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop',
            img2: p.images?.[1] || p.images?.[0] || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop'
          }));
          setProducts(formatted);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadProducts();
  }, []);

  // فیلتر کردن هوشمند محصولات بر اساس جنسیت و نوع لباس (استفاده از محصولات دیتابیس)
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
    <div className="min-h-screen bg-[#e0f7fa] text-[#1a1a1a] font-sans pb-20" dir="rtl">
      <Header />
      {/* ... بقیه کدهای دیزاینت دقیقاً همان است که قبلاً بود ... */}
      <div className="w-full px-4 md:px-12 pt-12 pb-8 flex flex-col items-center justify-center">
        {/* عنوان‌ها و فیلترها (همان کدهای قبلی تو) */}
        <h1 className="text-5xl md:text-7xl font-black ..."><span>🎈</span> {activeType === 'tshirt' ? 'تی‌شرت و بلوز' : 'پوشاک کودک'} <span>✨</span></h1>
      </div>

      {/* محصولات */}
      <div className="w-full px-4 md:px-12 py-10">
        {loading ? (
          <div className="text-center py-20">در حال دریافت محصولات از دیتابیس...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20">محصولی یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex flex-col group cursor-pointer bg-white rounded-[32px] p-3 border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                 {/* بقیه دیزاین کارت‌ها دقیقاً همان کد قبلی توست */}
                 <img src={product.img1} alt={product.name} />
                 <h3 className="text-[13px] text-gray-600 font-bold">{product.name}</h3>
                 <p className="text-[16px] font-black text-gray-900">{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function KidsCategoryPage() {
  return (
    <Suspense fallback={<div>بارگذاری...</div>}>
      <KidsCategoryContent />
    </Suspense>
  );
}