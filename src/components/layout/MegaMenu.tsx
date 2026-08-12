'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SubCategory {
  title: string;
  href: string;
  star?: boolean;
}

interface Category {
  id: string;
  title: string;
  hasChildren?: boolean;
  subCategories?: SubCategory[];
}

interface MegaMenuProps {
  type: 'kids' | 'baby' | 'preteen' | 'newborn';
  isOpen: boolean;
}

const menuData: Record<
  string,
  {
    age: string;
    categories: Category[];
    promo1: { title: string; subtitle: string; img: string };
    promo2: { img: string };
  }
> = {
  kids: {
    age: '۲ تا ۱۰ سال',
    promo1: {
      title: 'دخترانه و پسرانه',
      subtitle: 'محبوب‌ترین‌های این ماه',
      img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&h=800&q=80',
    },
    promo2: {
      img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&h=800&q=80',
    },
    categories: [
      { id: 'back-to-school', title: 'بازگشت به مدرسه' },
      { id: 'new-collection', title: 'کالکشن جدید' },
      {
        id: 'clothing',
        title: 'پوشاک',
        hasChildren: true,
        subCategories: [
          { title: 'پیراهن و سرهمی', href: '&type=dress' },
          { title: 'ست‌ها', href: '&type=set', star: true },
          { title: 'تی‌شرت و بلوز', href: '&type=tshirt' },
          { title: 'شلوار و دامن', href: '&type=pants' },
          { title: 'ژاکت و بافت', href: '&type=knitwear' },
          { title: 'لگینگ', href: '&type=legging' },
          { title: 'شلوار جین', href: '&type=jeans' },
          { title: 'کاپشن و پالتو', href: '&type=coat' },
          { title: 'هودی و سویشرت', href: '&type=hoodie' },
        ],
      },
      { id: 'shoes', title: 'کفش' },
      { id: 'accessories', title: 'اکسسوری' },
      { id: 'collections', title: 'مجموعه‌ها' },
    ],
  },
  baby: {
    age: '۶ ماه تا ۴ سال',
    promo1: {
      title: 'نوزاد دختر و پسر',
      subtitle: 'پیشنهادهای ویژه فصل',
      img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&h=800&q=80',
    },
    promo2: {
      img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&h=800&q=80',
    },
    categories: [
      { id: 'back-to-school', title: 'بازگشت به مدرسه' },
      { id: 'new-collection', title: 'کالکشن جدید' },
      {
        id: 'clothing',
        title: 'پوشاک نوزاد',
        hasChildren: true,
        subCategories: [
          { title: 'پیراهن و سرهمی', href: '&type=dress' },
          { title: 'ست نوزادی', href: '&type=set', star: true },
          { title: 'تی‌شرت و بلوز', href: '&type=tshirt' },
          { title: 'شلوار و شورت', href: '&type=pants' },
          { title: 'ژاکت', href: '&type=knitwear' },
          { title: 'جوراب و پاپوش', href: '&type=socks' },
        ],
      },
      { id: 'shoes', title: 'کفش نوزاد' },
      { id: 'accessories', title: 'اکسسوری' },
    ],
  },
  preteen: {
    age: '۸ تا ۱۶ سال',
    promo1: {
      title: 'نوجوان دختر و پسر',
      subtitle: 'استایل‌های برتر فصل',
      img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&h=800&q=80',
    },
    promo2: {
      img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&h=800&q=80',
    },
    categories: [
      { id: 'back-to-school', title: 'بازگشت به مدرسه' },
      { id: 'new-collection', title: 'کالکشن جدید' },
      {
        id: 'clothing',
        title: 'پوشاک نوجوان',
        hasChildren: true,
        subCategories: [
          // آدرس‌های بخش نوجوان اینجا اضافه شد
          { title: 'تی‌شرت و پولوشرت', href: '&type=tshirt' },
          { title: 'پیراهن نوجوان', href: '&type=dress' },
          { title: 'شلوار و هودی', href: '&type=pants' },
          { title: 'لباس ورزشی', href: '&type=sport' },
        ],
      },
      { id: 'shoes', title: 'کفش' },
      { id: 'accessories', title: 'اکسسوری' },
    ],
  },
  newborn: {
    age: '۰ تا ۱۸ ماه',
    promo1: {
      title: 'نوزاد دختر و پسر',
      subtitle: 'محبوب‌ترین‌های این ماه',
      img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&h=800&q=80',
    },
    promo2: {
      img: 'https://images.unsplash.com/photo-1522771930-78848d92871d?auto=format&fit=crop&w=400&h=800&q=80',
    },
    categories: [
      { id: 'new-collection', title: 'کالکشن جدید' },
      { id: 'layette', title: 'سیسمونی' },
      { id: 'maternity-bags', title: 'ساک لوازم نوزاد' },
      {
        id: 'clothing',
        title: 'پوشاک',
        hasChildren: true,
        subCategories: [
          { title: 'بادی و سرهمی', href: '&type=body' },
          { title: 'ست‌های نوزادی', href: '&type=set' },
          { title: 'شلوار و لگ', href: '&type=pants' },
          { title: 'ژاکت و پلیور', href: '&type=knitwear' },
          { title: 'لباس خواب', href: '&type=sleepwear' },
        ],
      },
      {
        id: 'shoes',
        title: 'کفش',
        hasChildren: true,
        subCategories: [
          { title: 'پاپوش نوزادی', href: '&type=booties' },
          { title: 'کفش راحتی', href: '&type=casual' },
        ]
      },
      {
        id: 'accessories',
        title: 'اکسسوری',
        hasChildren: true,
        subCategories: [
          { title: 'کلاه و پیش‌بند', href: '&type=bibs' },
          { title: 'جوراب', href: '&type=socks' },
          { title: 'پتو و روانداز', href: '&type=blankets' },
        ]
      },
      { id: 'collections', title: 'مجموعه‌ها' },
    ],
  },
};

