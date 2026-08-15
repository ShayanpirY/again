"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlist";
import { ProductCard } from "@/components/modules/ProductCard";

export function WishlistContent() {
  const { items, removeItem, getTotalItems } = useWishlistStore();
  const count = getTotalItems();

  if (count === 0) {
    return (
      <div className="py-12 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-neutral-100">
          <Heart className="size-8 text-neutral-300" />
        </span>
        <p className="mt-4 font-semibold text-neutral-900">لیست علاقه‌مندی شما خالی است</p>
        <p className="mt-1 text-sm text-neutral-500">
          روی آیکون قلب روی محصولات بزنید تا اینجا ذخیره شوند.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          مشاهده محصولات
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard product={product} />
          <button
            onClick={() => removeItem(product.id)}
            aria-label="حذف از علاقه‌مندی‌ها"
            className="absolute -top-2 -left-2 z-10 flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md transition-colors hover:border-red-600 hover:text-red-600"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
