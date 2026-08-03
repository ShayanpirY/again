"use client";

import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { megaMenuData } from "@/data/mega-menu";

const mainNavItems = [
  {
    label: "نوزاد",
    href: "/category/newborn",
    age: "۰ تا ۱۸ ماه",
    categoryKey: "newborn",
  },
  {
    label: "کودک",
    href: "/category/baby",
    age: "۶ تا ۳۶ ماه",
    categoryKey: "baby",
  },
  {
    label: "دختر",
    href: "/category/girl",
    age: "۲ تا ۹ سال",
    categoryKey: "girl",
  },
  {
    label: "پسر",
    href: "/category/boy",
    age: "۲ تا ۹ سال",
    categoryKey: "boy",
  },
  {
    label: "نوجوان",
    href: "/category/pre-teen",
    age: "۸ تا ۱۶ سال",
    categoryKey: "pre-teen",
  },
];

interface MobileNavProps {
  onClose?: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  return (
    <nav className="flex flex-col gap-1" dir="rtl">
      {mainNavItems.map((item) => {
        const data = megaMenuData[item.categoryKey as keyof typeof megaMenuData];
        if (!data) return null;

        return (
          <Accordion key={item.label}>
            <AccordionItem value={item.label}>
              <AccordionTrigger className="px-4 py-3 hover:bg-neutral-50 rounded-lg">
                <div className="flex flex-col items-start gap-0.5">
                  <Link
                    href={item.href}
                    className="text-base font-semibold tracking-wide hover:text-neutral-600 transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                  <span className="text-xs text-neutral-500">{item.age}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pr-8 pb-4 space-y-4">
                  {/* Main Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">پوشاک اصلی</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.clothing.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1"
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Shoes & Accessories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">کفش و اکسسوری</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.shoesAccessories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1"
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Collections */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">کالکشن‌ها</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.collections.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1"
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      {/* Sale Link */}
      <Link
        href="/sale"
        className="px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
        onClick={onClose}
      >
        حراج ویژه
      </Link>
    </nav>
  );
}
