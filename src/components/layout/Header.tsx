"use client";

import Link from "next/link";
import { ShoppingBag, Search, Heart, User, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const announcementText = "ارسال رایگان برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان | بازگشت رایگان کالا";

const mainNavItems = [
  {
    label: "نوزاد",
    href: "/category/newborn",
    age: "۰ تا ۱۸ ماه",
    subcategories: ["لباس نوزاد", "لباس خواب", "لباس پوشیدن", "پوتین", "هدایا"],
  },
  {
    label: "کودک",
    href: "/category/baby",
    age: "۶ تا ۳۶ ماه",
    subcategories: ["بالاتنه", "پایین تنه", "پیراهن", "لباس خارجی", "کفش"],
  },
  {
    label: "دختر",
    href: "/category/girl",
    age: "۲ تا ۹ سال",
    subcategories: ["پیراهن", "بلوز", "دامن", "ست", "لباس استخر"],
  },
  {
    label: "پسر",
    href: "/category/boy",
    age: "۲ تا ۹ سال",
    subcategories: ["تی‌شرت", "شلوار کوتاه", "پولوشرت", "ست", "لباس استخر"],
  },
  {
    label: "نوجوان",
    href: "/category/pre-teen",
    age: "۸ تا ۱۶ سال",
    subcategories: ["بالاتنه", "پایین تنه", "پیراهن", "لباس ورزشی", "اکسسوری"],
  },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Announcement Bar */}
      <div className="w-full bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-medium tracking-wider py-2.5">
            {announcementText}
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Right: Mobile Menu + Search */}
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger
                  render={<Button variant="ghost" size="icon" className="h-9 w-9" />}
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-6 mt-8">
                    {mainNavItems.map((item) => (
                      <div key={item.label} className="space-y-2">
                        <Link
                          href={item.href}
                          className="text-lg font-semibold tracking-wide hover:text-neutral-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <p className="text-xs text-neutral-500">{item.age}</p>
                        {item.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`${item.href}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                            className="block text-sm text-neutral-600 hover:text-black transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <Link href="/sale" className="text-lg font-semibold text-red-600" onClick={() => setIsMobileMenuOpen(false)}>
                      حراج
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold tracking-[0.2em] text-neutral-900">
                کودک
              </span>
            </Link>

            {/* Left: Desktop Navigation + Icons */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                {mainNavItems.map((item) => (
                  <div key={item.label} className="relative group">
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 text-xs font-semibold tracking-[0.15em] text-neutral-900 hover:text-neutral-600 transition-colors py-6"
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    </Link>
                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full right-0 w-64 bg-white border border-neutral-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-6">
                        <p className="text-xs font-semibold text-neutral-500 mb-3">{item.age}</p>
                        <div className="space-y-2.5">
                          {item.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              href={`${item.href}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block text-sm text-neutral-700 hover:text-black transition-colors"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  href="/sale"
                  className="text-xs font-semibold tracking-[0.15em] text-red-600 hover:text-red-700 transition-colors py-6"
                >
                  حراج
                </Link>
              </nav>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={toggleCart}>
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
