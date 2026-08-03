"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col" dir="rtl">
        <SheetHeader className="space-y-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold text-neutral-900">سبد خرید</SheetTitle>
              <SheetDescription>
                {totalItems === 0
                  ? "سبد خرید شما خالی است"
                  : `${totalItems.toLocaleString("fa-IR")} کالا`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-neutral-900">سبد خرید خالی است</h3>
              <p className="text-sm text-neutral-600">
                محصولات مورد علاقه خود را به سبد خرید اضافه کنید
              </p>
            </div>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-4 inline-flex items-center justify-center bg-neutral-900 text-white hover:bg-neutral-800 transition-colors px-8 py-3 text-sm font-medium tracking-wider"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-4 p-3 bg-neutral-50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate text-neutral-900">{item.product.name}</h4>
                          <p className="text-xs text-neutral-600">
                            {item.selectedColor && `رنگ: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " • "}
                            {item.selectedSize && `سایز: ${item.selectedSize}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-500 hover:text-red-600 flex-shrink-0"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold text-neutral-900">
                            {item.quantity.toLocaleString("fa-IR")}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-bold text-neutral-900">
                          {(item.product.price * item.quantity).toLocaleString("fa-IR")} <span className="text-xs font-normal">تومان</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-lg font-bold text-neutral-900">
                <span>جمع کل:</span>
                <span>{totalPrice.toLocaleString("fa-IR")} <span className="text-sm font-normal text-neutral-600">تومان</span></span>
              </div>
              <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-6 text-sm font-semibold tracking-wider">
                تکمیل خرید و پرداخت
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
