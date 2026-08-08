import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Baby, Footprints, Heart, Rocket, Sparkles, Star, Sun } from "lucide-react";
import { LatestProducts } from "@/components/modules/LatestProducts";
import { HeroSection } from "@/components/modules/HeroSection";
import ProductStories from "@/components/modules/ProductStories";

const ageCategories = [
  {
    name: "نوزاد",
    age: "۰ تا ۱۸ ماه",
    href: "/products?age=newborn",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
    icon: <Baby className="h-4 w-4" />,
    accent: "text-amber-600",
    badge: "bg-amber-400",
    chip: "bg-amber-500",
    frame: "bg-amber-50",
    patternColor: "rgba(251,191,36,0.45)",
  },
  {
    name: "کودک نوپا",
    age: "۶ تا ۳۶ ماه",
    href: "/products?age=baby",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800&auto=format&fit=crop",
    icon: <Footprints className="h-4 w-4" />,
    accent: "text-emerald-600",
    badge: "bg-emerald-400",
    chip: "bg-emerald-500",
    frame: "bg-emerald-50",
    patternColor: "rgba(52,211,153,0.45)",
  },
  {
    name: "دخترانه",
    age: "۲ تا ۹ سال",
    href: "/products?age=girl",
    image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=800&auto=format&fit=crop",
    icon: <Sparkles className="h-4 w-4" />,
    accent: "text-pink-600",
    badge: "bg-pink-400",
    chip: "bg-pink-500",
    frame: "bg-pink-50",
    patternColor: "rgba(244,114,182,0.45)",
  },
  {
    name: "پسرانه",
    age: "۲ تا ۹ سال",
    href: "/products?age=boy",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop",
    icon: <Rocket className="h-4 w-4" />,
    accent: "text-sky-600",
    badge: "bg-sky-400",
    chip: "bg-sky-500",
    frame: "bg-sky-50",
    patternColor: "rgba(56,189,248,0.45)",
  },
  {
    name: "نوجوان",
    age: "۸ تا ۱۶ سال",
    href: "/products?age=pre-teen",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop",
    icon: <Star className="h-4 w-4" />,
    accent: "text-violet-600",
    badge: "bg-violet-400",
    chip: "bg-violet-500",
    frame: "bg-violet-50",
    patternColor: "rgba(167,139,250,0.45)",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Product Stories */}
      <ProductStories />

      {/* Age Categories */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-white to-sky-50 py-16 lg:py-24">
        {/* Decorative shapes */}
        <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-200/40 blur-3xl" />
        <div aria-hidden className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
        <div aria-hidden className="absolute top-16 left-8 h-28 w-28 rounded-full border-4 border-dashed border-pink-300/60 animate-[spin_40s_linear_infinite]" />
        <div aria-hidden className="absolute top-1/2 right-10 h-20 w-20 rounded-full border-4 border-dashed border-amber-300/60 animate-[spin_30s_linear_infinite_reverse]" />
        <div aria-hidden className="absolute bottom-16 left-1/3 h-16 w-16 rotate-12 rounded-2xl bg-emerald-200/40" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-neutral-700 shadow-sm mb-4">
              <Sparkles className="h-4 w-4 text-pink-500" />
              برای هر سن، یک ماجراجویی
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 mb-3">
              خرید بر اساس سن
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              مجموعه‌های منتخب ما را برای هر مرحله‌ای از کودکی کشف کنید.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {ageCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative rounded-[1.75rem] bg-white p-3 pb-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-2"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[1.75rem] opacity-60"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${category.patternColor} 2px, transparent 2px)`,
                    backgroundSize: "14px 14px",
                  }}
                />
                <div className={`relative aspect-[3/4] overflow-hidden rounded-[1.35rem] ${category.frame}`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  <div
                    className={`absolute top-3 left-3 ${category.badge} text-white h-9 w-9 rounded-full flex items-center justify-center shadow-md group-hover:animate-bounce`}
                  >
                    {category.icon}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className={`${category.chip} text-white text-[11px] font-bold rounded-full px-3 py-1 shadow-sm`}>
                      {category.age}
                    </span>
                  </div>
                </div>
                <div className="relative text-center pt-4">
                  <h3 className={`text-base font-extrabold ${category.accent}`}>
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Collections Banner */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24">
        {/* Decorative pastel accents */}
        <div aria-hidden className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2 text-xs font-bold text-rose-500 shadow-sm mb-4">
              <Sun className="h-4 w-4" />
              فصل جدید، استایل جدید
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 mb-3">
              کالکشن‌های فصلی و پیشنهاد استایل
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              با جدیدترین کالکشن‌های فصلی و ست‌های منتخب استایل، چهره‌ای متفاوت بسازید.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <Link
              href="/products?season=بهار,تابستان"
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
                alt="کالکشن بهاره و تابستانه"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-neutral-800 shadow-md backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                کالکشن جدید
              </span>
              <div className="absolute bottom-0 right-0 left-0 p-6 lg:p-8">
                <h3 className="text-white text-xl lg:text-2xl font-extrabold">
                  کالکشن بهاره / تابستانه
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-white/90 text-xs font-semibold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  مشاهده کالکشن
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </span>
              </div>
            </Link>
            <Link
              href="/products?category=ست-تولد"
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop"
                alt="پیشنهاد استایل و ست لباس"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-neutral-800 shadow-md backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                پیشنهاد ویژه
              </span>
              <div className="absolute bottom-0 right-0 left-0 p-6 lg:p-8">
                <h3 className="text-white text-xl lg:text-2xl font-extrabold">
                  پیشنهاد استایل و ست لباس
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-white/90 text-xs font-semibold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  مشاهده استایل‌ها
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <LatestProducts />

      {/* Featured Banner */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100 via-amber-50 to-sky-100 shadow-lg px-6 py-12 lg:px-14 lg:py-16">
            {/* Decorative shapes */}
            <div aria-hidden className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />
            <div aria-hidden className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
            <div aria-hidden className="absolute top-8 left-10 h-24 w-24 rounded-full border-4 border-dashed border-amber-300/60 animate-[spin_40s_linear_infinite]" />
            <Heart aria-hidden className="absolute bottom-10 right-10 h-8 w-8 text-pink-200" />
            <Sparkles aria-hidden className="absolute top-10 right-1/4 h-6 w-6 text-amber-300" />
            <Star aria-hidden className="absolute bottom-8 left-1/3 h-6 w-6 text-sky-300" />

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="group relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop"
                    alt="کیفیت برتر"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="absolute -bottom-4 right-6 rounded-2xl bg-white shadow-md px-4 py-3 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 fill-pink-500" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">عاشقانه برای کوچولوها</p>
                    <p className="text-[10px] text-neutral-500">مواد نرم و ایمن</p>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-right">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-pink-600 shadow-sm">
                  <Heart className="h-4 w-4 fill-pink-500" />
                  دوست‌داشتنی و باکیفیت
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight mt-5 mb-6">
                  طراحی شده با عشق، برای خنده‌های کودکانه
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-8">
                  مجموعه‌های ما طراحی ماندگار با راحتی برتر را ترکیب می‌کنند. هر قطعه با استفاده از بهترین مواد با دقت فراوان ساخته می‌شود تا مطمئن شوید کودک شما بهترین ظاهر و احساس را دارد.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="rounded-full bg-pink-500 text-white hover:bg-pink-600 px-10 py-6 text-xs font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                      مشاهده همه
                      <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                    </Button>
                  </Link>
                  <Link href="/sale">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full bg-white border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 px-10 py-6 text-xs font-bold uppercase tracking-[0.15em] shadow-sm hover:shadow-md transition-all"
                    >
                      حراج
                    </Button>
                  </Link>
                </div>
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
