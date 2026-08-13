"use client";

import { useState, useEffect, Suspense, use } from "react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";

const categoryConfig: Record<
  string,
  {
    title: string;
    ageRange: string;
    bg: string;
    gradient: string;
    emoji: string;
    girl?: { title: string; bg: string; gradient: string };
    boy?: { title: string; bg: string; gradient: string };
  }
> = {
  sisooni: {
    title: "سیسمونی",
    ageRange: "۰ تا ۱۲ ماه",
    bg: "bg-gradient-to-br from-violet-100 via-rose-50 to-sky-100",
    gradient: "from-[#7c3aed] via-[#ec4899] to-[#0284c7]",
    emoji: "🎁",
    girl: {
      title: "سیسمونی دخترانه",
      bg: "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-50",
      gradient: "from-[#a21caf] via-[#d946ef] to-[#ec4899]",
    },
    boy: {
      title: "سیسمونی پسرانه",
      bg: "bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50",
      gradient: "from-[#0284c7] via-[#0ea5e9] to-[#2563eb]",
    },
  },
  baby: {
    title: "پوشاک نوزاد",
    ageRange: "۶ ماه تا ۴ سال",
    bg: "bg-[#e8f5e9]",
    gradient: "from-[#15803d] via-[#4ade80] to-[#0ea5e9]",
    emoji: "🧸",
  },
  kids: {
    title: "پوشاک کودک",
    ageRange: "۲ تا ۱۰ سال",
    bg: "bg-[#e0f7fa]",
    gradient: "from-[#0284c7] via-[#38bdf8] to-[#f43f5e]",
    emoji: "🎈",
  },
  girl: {
    title: "دخترانه",
    ageRange: "۲ تا ۱۶ سال",
    bg: "bg-[#fff0f5]",
    gradient: "from-[#be123c] via-[#fb7185] to-[#f9a8d4]",
    emoji: "👗",
  },
  boy: {
    title: "پسرانه",
    ageRange: "۲ تا ۱۶ سال",
    bg: "bg-[#e0f2fe]",
    gradient: "from-[#0369a1] via-[#38bdf8] to-[#818cf8]",
    emoji: "🧢",
  },
  preteen: {
    title: "پوشاک نوجوان",
    ageRange: "۸ تا ۱۶ سال",
    bg: "bg-[#fff0f5]",
    gradient: "from-[#be123c] via-[#fb7185] to-[#818cf8]",
    emoji: "⚡",
  },
  essentials: {
    title: "لوازم ضروری",
    ageRange: "همه سنین",
    bg: "bg-[#f5f5f4]",
    gradient: "from-[#78716c] via-[#a8a29e] to-[#d6d3d1]",
    emoji: "🧺",
  },
  sale: {
    title: "حراج ویژه",
    ageRange: "تخفیف‌دار",
    bg: "bg-[#fef2f2]",
    gradient: "from-[#dc2626] via-[#f97316] to-[#fbbf24]",
    emoji: "🔥",
  },
  unisex: {
    title: "لباس مشترک",
    ageRange: "",
    bg: "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50",
    gradient: "from-[#e11d48] via-[#f97316] to-[#f59e0b]",
    emoji: "👕",
  },
  accessories: {
    title: "اکسسوری‌های مادر و نوزاد",
    ageRange: "",
    bg: "bg-gradient-to-br from-emerald-100 via-teal-50 to-green-50",
    gradient: "from-[#047857] via-[#0d9488] to-[#16a34a]",
    emoji: "👜",
  },
};

const GENDER_SLUG_REDIRECTS: Record<string, string> = {
  girl: "/category/kids?gender=girl",
  boy: "/category/kids?gender=boy",
  "baby-girl": "/category/baby?gender=girl",
  "baby-boy": "/category/baby?gender=boy",
  "preteen-girl": "/category/preteen?gender=girl",
  "preteen-boy": "/category/preteen?gender=boy",
  newborn: "/category/sisooni",
  "newborn-boy": "/category/sisooni?gender=boy",
  "newborn-girl": "/category/sisooni?gender=girl",
};

