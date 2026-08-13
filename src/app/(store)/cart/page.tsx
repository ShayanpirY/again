"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { PromoCodeBox } from "@/components/modules/PromoCodeBox";
import { applyCoupon } from "@/lib/coupons";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    promoCode,
  } = useCartStore();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const promo = applyCoupon(promoCode ?? "", subtotal);
  const discount = promo.ok ? promo.discount : 0;
  const shipping = subtotal > 2500000 ? 0 : 150000;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div
      className="min-h-screen bg-[linear-gradient(135deg,#fff5f7_0%,#fff8f0_20%,#f0fff4_40%,#f0f7ff_60%,#faf0ff_80%,#fff5f7_100%)]"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="font-bold text-neutral-900">سبد خرید</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 mb-2">
              سبد خرید
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#d97757] shadow-sm border border-neutral-100">
                {totalItems.toLocaleString("fa-IR")} کالا
              </span>
            </p>
          </div>
          {totalItems > 0 && (
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold text-neutral-800 shadow-sm transition-colors hover:border-[#d97757] hover:text-[#d97757]"
            >
              <ShoppingBag className="h-4 w-4 ml-2" />
              ادامه خرید
            </Link>
          )}
        </div>

        {totalItems === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 lg:py-24">
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <ShoppingBag className="h-10 w-10 text-[#d97757]" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              سبد خرید شما خالی است
            </h2>
            <p className="text-sm text-neutral-600 mb-8">
              محصولات مورد علاقه خود را از فروشگاه انتخاب و به سبد اضافه کنید.
            </p>
            <Link href="/products">
              <Button className="rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c] px-8 py-6 text-sm font-semibold shadow-[0_8px_20px_rgba(217,119,87,0.3)]">
                مشاهده محصولات
                <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Items List */}
            <div className="flex-1 w-full space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-neutral-100"
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <Link href={`/products/${item.product.id}`}>
                          <h4 className="text-sm sm:text-base font-bold truncate text-neutral-900 hover:text-[#d97757] transition-colors">
                            {item.product.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-neutral-600">
                          {item.selectedColor && (
                            <span className="inline-flex items-center gap-1.5">
                              رنگ:
                              <span
                                className="inline-block w-3.5 h-3.5 rounded-full ring-1 ring-black/10"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </span>
                          )}
                          {item.selectedColor && item.selectedSize && (
                            <span className="mx-1">•</span>
                          )}
                          {item.selectedSize && (
                            <span>سایز: {item.selectedSize}</span>
                          )}
                        </p>
                        <p className="text-sm font-bold text-neutral-900">
                          {item.product.price.toLocaleString("fa-IR")}
                          <span className="text-xs font-normal text-neutral-500"> تومان</span>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedColor, item.selectedSize)
                        }
                        aria-label="حذف از سبد"
                        className="w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-red-600 hover:border-red-600 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                          }
                          aria-label="کاهش تعداد"
                          className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:border-[#d97757] hover:text-[#d97757] transition-colors flex items-center justify-center"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-neutral-900">
                          {item.quantity.toLocaleString("fa-IR")}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                          }
                          aria-label="افزایش تعداد"
                          className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:border-[#d97757] hover:text-[#d97757] transition-colors flex items-center justify-center"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm sm:text-base font-black text-neutral-900">
                        {(item.product.price * item.quantity).toLocaleString("fa-IR")}
                        <span className="text-xs font-normal text-neutral-500"> تومان</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-neutral-100 p-5 space-y-4 sticky top-8">
                <h2 className="text-lg font-bold text-neutral-900">خلاصه سفارش</h2>

                <PromoCodeBox subtotal={subtotal} />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">جمع کالاها</span>
                    <span className="text-neutral-900">
                      {subtotal.toLocaleString("fa-IR")}
                      <span className="text-xs text-neutral-500"> تومان</span>
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">تخفیف کد ({promo.coupon!.code})</span>
                      <span className="text-green-600">
                        -{discount.toLocaleString("fa-IR")}
                        <span className="text-xs text-neutral-500"> تومان</span>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">هزینه ارسال</span>
                    <span className="text-neutral-900">
                      {shipping === 0 ? "رایگان" : `${shipping.toLocaleString("fa-IR")} تومان`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-100">
                    <span>جمع نهایی:</span>
                    <span>
                      {total.toLocaleString("fa-IR")}
                      <span className="text-sm font-normal text-neutral-600"> تومان</span>
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c] py-5 text-sm font-semibold shadow-[0_8px_20px_rgba(217,119,87,0.3)] transition-all">
                    تکمیل خرید و پرداخت
                  </Button>
                </Link>

                <Link
                  href="/products"
                  className="block w-full text-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-800 transition-colors hover:border-[#d97757] hover:text-[#d97757]"
                >
                  ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
