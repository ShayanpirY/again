"use client";

import Link from "next/link";
import { megaMenuData } from "@/data/mega-menu";

interface MegaMenuProps {
  categoryKey: string;
}

export function MegaMenu({ categoryKey }: MegaMenuProps) {
  const data = megaMenuData[categoryKey as keyof typeof megaMenuData];

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="grid grid-cols-12 gap-8">
        {/* Column 1: Clothing */}
        <div className="col-span-3">
          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
            پوشاک اصلی
          </h3>
          <ul className="space-y-3">
            {data.clothing.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Shoes & Accessories */}
        <div className="col-span-3">
          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
            کفش و اکسسوری
          </h3>
          <ul className="space-y-3">
            {data.shoesAccessories.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Collections */}
        <div className="col-span-3">
          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
            کالکشن‌ها
          </h3>
          <ul className="space-y-3">
            {data.collections.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Banner */}
        <div className="col-span-3">
          <Link href={data.banner.href} className="block group/banner">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 rounded-sm">
              <img
                src={data.banner.image}
                alt={data.banner.title}
                className="w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-4">
                <p className="text-white text-xs font-medium mb-1">{data.banner.subtitle}</p>
                <h4 className="text-white font-semibold text-sm mb-2">{data.banner.title}</h4>
                <span className="inline-flex items-center text-white text-xs font-medium group-hover/banner:underline">
                  مشاهده کالکشن
                  <svg className="h-3 w-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
