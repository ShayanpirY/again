"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  Heart,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/account/orders", label: "سفارش‌ها", icon: Package },
  { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/account/addresses", label: "مشخصات کاربر", icon: UserRound },
];

type AccountUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export function AccountSidebar({
  user,
  children,
}: {
  user: AccountUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user.name?.trim().slice(0, 1) || user.email?.slice(0, 1) || "؟";

  const nav = (
    <nav className="flex flex-col gap-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-[#d97757]/10 font-bold text-[#d97757]"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-neutral-200 px-4 py-3 shadow-sm md:hidden"
      >
        <span className="flex items-center gap-3 min-w-0">
          <Avatar user={user} initials={initials} size="sm" />
          <span className="min-w-0 text-right">
            <span className="block text-sm font-bold text-neutral-900 truncate">
              {user.name}
            </span>
            <span className="block text-xs text-neutral-500 truncate" dir="ltr">
              {user.email}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 text-neutral-400 transition-transform",
            mobileOpen && "rotate-180"
          )}
        />
      </button>

      {/* sidebar */}
      <aside
        className={cn(
          "rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 md:w-64 md:shrink-0",
          mobileOpen ? "block" : "hidden md:block"
        )}
      >
        <div className="mb-4 hidden items-center gap-3 border-b border-neutral-100 px-1 pb-4 md:flex">
          <Avatar user={user} initials={initials} size="lg" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 truncate" dir="ltr">
              {user.email}
            </p>
          </div>
        </div>

        {nav}

        <div className="mt-4 border-t border-neutral-100 pt-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4.5 shrink-0" />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* main content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function Avatar({
  user,
  initials,
  size,
}: {
  user: AccountUser;
  initials: string;
  size: "sm" | "lg";
}) {
  const cls =
    size === "sm" ? "size-10 text-base" : "size-12 text-lg";
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name}
        className={cn("shrink-0 rounded-full object-cover", cls)}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-[#d97757]/10 font-bold text-[#d97757]",
        cls
      )}
    >
      {initials}
    </span>
  );
}
