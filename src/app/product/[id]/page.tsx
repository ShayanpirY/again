"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Share2, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useCartStore } from "@/store/useCart";
import { SizeGuideModal } from "@/components/modules/SizeGuideModal";
import { mockProducts } from "@/components/modules/ProductGrid";

const sizes = ["سایز ۱", "سایز ۲", "سایز ۳", "سایز ۴", "سایز ۵", "سایز ۶", "سایز ۷", "سایز ۸"];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts.find((p) => p.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCartStore();

  const allImages = product ? [product.image, ...(product.images || [])] : [];
  const safeSelectedImage = allImages.length > 0 ? Math.min(selectedImage, allImages.length - 1) : 0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">محصول یافت نشد</h1>
          <p className="text-neutral-600">متأسفانه محصول مورد نظر شما وجود ندارد.</p>
          <Link href="/products">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              بازگشت به فروشگاه
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("لطفاً سایز را انتخاب کنید.");
      return;
    }
    addItem(product, 1, undefined, selectedSize);
    openCart();
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900 transition-colors">محصولات</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm">
              <Image
                src={allImages[safeSelectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              {product.isNew && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium tracking-wider">
                  جدید
                </span>
              )}
              {product.isSale && discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 text-white text-xs font-medium tracking-wider">
                  -{discount}٪
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                      safeSelectedImage === index ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - تصویر ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left: Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-neutral-900">
                  {product.price.toLocaleString("fa-IR")} <span className="text-base font-normal text-neutral-600">تومان</span>
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-500 line-through">
                    {product.originalPrice.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">انتخاب سایز</span>
                <Button
                  variant="link"
                  className="text-xs text-neutral-600 hover:text-neutral-900 p-0 h-auto"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  راهنمای سایز
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 text-sm font-medium border rounded-sm transition-all ${
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart & Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-6 text-sm font-semibold tracking-wider"
              >
                افزودن به سبد خرید
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-none py-6"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ml-2 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
                  {isWishlisted ? "در لیست علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                </Button>
                <Button variant="outline" className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-none py-6">
                  <Share2 className="h-5 w-5 ml-2" />
                  اشتراک‌گذاری
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-full">
                  <Truck className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">ارسال سریع</p>
                  <p className="text-xs text-neutral-600">ارسال در کمتر از ۲۴ ساعت</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-full">
                  <Shield className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">ضمانت اصالت</p>
                  <p className="text-xs text-neutral-600">۱۰۰٪ تضمین کیفیت</p>
                </div>
              </div>
            </div>

            {/* Accordion */}
            <Accordion className="border-t border-neutral-200 pt-4">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline">
                  مشخصات و جنس پارچه
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>جنس: ۱۰۰٪ پنبه ارگانیک</p>
                    <p>وزن: ۱۸۰ گرم</p>
                    <p>مکانیسم بافت: نرم و نفس‌بخش</p>
                    <p>مورد تأیید: استاندارد OEKO-TEX</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline">
                  شرایط شستشو و نگهداری
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>شستشو با ماشین با دمای ۳۰ درجه</p>
                    <p>از استفاده از سفیدکننده خودداری کنید</p>
                    {product.gender === "girl" && <p>آهسته در دمای پایین اتو بکشید</p>}
                    <p>نکند در خشک‌کن قرار ندهید</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen} />
    </div>
  );
}
