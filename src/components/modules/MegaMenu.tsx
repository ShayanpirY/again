"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { megaMenuData } from "@/data/mega-menu";

export type MegaMenuCategoryKey = "baby" | "newborn" | "pre-teen";

type Gender = "girl" | "boy";

interface MegaMenuChild {
  name: string;
  href: string;
}

interface PrimaryCategory {
  key: string;
  label: string;
  href: string;
  children: MegaMenuChild[];
}

interface Promo {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

interface MegaMenuProps {
  categoryKey: MegaMenuCategoryKey;
  ageLabel?: string;
}

const productsLink = (params: Record<string, string>): string => {
  const search = new URLSearchParams(params).toString();
  return `/products?${search}`;
};

const categoryLink = (slug: string) => productsLink({ category: slug });
const sortLink = (value: string) => productsLink({ sort: value });
const seasonLink = (value: string) => productsLink({ season: value });
const fabricLink = (value: string) => productsLink({ fabric: value });

type MenuData = (typeof megaMenuData)[keyof typeof megaMenuData];

const resolveData = (categoryKey: MegaMenuCategoryKey, gender: Gender): MenuData => {
  if (categoryKey === "baby") return megaMenuData[gender];
  return megaMenuData[categoryKey];
};

const promoImages: Record<MegaMenuCategoryKey, string> = {
  newborn:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
  baby:
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop",
  "pre-teen":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
};

const buildPrimaryCategories = (data: MenuData): PrimaryCategory[] => [
  {
    key: "back-to-school",
    label: "بازگشت به مدرسه",
    href: categoryLink("شلوار"),
    children: [
      { name: "لباس مدرسه", href: categoryLink("شلوار") },
      { name: "پیراهن و بلوز", href: categoryLink("تیشرت-و-بلوز") },
      { name: "کفش مدرسه", href: categoryLink("کفش-کتانی") },
      { name: "کیف و کوله", href: categoryLink("کیف") },
    ],
  },
  {
    key: "new-collection",
    label: "کالکشن جدید",
    href: sortLink("newest"),
    children: [
      { name: "جدیدترین‌ها", href: sortLink("newest") },
      { name: "پوشاک ارگانیک", href: fabricLink("پنبه") },
      { name: "کالکشن تابستان", href: seasonLink("تابستان") },
      { name: "کالکشن پاییز", href: seasonLink("پاییز") },
    ],
  },
  {
    key: "clothing",
    label: "پوشاک",
    href: data.clothing[0]?.href ?? "/products",
    children: data.clothing,
  },
  {
    key: "shoes",
    label: "کفش",
    href: data.shoesAccessories[0]?.href ?? "/products",
    children: data.shoesAccessories,
  },
  {
    key: "collections",
    label: "مجموعه‌ها",
    href: data.collections[0]?.href ?? "/products",
    children: data.collections,
  },
];

export function MegaMenu({ categoryKey, ageLabel }: MegaMenuProps) {
  const [gender, setGender] = useState<Gender>("girl");
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("clothing");

  const data = resolveData(categoryKey, gender);
  const categories = buildPrimaryCategories(data);
  const activeCategory =
    categories.find((c) => c.key === activeCategoryKey) ?? categories[0];

  const dataKey = categoryKey === "baby" ? gender : categoryKey;
  const banner = megaMenuData[dataKey].banner;

  const promos: Promo[] = [
    {
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      href: banner.href,
    },
    {
      title: "جدیدترین کالکشن",
      subtitle: "تازه‌های این فصل",
      image: promoImages[categoryKey],
      href: sortLink("newest"),
    },
  ];

  return (
    <div
      dir="rtl"
      className="absolute top-full right-0 left-0 z-50 mt-1"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          
          {/* ========== ستون ۱: دسته‌بندی‌های اصلی ========== */}
          <div className="w-[280px] shrink-0 border-l border-gray-100 bg-gray-50/70 p-5">
            {/* تب‌های دخترانه / پسرانه */}
            <div className="mb-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGender("girl")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    gender === "girl"
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "border border-gray-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  دخترانه
                </button>
                <button
                  type="button"
                  onClick={() => setGender("boy")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    gender === "boy"
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "border border-gray-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  پسرانه
                </button>
              </div>
              {ageLabel && (
                <span className="text-xs text-neutral-500">{ageLabel}</span>
              )}
            </div>

            {/* لیست دسته‌ها */}
            <nav className="flex flex-col gap-0.5">
              {categories.map((category) => {
                const isActive = activeCategoryKey === category.key;
                return (
                  <div
                    key={category.key}
                    onMouseEnter={() => setActiveCategoryKey(category.key)}
                  >
                    <Link
                      href={category.href}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] transition-all ${
                        isActive
                          ? "bg-white font-semibold text-neutral-900 shadow-sm"
                          : "text-neutral-700 hover:bg-white/70 hover:text-neutral-900"
                      }`}
                    >
                      <span>{category.label}</span>
                      {category.children.length > 0 && (
                        <ChevronLeft
                          className={`h-4 w-4 transition ${
                            isActive ? "text-neutral-700" : "text-neutral-400"
                          }`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ========== ستون ۲: زیرمنوها ========== */}
          <div className="w-[300px] shrink-0 border-l border-gray-100 p-5">
            <div className="mb-3 text-xs font-medium text-neutral-400">
              {activeCategory.label}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {activeCategory.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className="rounded-lg px-3 py-2 text-[13.5px] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ========== ستون ۳: پروموها (عکس‌ها) ========== */}
          <div className="flex flex-1 gap-4 p-5">
            {/* کارت بزرگ */}
            <Link
              href={promos[0].href}
              className="group relative flex-[1.4] overflow-hidden rounded-xl"
            >
              <div className="relative h-full min-h-[380px] w-full">
                <Image
                  src={promos[0].image}
                  alt={promos[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-5 right-5 left-5">
                  <p className="text-xs tracking-wide text-white/85">
                    {promos[0].subtitle}
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {promos[0].title}
                  </p>
                </div>
              </div>
            </Link>

            {/* کارت کوچکتر */}
            <Link
              href={promos[1].href}
              className="group relative w-[180px] shrink-0 overflow-hidden rounded-xl"
            >
              <div className="relative h-full min-h-[380px] w-full">
                <Image
                  src={promos[1].image}
                  alt={promos[1].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="180px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 left-4">
                  <p className="text-sm font-semibold text-white">
                    {promos[1].title}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}