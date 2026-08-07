"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlist";
import { useCartStore } from "@/store/useCart";
import { ProductCard } from "@/components/modules/ProductCard";
import { Button, buttonVariants } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, getTotalItems } = useWishlistStore();
  const count = getTotalItems();
  const { addItem, openCart } = useCartStore();

  const addAllToCart = () => {
    items.forEach((product) => addItem(product, 1));
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
        {count === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 lg:py-24">
            <div className="w-20 h-20 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-neutral-300" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              لیست علاقه‌مندی شما خالی است
            </h2>
            <p className="text-sm text-neutral-600 mb-8">
              روی آیکون قلب روی محصولات بزنید تا اینجا ذخیره شوند.
            </p>
            <Link
              href="/products"
              className={buttonVariants({
                className:
                  "bg-neutral-900 text-white hover:bg-neutral-800 rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em]",
              })}
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {items.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => removeItem(product.id)}
                  aria-label="حذف از علاقه‌مندی‌ها"
                  className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-600 hover:border-red-600 transition-colors z-10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
