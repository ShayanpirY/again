"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Settings,
  RotateCcw,
  Users,
  Ticket,
  BarChart3,
  CirclePlay,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "داشبورد", exact: true },
  { href: "/admin/products", icon: Package, label: "محصولات" },
  { href: "/admin/categories", icon: Tag, label: "دسته‌بندی‌ها" },
  { href: "/admin/stories", icon: CirclePlay, label: "استوری‌ها" },
  { href: "/admin/orders", icon: ShoppingCart, label: "سفارشات" },
  { href: "/admin/returns", icon: RotateCcw, label: "مرجوعی" },
  { href: "/admin/users", icon: Users, label: "کاربران" },
  { href: "/admin/coupons", icon: Ticket, label: "کد تخفیف" },
  { href: "/admin/reports", icon: BarChart3, label: "گزارش" },
  { href: "/admin/settings", icon: Settings, label: "تنظیمات" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // قفل اسکرول وقتی منوی موبایل باز است
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-neutral-100 flex" dir="rtl">
      {/* سایدبار دسکتاپ */}
      <aside className="w-64 bg-white border-l border-neutral-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <Link href="/admin" className="text-xl font-bold tracking-[0.2em] text-neutral-900">
            کودک
          </Link>
          <p className="text-xs text-neutral-500 mt-1">پنل مدیریت</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* ستون محتوا */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* هدر موبایل */}
        <header className="md:hidden sticky top-0 z-40 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
          <Link href="/admin" className="text-lg font-bold tracking-[0.2em] text-neutral-900">
            کودک
          </Link>
          <button
            type="button"
            aria-label="باز کردن منو"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>

      {/* Overlay موبایل */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* منوی Drawer موبایل */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-50 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <Link href="/admin" onClick={closeMobile} className="text-xl font-bold tracking-[0.2em] text-neutral-900">
              کودک
            </Link>
            <p className="text-xs text-neutral-500 mt-1">پنل مدیریت</p>
          </div>
          <button
            type="button"
            aria-label="بستن منو"
            onClick={closeMobile}
            className="p-2 -ml-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </div>
  );
}
