"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Package, LayoutDashboard, UserRound } from "lucide-react";

function UserIconFallback() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "کاربر";

  if (status === "loading") {
    return (
      <span className="w-8 h-8 rounded-full bg-gray-100 animate-pulse inline-block" aria-hidden="true" />
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href="/login" aria-label="ورود" className="hover:text-black transition-colors" title="ورود">
        <UserIconFallback />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 hover:text-black transition-colors"
        aria-label="حساب کاربری"
      >
        <span className="hidden sm:flex text-sm font-medium max-w-28 truncate">سلام، {firstName}</span>
        <span className="w-8 h-8 rounded-full bg-[#d97757]/10 text-[#d97757] flex items-center justify-center">
          <UserIconFallback />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-3 py-2">
          <p className="text-sm font-semibold text-gray-900">{user?.name ?? "کاربر"}</p>
          <p className="text-xs text-gray-400 font-normal truncate" dir="ltr">
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <UserRound />
          حساب من
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/account#orders")}>
          <Package />
          سفارش‌های من
        </DropdownMenuItem>
        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <LayoutDashboard />
              پنل مدیریت
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut />
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
