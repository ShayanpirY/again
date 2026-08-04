"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Shield } from "lucide-react";
import { useCartStore } from "@/store/useCart";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2500000 ? 0 : 150000;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string | null)?.trim() || "";
    const lastName = (formData.get("lastName") as string | null)?.trim() || "";
    const phone = (formData.get("phone") as string | null)?.trim() || "";
    const province = (formData.get("province") as string | null)?.trim() || "";
    const city = (formData.get("city") as string | null)?.trim() || "";
    const address = (formData.get("address") as string | null)?.trim() || "";
    const postalCode = (formData.get("postalCode") as string | null)?.trim() || "";

    const fullAddress = [address, province, city, postalCode].filter(Boolean).join(" - ");

    const orderData = {
      customerName: `${firstName} ${lastName}`.trim(),
      customerPhone: phone,
      address: fullAddress,
      totalPrice: total,
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.image,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result?.error || "خطا در ثبت سفارش";
        console.error("Checkout failed:", res.status, result);
        alert(errorMessage);
        setIsSubmitting(false);
        return;
      }

      clearCart();
      window.location.href = "/checkout/success";
    } catch (error) {
      console.error("Checkout error:", error);
      alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">سبد خرید خالی است</h1>
          <p className="text-neutral-600">برای ادامه خرید، ابتدا محصولی را به سبد خرید اضافه کنید.</p>
          <Link href="/products">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              مشاهده محصولات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900 transition-colors">محصولات</Link>
          <span>/</span>
          <span className="text-neutral-900">تسویه‌حساب</span>
        </nav>

        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-8">تسویه‌حساب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Right: Customer Info Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">اطلاعات خریدار</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-neutral-900">نام</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="نام خود را وارد کنید"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-neutral-900">نام خانوادگی</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="نام خانوادگی"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-neutral-900">شماره تماس</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium text-neutral-900">استان</Label>
                    <Input
                      id="province"
                      name="province"
                      placeholder="تهران"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-neutral-900">شهر</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="تهران"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-neutral-900">آدرس پستی</Label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="آدرس دقیق خود را وارد کنید..."
                      className="w-full min-h-[100px] px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-neutral-900">کد پستی</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="۱۲۳۴۵۶۷۸۹۰"
                      className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                      required
                    />
                  </div>
              </div>
            </div>

            {/* Left: Order Summary */}
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-sm">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">خلاصه سفارش</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-neutral-900 truncate">{item.product.name}</h4>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {item.selectedSize && `سایز: ${item.selectedSize}`}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 mt-1">
                          {(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-neutral-200" />

                {/* Totals */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">جمع کالاها</span>
                    <span className="text-neutral-900">{subtotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">هزینه ارسال</span>
                    <span className="text-neutral-900">
                      {shipping === 0 ? "رایگان" : `${shipping.toLocaleString("fa-IR")} تومان`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-neutral-500">
                      برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان ارسال رایگان است
                    </p>
                  )}
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-neutral-900">مبلغ قابل پرداخت</span>
                    <span className="text-neutral-900">{total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-neutral-700" />
                    <span className="text-xs text-neutral-600">ارسال سریع</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-neutral-700" />
                    <span className="text-xs text-neutral-600">پرداخت امن</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-6 text-sm font-semibold tracking-wider mt-6"
                >
                  {isSubmitting ? "در حال پردازش..." : "پرداخت و ثبت نهایی سفارش"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
