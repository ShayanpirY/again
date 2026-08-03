import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/modules/ProductGrid";

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=1200&auto=format&fit=crop",
    href: "/products?collection=new",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1200&auto=format&fit=crop",
    href: "/category/newborn",
  },
];

const ageCategories = [
  {
    name: "نوزاد",
    age: "۰ تا ۱۸ ماه",
    href: "/category/newborn",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "کودک نوپا",
    age: "۶ تا ۳۶ ماه",
    href: "/category/baby",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "دختر",
    age: "۲ تا ۹ سال",
    href: "/category/girl",
    image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "پسر",
    age: "۲ تا ۹ سال",
    href: "/category/boy",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "نوجوان",
    age: "۸ تا ۱۶ سال",
    href: "/category/pre-teen",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="relative h-[70vh] min-h-[500px] max-h-[900px] overflow-hidden">
          <img
            src={heroSlides[0].image}
            alt="کالکشن جدید"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">
                  بهار و تابستان ۲۰۲۵
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  کالکشن جدید
                </h1>
                <Link href={heroSlides[0].href}>
                  <Button
                    size="lg"
                    className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    مشاهده کالکشن جدید
                    <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Categories */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              خرید بر اساس سن
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              مجموعه‌های منتخب ما را برای هر مرحله‌ای از کودکی کشف کنید.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {ageCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative aspect-[3/4] overflow-hidden bg-neutral-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-4 lg:p-6">
                  <h3 className="text-white font-semibold text-base lg:text-lg tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-xs uppercase tracking-wider mt-1">
                    {category.age}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <ProductGrid />

      {/* Featured Banner */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop"
                alt="کیفیت برتر"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:pr-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 mb-4">
                کیفیت برتر
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight mb-6">
                ساخته شده با توجه برای کوچک‌ترین‌ها
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-8">
                مجموعه‌های ما طراحی ماندگار با راحتی برتر را ترکیب می‌کنند. هر قطعه با استفاده از بهترین مواد با دقت فراوان ساخته می‌شود تا مطمئن شوید کودک شما بهترین ظاهر و احساس را دارد.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em]"
                  >
                    مشاهده همه
                    <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                  </Button>
                </Link>
                <Link href="/sale">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em] border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    حراج
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-neutral-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border border-neutral-200">
                <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">ارسال رایگان</h3>
                <p className="text-xs text-neutral-600 mt-0.5">برای سفارشات بالای ۲,۵۰۰,۰۰۰ تومان</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border border-neutral-200">
                <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">بازگشت رایگان</h3>
                <p className="text-xs text-neutral-600 mt-0.5">۳۰ روز ضمانت بازگشت</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border border-neutral-200">
                <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">پرداخت امن</h3>
                <p className="text-xs text-neutral-600 mt-0.5">پرداخت‌های ۱۰۰٪ ایمن</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
