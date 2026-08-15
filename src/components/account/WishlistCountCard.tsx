"use client";

import { useWishlistStore } from "@/store/useWishlist";

export function WishlistCountCard() {
  const count = useWishlistStore((s) => s.getTotalItems());

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
      <p className="text-sm text-neutral-500">علاقه‌مندی‌ها</p>
      <p className="mt-2 text-2xl font-black text-neutral-900">
        {count.toLocaleString("fa-IR")}
      </p>
      <p className="mt-1 text-xs text-neutral-400">محصول در لیست</p>
    </div>
  );
}
