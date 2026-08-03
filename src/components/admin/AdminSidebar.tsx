"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, Tag } from "lucide-react";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "داشبورد", exact: true },
  { href: "/admin/products", icon: Package, label: "محصولات" },
  { href: "/admin/categories", icon: Tag, label: "دسته‌بندی‌ها" },
  { href: "/admin/orders", icon: ShoppingCart, label: "سفارشات" },
  { href: "/admin/settings", icon: Settings, label: "تنظیمات" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
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
  );
}
