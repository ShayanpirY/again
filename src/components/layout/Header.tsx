"use client";

import Link from "next/link";
import { ShoppingBag, Search, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const megaMenuThemeClass: Record<string, string> = {
    newborn: "bg-sky-50/95 backdrop-blur-md border-b border-sky-100",
    baby: "bg-amber-50/95 backdrop-blur-md border-b border-amber-100",
    girl: "bg-rose-50/95 backdrop-blur-md border-b border-rose-100",
    boy: "bg-emerald-50/95 backdrop-blur-md border-b border-emerald-100",
    "pre-teen": "bg-purple-50/95 backdrop-blur-md border-b border-purple-100",
  };

  const activeMegaTheme = activeCategory ? megaMenuThemeClass[activeCategory] || "bg-white/95 backdrop-blur-md border-b border-gray-100" : "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Announcement Bar */}
      <div className="w-full bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-[11px] font-medium tracking-[0.2em] py-2.5 uppercase">
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
            
            {/* Search Modal */}
            <SearchModal key={isSearchOpen ? "open" : "closed"} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Center: Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold tracking-[0.15em] text-neutral-900">
                کودک
              </span>
            </Link>

             {/* Left: Desktop Navigation + Icons */}
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
                       className="flex items-center gap-1 text-xs font-semibold tracking-[0.15em] transition-colors px-3 py-6 text-neutral-600 hover:text-neutral-900"
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
                   className="text-xs font-semibold tracking-[0.15em] text-red-600 hover:text-red-700 transition-colors px-3 py-6"
                 >
                   حراج ویژه
                 </Link>

                 {/* Hover bridge for mega menu */}
                 {activeCategory && (
                   <div className="absolute top-full right-0 left-0">
                     <div className="h-2 bg-transparent" />
                     <div className={`${activeMegaTheme} shadow-xl`}>
                       <MegaMenu categoryKey={activeCategory} />
                     </div>
                   </div>
                 )}
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
