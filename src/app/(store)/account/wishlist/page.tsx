"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlist";
import { useCartStore } from "@/store/useCart";
import { WishlistContent } from "@/components/modules/WishlistContent";

export default function AccountWishlistPage() {
  const { getTotalItems, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const count = getTotalItems();

  const addAllToCart = () => {
    useWishlistStore.getState().items.forEach((product) => addItem(product, 1));
    openCart();
  };

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <Heart className="size-5 fill-pink-600" />
          </span>
          <div>
            <h1 className="text-xl font-black text-neutral-900">علاقه‌مندی‌ها</h1>
            <p className="text-sm text-neutral-500">
              {count.toLocaleString("fa-IR")} مورد در لیست شما
            </p>
          </div>
        </div>
        {count > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addAllToCart}
              className="flex items-center gap-2 rounded-full bg-[#d97757] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#c86a4c]"
            >
              <ShoppingBag className="size-4" />
              افزودن همه به سبد
            </button>
            <button
              type="button"
              onClick={clearWishlist}
              className="flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-red-600 hover:text-red-600"
            >
              <Trash2 className="size-4" />
              پاک کردن
            </button>
          </div>
        )}
      </div>

      <WishlistContent />
    </div>
  );
}
