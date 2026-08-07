"use client";

import Link from "next/link";
import { ShoppingBag, Search, Heart, User, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { MegaMenu } from "@/components/modules/MegaMenu";
import { MobileNav } from "@/components/modules/MobileNav";
import { SearchModal } from "@/components/modules/SearchModal";

const announcementText = "ارسال رایگان برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان | بازگشت رایگان کالا";

const mainNavItems = [
  {
    label: "نوزاد",
    href: "/products?age=newborn",
    age: "۰ تا ۱۸ ماه",
    categoryKey: "newborn",
    hoverBg: "hover:bg-amber-100",
    hoverText: "hover:text-amber-700",
    activeBg: "bg-amber-100",
    activeText: "text-amber-700",
  },
  {
    label: "کودک",
    href: "/products?age=baby",
    age: "۶ تا ۳۶ ماه",
    categoryKey: "baby",
    hoverBg: "hover:bg-emerald-100",
    hoverText: "hover:text-emerald-700",
    activeBg: "bg-emerald-100",
    activeText: "text-emerald-700",
  },
  {
    label: "دختر",
    href: "/products?age=girl",
    age: "۲ تا ۹ سال",
    categoryKey: "girl",
    hoverBg: "hover:bg-pink-100",
    hoverText: "hover:text-pink-700",
    activeBg: "bg-pink-100",
    activeText: "text-pink-700",
  },
  {
    label: "پسر",
    href: "/products?age=boy",
    age: "۲ تا ۹ سال",
    categoryKey: "boy",
    hoverBg: "hover:bg-sky-100",
    hoverText: "hover:text-sky-700",
    activeBg: "bg-sky-100",
    activeText: "text-sky-700",
  },
  {
    label: "نوجوان",
    href: "/products?age=pre-teen",
    age: "۸ تا ۱۶ سال",
    categoryKey: "pre-teen",
    hoverBg: "hover:bg-violet-100",
    hoverText: "hover:text-violet-700",
    activeBg: "bg-violet-100",
    activeText: "text-violet-700",
  },
];

const saleNavItem = {
  label: "حراج ویژه",
  href: "/sale",
  hoverBg: "hover:bg-rose-100",
  hoverText: "hover:text-rose-700",
  activeBg: "bg-rose-100",
  activeText: "text-rose-700",
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { getTotalItems: getWishlistCount } = useWishlistStore();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF8F0]">
      <div className="w-full bg-gradient-to-r from-amber-100 via-rose-100 to-orange-100 text-amber-900">
        <div className="container mx-auto px-4">
          <p className="text-center text-[11px] font-bold tracking-[0.2em] py-2.5 uppercase">
            {announcementText}
          </p>
        </div>
      </div>

      <div className="border-b border-amber-100/70 shadow-[0_2px_16px_rgba(251,146,60,0.12)]">
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
                      className={`flex items-center text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 ${activeCategory === item.categoryKey ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-all duration-300 ${item.hoverBg} ${item.hoverText} ${activeCategory === item.categoryKey ? `${item.activeBg} ${item.activeText} shadow-sm scale-[1.05]` : ""}`}
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
                      </span>
                    </Link>
                  </div>
                ))}
                <Link
                  href="/products"
                  className="flex items-center text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 text-neutral-600 hover:text-neutral-900"
                >
                  <span className="flex items-center gap-1 rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-amber-100 hover:text-amber-700">
                    همه محصولات
                  </span>
                </Link>
                <Link
                  href="/sale"
                  className="flex items-center text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 text-neutral-600 hover:text-neutral-900"
                >
                  <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-all duration-300 text-rose-600 ${saleNavItem.hoverBg} ${saleNavItem.hoverText}`}>
                    حراج ویژه
                  </span>
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

              <div className="flex items-center gap-1 border-r border-amber-100 pr-4">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Link
                  href="/wishlist"
                  aria-label="علاقه‌مندی‌ها"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className: "h-9 w-9 relative",
                  })}
                >
                  <Heart className="h-5 w-5" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={toggleCart}>
                  <ShoppingBag className="h-5 w-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
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