export default function MegaMenu({ type, isOpen }: MegaMenuProps) {
  const [activeTab, setActiveTab] = useState<'girl' | 'boy' | 'essentials'>('girl');
  const [activeCategory, setActiveCategory] = useState<string>('clothing');

  const currentData = menuData[type];
  
  if (!currentData) return null;

  const selectedCat = currentData.categories.find((c) => c.id === activeCategory);

  return (
    <div
      className={`absolute top-full right-6 mt-0 z-50 bg-white shadow-2xl rounded-b-xl border-t border-gray-100 p-8 flex flex-row items-start gap-8 min-w-[850px] transition-all duration-300 ease-out origin-top ${
        isOpen
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible -translate-y-4 pointer-events-none'
      }`}
      dir="rtl"
    >
      <div className="w-64 flex flex-col gap-5 shrink-0 border-l border-gray-100 pl-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('girl')}
            className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-all ${
              activeTab === 'girl'
                ? 'bg-[#d97757] text-white shadow-sm'
                : 'text-gray-500 hover:text-black border border-transparent hover:border-gray-200'
            }`}
          >
            دخترانه
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('boy')}
            className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-all ${
              activeTab === 'boy'
                ? 'bg-[#d97757] text-white shadow-sm'
                : 'text-gray-500 hover:text-black border border-transparent hover:border-gray-200'
            }`}
          >
            پسرانه
          </button>
          
          {type === 'newborn' && (
            <button
              type="button"
              onClick={() => setActiveTab('essentials')}
              className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-all ${
                activeTab === 'essentials'
                  ? 'bg-[#d97757] text-white shadow-sm'
                  : 'text-gray-500 hover:text-black border border-transparent hover:border-gray-200'
              }`}
            >
              لوازم ضروری
            </button>
          )}

          <span className="text-[10px] md:text-[11px] text-gray-400 mr-auto whitespace-nowrap font-medium">
            {currentData.age}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {currentData.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all w-full text-right ${
                  isActive
                    ? 'font-bold text-black bg-gray-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50/50'
                }`}
              >
                <span>{cat.title}</span>
                {cat.hasChildren && <span className="text-lg text-gray-400 font-light leading-none">‹</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-56 flex flex-col gap-3 shrink-0 min-h-[320px] border-l border-gray-100 pl-6">
        {selectedCat?.hasChildren && (
          <div className="flex flex-col gap-2">
            {selectedCat.subCategories?.map((sub, idx) => {
              const linkPath = sub.href.startsWith('&') 
                ? `/category/${type}?gender=${activeTab}${sub.href}` 
                : `/category/${type}?gender=${activeTab}`;

              return (
                <Link className="text-sm text-gray-600 hover:text-black hover:translate-x-[-4px] transition-all py-1.5 flex items-center justify-between group" href={linkPath} key={idx}>
                  <span>{sub.title}</span>
                  {sub.star && <span className="text-amber-400 text-xs">★</span>}
                </Link>
              );
            })}
            
            <Link className="text-sm font-bold text-black pt-4 hover:underline" href={`/category/${type}?gender=${activeTab}`}>
              مشاهده همه
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-5 shrink-0">
        <div className="w-56 h-[320px] rounded-xl overflow-hidden relative shadow-sm group cursor-pointer bg-gray-100">
          <img
            src={currentData.promo1.img}
            alt="Promo 1"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-[10px] tracking-widest opacity-90 mb-1">
              {currentData.promo1.title}
            </span>
            <strong className="text-base font-semibold leading-tight">
              {currentData.promo1.subtitle}
            </strong>
          </div>
        </div>

        <div className="w-40 h-[320px] rounded-xl overflow-hidden relative shadow-sm group cursor-pointer bg-gray-100">
          <img
            src={currentData.promo2.img}
            alt="Promo 2"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </div>
  );
}