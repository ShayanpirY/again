"use client";

import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { megaMenuData } from "@/data/mega-menu";

const mainNavItems = [
  {
    label: "نوزاد",
    href: "/products?age=newborn",
    age: "۰ تا ۱۸ ماه",
    categoryKey: "newborn",
  },
  {
    label: "کودک",
    href: "/products?age=baby",
    age: "۶ تا ۳۶ ماه",
    categoryKey: "baby",
  },
  {
    label: "دخترانه",
    href: "/products?age=girl",
    age: "۲ تا ۹ سال",
    categoryKey: "girl",
  },
  {
    label: "پسرانه",
    href: "/products?age=boy",
    age: "۲ تا ۹ سال",
    categoryKey: "boy",
  },
  {
    label: "نوجوان",
    href: "/products?age=pre-teen",
    age: "۸ تا ۱۶ سال",
    categoryKey: "pre-teen",
  },
];

interface MobileNavProps {
  onClose?: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  return (
    <nav className="flex flex-col" dir="rtl">
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
                    className="text-base font-semibold tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                  <span className="text-xs text-neutral-500">{item.age}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pr-8 pb-4 [&_a]:no-underline!">
                <div className="space-y-4">
                  {/* Main Categories */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 tracking-wider">پوشاک اصلی</h4>
                    <div className="mt-1 flex flex-col">
                      {data.clothing.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center rounded-lg px-4 py-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Shoes & Accessories */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-900 tracking-wider">کفش و اکسسوری</h4>
                    <div className="mt-1 flex flex-col">
                      {data.shoesAccessories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center rounded-lg px-4 py-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                          onClick={onClose}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Collections */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-900 tracking-wider">کالکشن‌ها</h4>
                    <div className="mt-1 flex flex-col">
                      {data.collections.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center rounded-lg px-4 py-3 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
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
        className="mt-2 flex items-center px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        onClick={onClose}
      >
        حراج ویژه
      </Link>
    </nav>
  );
}
