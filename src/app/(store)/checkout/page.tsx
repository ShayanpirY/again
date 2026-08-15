"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Shield } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { PromoCodeBox } from "@/components/modules/PromoCodeBox";
import { applyCoupon } from "@/lib/coupons";
import { iranLocations, provinces } from "@/data/iran-locations";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, promoCode } = useCartStore();
  const settings = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const cities = province ? iranLocations[province] || [] : [];

  const subtotal = getTotalPrice();
  const promo = applyCoupon(promoCode ?? "", subtotal);
  const discount = promo.ok ? promo.discount : 0;
  const freeShippingThreshold = settings.freeShippingThreshold ?? 2500000;
  const shipping = subtotal > freeShippingThreshold ? 0 : 150000;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!province) {
      alert("لطفاً استان را انتخاب کنید.");
      return;
    }
    if (!city) {
      alert("لطفاً شهر را انتخاب کنید.");
      return;
    }

    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string | null)?.trim() || "";
    const lastName = (formData.get("lastName") as string | null)?.trim() || "";
    const phone = (formData.get("phone") as string | null)?.trim() || "";
    const address = (formData.get("address") as string | null)?.trim() || "";
    const postalCode = (formData.get("postalCode") as string | null)?.trim() || "";

    if (!/^09\d{9}$/.test(phone.replace(/\s/g, ""))) {
      alert("شماره موبایل معتبر نیست (مثال: 09123456789)");
      setIsSubmitting(false);
      return;
    }

    const fullAddress = [address, city, province, postalCode].filter(Boolean).join(" - ");
    const notesText = notes.trim();

    const orderData = {
      customerName: `${firstName} ${lastName}`.trim(),
      customerPhone: phone,
      address: fullAddress,
      province,
      city,
      postalCode,
      notes: notesText || undefined,
      promoCode: promo.ok ? promo.coupon!.code : undefined,
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
        alert(result?.error || "خطا در ثبت سفارش");
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.replace("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#faf9f7] flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-2xl font-black text-neutral-900">سبد خرید خالی است</h1>
          <p className="text-neutral-600">برای ادامه، ابتدا محصولی به سبد اضافه کنید.</p>
          <Link href="/products">
            <Button className="rounded-full bg-[#d97757] hover:bg-[#c86a4c] text-white px-8">
              مشاهده محصولات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-900">خانه</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-neutral-900">سبد خرید</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">تسویه‌حساب</span>
        </nav>

        <h1 className="text-3xl font-black text-neutral-900 mb-8">تسویه‌حساب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* فرم */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-neutral-900">اطلاعات خریدار</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام</Label>
                    <Input id="firstName" name="firstName" placeholder="نام" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input id="lastName" name="lastName" placeholder="نام خانوادگی" required className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="09123456789"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">استان</Label>
                    <select
                      id="province"
                      name="province"
                      required
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setCity("");
                      }}
                      className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757]"
                    >
                      <option value="">انتخاب استان</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">شهر</Label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={city}
                      disabled={!province}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-xl bg-white disabled:bg-neutral-50 disabled:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757]"
                    >
                      <option value="">
                        {province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
                      </option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">آدرس پستی</Label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    placeholder="خیابان، کوچه، پلاک، واحد..."
                    className="w-full min-h-[100px] px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">کد پستی</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="۱۰ رقم بدون خط تیره"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">توضیحات سفارش (اختیاری)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ساعت هماهنگی تماس، توضیح درب، یادداشت برای پیک و ..."
                    className="w-full min-h-[90px] px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* خلاصه */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">خلاصه سفارش</h2>

                <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-[#d97757] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {[item.selectedColor && `رنگ: ${item.selectedColor}`, item.selectedSize && `سایز: ${item.selectedSize}`]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                        <p className="text-sm font-black text-neutral-900 mt-1">
                          {(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-neutral-100" />

                <div className="mt-5">
                  <PromoCodeBox subtotal={subtotal} />
                </div>

                <div className="space-y-2.5 mt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">جمع کالاها</span>
                    <span className="font-medium">{subtotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">تخفیف</span>
                    <span className={discount > 0 ? "text-green-600 font-medium" : ""}>
                      {discount > 0 ? `−${discount.toLocaleString("fa-IR")}` : "۰"} تومان
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ارسال</span>
                    <span>{shipping === 0 ? "رایگان" : `${shipping.toLocaleString("fa-IR")} تومان`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-neutral-400">
                      ارسال رایگان برای خرید بالای {freeShippingThreshold.toLocaleString("fa-IR")} تومان
                    </p>
                  )}
                  <Separator className="bg-neutral-100" />
                  <div className="flex justify-between text-base font-black pt-1">
                    <span>قابل پرداخت</span>
                    <span>{total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Truck className="h-3.5 w-3.5" />
                    ارسال سریع
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Shield className="h-3.5 w-3.5" />
                    پرداخت امن
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-5 rounded-full bg-[#d97757] hover:bg-[#c86a4c] text-white py-6 text-sm font-bold"
                >
                  {isSubmitting ? "در حال ثبت..." : "پرداخت و ثبت نهایی سفارش"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}