function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug?.[0] || "kids";

  const redirectTarget = GENDER_SLUG_REDIRECTS[slug];
  if (redirectTarget) {
    redirect(redirectTarget);
  }

  const config = categoryConfig[slug] || {
    title: slug,
    ageRange: "",
    bg: "bg-white",
    gradient: "from-neutral-700 via-neutral-500 to-neutral-400",
    emoji: "👕",
  };

  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get("type") || "all";
  const gender = (searchParams.get("gender") || "").toLowerCase();

  const genderTheme =
    gender === "girl" ? config.girl : gender === "boy" ? config.boy : undefined;

  const displayConfig = {
    title: genderTheme?.title ?? config.title,
    bg: genderTheme?.bg ?? config.bg,
    gradient: genderTheme?.gradient ?? config.gradient,
  };

  const setTypeFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("type");
    else params.set("type", value);
    const qs = params.toString();
    router.push(`/category/${slug}${qs ? `?${qs}` : ""}`);
  };

  const setGenderFilter = (value: "girl" | "boy") => {
    if (slug === "girl" || slug === "boy") {
      router.push(`/category/kids?gender=${value}`);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (gender === value) params.delete("gender");
    else params.set("gender", value);
    const qs = params.toString();
    router.push(`/category/${slug}${qs ? `?${qs}` : ""}`);
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = `/api/products?category=${encodeURIComponent(slug)}&limit=200`;

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        let list = Array.isArray(data) ? data : [];

        // فیلتر جنسیت: فقط وقتی gender روی URL هست
        if (gender === "girl" || gender === "boy") {
          list = list.filter((p: any) => {
            const raw = p.gender ?? p.productGender ?? p.sex;
            if (raw == null || raw === "") return false;
            const g = raw.toString().toLowerCase();
            return g === gender || g === "unisex";
          });
        }

        // فیلتر نوع لباس (strict: محصولات بدون type وقتی فیلتر فعال است حذف می‌شوند)
        if (type !== "all") {
          list = list.filter((p: any) => {
            const raw = p.type ?? p.productType;
            if (raw == null || raw === "") return false;
            const t = raw.toString().toLowerCase();
            return t === type;
          });
        }

        setProducts(list);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug, type, gender]);

  return (
    <div className={`min-h-screen ${displayConfig.bg} text-[#1a1a1a] pb-20`} dir="rtl">
      <div className="w-full px-4 md:px-12 pt-12 pb-8 flex flex-col items-center">
        <div className="text-[11px] md:text-xs text-gray-500 flex items-center gap-2 mb-4">
          <Link href="/" className="hover:text-black transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-black">{displayConfig.title}</span>
        </div>

        <h1
          className={`text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${displayConfig.gradient} mb-4`}
        >
          {config.emoji} {displayConfig.title} {config.emoji}
        </h1>

        {config.ageRange && (
          <span className="text-sm font-bold text-gray-600 bg-white/80 px-5 py-2 rounded-full shadow-sm border border-gray-200">
            {config.ageRange}
          </span>
        )}
      </div>

      <div className="w-full flex justify-center mb-8">
        <div className="bg-white border border-gray-200 rounded-full p-1.5 flex gap-1 shadow-sm">
          <button
            onClick={() => setGenderFilter("girl")}
            className={`px-10 py-3 rounded-full text-sm font-extrabold transition-all ${
              gender === "girl" || (slug === "girl" && !gender)
                ? "bg-[#ff6b6b] text-white shadow-md"
                : "text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
          >
            دخترانه
          </button>
          <button
            onClick={() => setGenderFilter("boy")}
            className={`px-10 py-3 rounded-full text-sm font-extrabold transition-all ${
              gender === "boy" || (slug === "boy" && !gender)
                ? "bg-[#4dabf7] text-white shadow-md"
                : "text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
          >
            پسرانه
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center gap-2 flex-wrap px-4 mb-10">
        {[
          { value: "all", label: "همه" },
          { value: "dress", label: "پیراهن" },
          { value: "set", label: "ست" },
          { value: "tshirt", label: "تی‌شرت" },
          { value: "jeans", label: "جین" },
          { value: "knitwear", label: "بافت" },
          { value: "pants", label: "شلوار" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setTypeFilter(item.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              type === item.value
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-center mb-10">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-[#d97757] text-white px-6 py-2.5 text-sm font-bold transition-all hover:bg-[#c86a4c] shadow-[0_8px_20px_rgba(217,119,87,0.3)]"
        >
          مشاهده همه محصولات
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[28px] bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="aspect-[3/4] rounded-2xl bg-neutral-200/80" />
                <div className="mt-3 h-4 rounded-md bg-neutral-200/80" />
                <div className="mt-2 h-3 w-2/3 rounded-md bg-neutral-200/80" />
                <div className="mt-2 h-4 w-1/2 rounded-md bg-neutral-200/80" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="text-8xl mb-8 opacity-90">{config.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">
              هنوز محصولی در «{displayConfig.title}» نیست
            </h2>
            <p className="text-gray-500 text-base font-medium leading-relaxed max-w-md mb-10">
              محصولات این دسته‌بندی به‌زودی اضافه می‌شوند؛ فعلاً از سایر دسته‌بندی‌های فروشگاه دیدن کنید.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#d97757] text-white px-8 py-3 text-sm font-bold transition-all hover:bg-[#c86a4c] shadow-[0_8px_20px_rgba(217,119,87,0.3)]"
            >
              مشاهده همه محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-[28px] bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.images?.[0] || "",
                    images: product.images || [],
                    colors: product.colors || [],
                    category: product.category?.name || displayConfig.title,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen font-bold text-gray-500">
          در حال بارگذاری...
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}