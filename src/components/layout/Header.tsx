"use client";

import Link from "next/link";
import { ShoppingBag, Search, Heart, User, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/store/useCart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { MegaMenu } from "@/components/modules/MegaMenu";
import { MobileNav } from "@/components/modules/MobileNav";
import { SearchModal } from "@/components/modules/SearchModal";

const announcementText = "ارسال رایگان برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان | بازگشت رایگان کالا";

const mainNavItems = [
  {
    label: "نوزاد",
    href: "/category/newborn",
    age: "۰ تا ۱۸ ماه",
    categoryKey: "newborn",
    hoverBg: "hover:bg-amber-50",
    hoverText: "hover:text-amber-600",
    activeBg: "bg-amber-50",
    activeText: "text-amber-600",
  },
  {
    label: "کودک",
    href: "/category/baby",
    age: "۶ تا ۳۶ ماه",
    categoryKey: "baby",
    hoverBg: "hover:bg-emerald-50",
    hoverText: "hover:text-emerald-600",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-600",
  },
  {
    label: "دختر",
    href: "/category/girl",
    age: "۲ تا ۹ سال",
    categoryKey: "girl",
    hoverBg: "hover:bg-pink-50",
    hoverText: "hover:text-pink-600",
    activeBg: "bg-pink-50",
    activeText: "text-pink-600",
  },
  {
    label: "پسر",
    href: "/category/boy",
    age: "۲ تا ۹ سال",
    categoryKey: "boy",
    hoverBg: "hover:bg-sky-50",
    hoverText: "hover:text-sky-600",
    activeBg: "bg-sky-50",
    activeText: "text-sky-600",
  },
  {
    label: "نوجوان",
    href: "/category/pre-teen",
    age: "۸ تا ۱۶ سال",
    categoryKey: "pre-teen",
    hoverBg: "hover:bg-violet-50",
    hoverText: "hover:text-violet-600",
    activeBg: "bg-violet-50",
    activeText: "text-violet-600",
  },
];

const saleNavItem = {
  label: "حراج ویژه",
  href: "/sale",
  hoverBg: "hover:bg-rose-50",
  hoverText: "hover:text-rose-600",
  activeBg: "bg-rose-50",
  activeText: "text-rose-600",
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="w-full bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-[11px] font-medium tracking-[0.2em] py-2.5 uppercase">
            {announcementText}
          </p>
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
<SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-9 w-9" })}>
  <Menu className="h-5 w-5" />
</SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <div className="mt-8">
                    <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <SearchModal key={isSearchOpen ? "open" : "closed"} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <Link href="/" className="flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold tracking-[0.15em] text-neutral-900">
                کودک
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <nav
                className="flex items-center gap-1 relative"
                onMouseLeave={() => setActiveCategory(null)}
              >
                {mainNavItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(item.categoryKey)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 ${item.hoverBg} ${item.hoverText} ${activeCategory === item.categoryKey ? `${item.activeBg} ${item.activeText}` : "text-neutral-600"}`}
                    >
                      {item.label}
                      <svg
                        className="h-3 w-3 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </div>
                ))}
                <Link
                  href="/sale"
                  className={`text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 ${saleNavItem.hoverBg} ${saleNavItem.hoverText} text-red-600`}
                >
                  حراج ویژه
                </Link>

                <div
                  className={`absolute left-0 right-0 top-full transition-all duration-300 ease-in-out ${
                    activeCategory
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div className="h-2 bg-transparent" />
                  <div>
                    {activeCategory && <MegaMenu categoryKey={activeCategory} />}
                  </div>
                </div>
              </nav>

              <div className="flex items-center gap-1 border-r border-neutral-200 pr-4">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)}>
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
                  {mounted && totalItems > 0 && (
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