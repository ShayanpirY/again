'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// محصولات تخفیف‌دار
const saleProducts = [
  { id: 1, name: 'تی‌شرت تابستانه', price: '۳۵۰,۰۰۰ تومان', oldPrice: '۵۰۰,۰۰۰', img1: 'https://images.unsplash.com/photo-1519238380205-0819126cb726?q=80&w=600', img2: 'https://images.unsplash.com/photo-1611428522646-04289895df87?q=80&w=600' },
  { id: 2, name: 'شلوار جین راحتی', price: '۷۵۰,۰۰۰ تومان', oldPrice: '۱,۱۰۰,۰۰۰', img1: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600', img2: 'https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600' },
];

function SaleContent() {
  return (
    // تم رنگی داغ و حراجی (bg-[#fff5f2])
    <div className="min-h-screen bg-[#fff5f2] text-[#1a1a1a] font-sans pb-20" dir="rtl">
      <div className="w-full px-4 md:px-12 pt-20 flex flex-col items-center">
        {/* عنوان فانتزی حراج */}
        <div className="relative inline-flex items-center justify-center gap-3">
          <span className="text-4xl animate-bounce">🔥</span>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] to-[#f97316] drop-shadow-md">
            حراج ویژه
          </h1>
          <span className="text-4xl animate-pulse">⚡</span>
        </div>
        <p className="mt-6 text-gray-600 font-bold text-lg">فرصت را از دست نده! تخفیف‌های باورنکردنی تا ۵۰٪</p>
      </div>

      <div className="w-full px-4 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {saleProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-[32px] p-3 border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.03] transition-all duration-300">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
              <img src={p.img1} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">۵۰٪ تخفیف</div>
            </div>
            <div className="p-2">
              <h3 className="font-bold text-sm text-gray-700">{p.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-lg font-black text-red-600">{p.price}</p>
                <p className="text-xs text-gray-400 line-through">{p.oldPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SalePage() {
  return <Suspense fallback={<div>Loading...</div>}><SaleContent /></Suspense>;
}