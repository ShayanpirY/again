"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlist";
import { useCartStore } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { WishlistContent } from "@/components/modules/WishlistContent";

export default function WishlistPage() {
  const { getTotalItems, clearWishlist } = useWishlistStore();
  const count = getTotalItems();
  const { addItem, openCart } = useCartStore();

  const addAllToCart = () => {
    useWishlistStore.getState().items.forEach((product) => addItem(product, 1));
    openCart();
  };

  return (
    <div className="bg-white">
      <div className="bg-[#FAF9F6] border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <Heart className="h-6 w-6 fill-pink-600" />
              </span>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-neutral-900">
                  علاقه‌مندی‌ها
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  {count} مورد در لیست علاقه‌مندی شما
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {count > 0 && (
                <>
                  <Button
                    onClick={addAllToCart}
                    className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-none text-xs font-semibold tracking-wider"
                  >
                    <ShoppingBag className="h-4 w-4 ml-2" />
                    افزودن همه به سبد
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearWishlist}
                    className="rounded-none text-xs font-semibold tracking-wider border-neutral-300 text-neutral-600 hover:text-red-600 hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    پاک کردن
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <WishlistContent />
      </div>
    </div>
  );
}
