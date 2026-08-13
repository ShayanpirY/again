"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/modules/ProductCard";
import { ProductEmptyState } from "@/components/modules/ProductEmptyState";
import { ProductFilters, Category } from "@/components/modules/ProductFilters";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  category?: {
    name: string;
  };
  fabric?: string;
  season?: string;
  brand?: string;
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

const PAGE_SIZE = 12;

// رده سنی → اسلاگ دسته سنی واقعی (ageGroup همیشه پر نیست؛ دسته‌ها معتبرند)
const AGE_TO_CATEGORY_SLUG: Record<string, string> = {
  newborn: "newborn",
  baby: "baby",
  "pre-teen": "preteen",
};

// جنسیت باید روی فیلد gender فیلتر شود، نه category
const GENDER_AGE_KEYS = ["girl", "boy"];

function ProductsFallback() {
  return (
    <div
      className="min-h-screen bg-[linear-gradient(135deg,#fff5f7_0%,#fff8f0_20%,#f0fff4_40%,#f0f7ff_60%,#faf0ff_80%,#fff5f7_100%)]"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-neutral-200 rounded-full animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const seqRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const appliedKeyRef = useRef<string | null>(null);
  const urlCategorySlugsRef = useRef<string[]>([]);
  const productsLenRef = useRef(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState("newest");

  const [allColors, setAllColors] = useState<string[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(10000000);

  useEffect(() => {
    const apply = async () => {
      await Promise.resolve();
      const sp = searchParams;
      const key = sp.toString();
      if (key === appliedKeyRef.current) return;

      const read = (name: string) => sp.get(name)?.split(",").filter(Boolean) ?? [];

      const slugs = read("category");
      if (slugs.length > 0 && categories.length === 0) return;

      if (slugs.length > 0) {
        urlCategorySlugsRef.current = slugs;
        const ids = slugs
          .map((slug) => categories.find((c) => c.slug === slug)?.id)
          .filter((id): id is string => Boolean(id));
        setSelectedCategories(ids);
      } else {
        urlCategorySlugsRef.current = [];
        setSelectedCategories([]);
      }

      setSelectedAges([...read("age"), ...read("gender")]);
      setSelectedSizes(read("sizes"));
      setSelectedColors(read("colors"));
      setSelectedFabrics(read("fabric"));
      setSelectedSeasons(read("season"));
      setSelectedBrands(read("brand"));

      const sort = sp.get("sort");
      setSortBy(sort === "popular" ? "best-selling" : sort || "newest");
      setInStockOnly(sp.get("inStock") === "true");

      const min = sp.get("minPrice");
      const max = sp.get("maxPrice");
      if ((min || max) && maxPrice < 10000000) {
        setPriceRange([min ? parseInt(min, 10) : 0, max ? parseInt(max, 10) : maxPrice]);
      }

      appliedKeyRef.current = key;
      setReady(true);
    };
    apply();
  }, [searchParams, categories, maxPrice]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/products?limit=1000");
        const raw: unknown = await res.json();
        const data: ApiProduct[] = Array.isArray(raw)
          ? raw
          : (raw as { categories?: ApiProduct[] } | null)?.categories || [];

        const colors = [...new Set(data.flatMap((p) => p.colors || []))].sort();
        const brands = [...new Set(data.map((p) => p.brand).filter(Boolean))].sort() as string[];
        const prices = data.map((p) => p.price);
        const max = prices.length > 0 ? Math.max(...prices) : 10000000;

        setAllColors(colors);
        setAllBrands(brands);
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchPage = useCallback(
    async (skip: number, replace: boolean) => {
      const seq = ++seqRef.current;
      await Promise.resolve();
      if (seq !== seqRef.current) return;

      if (replace) {
        setLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams();

        // دخترانه/پسرانه → فیلد gender
        const genderValues = selectedAges.filter((a) => GENDER_AGE_KEYS.includes(a));
        // رده سنی (newborn/baby/pre-teen) → اسلاگ دسته سنی
        const ageCategorySlugs = selectedAges
          .filter((a) => AGE_TO_CATEGORY_SLUG[a])
          .map((a) => AGE_TO_CATEGORY_SLUG[a]);
        const rawAgeValues = selectedAges.filter(
          (a) => !GENDER_AGE_KEYS.includes(a) && !AGE_TO_CATEGORY_SLUG[a]
        );

        const categorySlugs = [
          ...urlCategorySlugsRef.current,
          ...selectedCategories
            .map((id) => categories.find((c) => c.id === id)?.slug)
            .filter((slug): slug is string => Boolean(slug)),
          ...ageCategorySlugs,
        ].filter((slug, index, arr) => Boolean(slug) && arr.indexOf(slug) === index);
        if (categorySlugs.length > 0) {
          params.set("category", categorySlugs.join(","));
        }

        if (genderValues.length > 0) {
          params.set("gender", genderValues.join(","));
        }

        if (rawAgeValues.length > 0) {
          params.set("age", rawAgeValues.join(","));
        }

        if (selectedSizes.length > 0) {
          params.set("sizes", selectedSizes.join(","));
        }

        if (selectedColors.length > 0) {
          params.set("colors", selectedColors.join(","));
        }

        if (selectedFabrics.length > 0) {
          params.set("fabric", selectedFabrics.join(","));
        }

        if (selectedSeasons.length > 0) {
          params.set("season", selectedSeasons.join(","));
        }

        if (selectedBrands.length > 0) {
          params.set("brand", selectedBrands.join(","));
        }

        if (inStockOnly) {
          params.set("inStock", "true");
        }

        if (priceRange[0] > 0) {
          params.set("minPrice", priceRange[0].toString());
        }

        if (priceRange[1] < maxPrice) {
          params.set("maxPrice", priceRange[1].toString());
        }

        params.set("sort", sortBy);
        params.set("skip", String(skip));
        params.set("limit", String(PAGE_SIZE));

        // دیباگ موقت: تعداد قبل از فیلتر و پارامترها
        console.log(
          `[filter] قبل از فیلتر: نمایش ${productsLenRef.current} | skip=${skip} | params=${params.toString()}`
        );

        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ApiProduct[] = await res.json();
        if (seq !== seqRef.current) return;

        const totalCount = Number(res.headers.get("X-Total-Count")) || data.length;
        // دیباگ موقت: تعداد بعد از فیلتر
        console.log(
          `[filter] بعد از فیلتر: دریافت ${data.length} | کل ${totalCount} | نمایش جدید ${replace ? data.length : productsLenRef.current + data.length}`
        );
        productsLenRef.current = replace ? data.length : productsLenRef.current + data.length;

        setProducts((prev) => (replace ? data : [...prev, ...data]));
        setTotalProducts(totalCount);
      } catch (error) {
        if (seq === seqRef.current) {
          console.error("Failed to fetch products:", error);
        }
      } finally {
        if (seq === seqRef.current) {
          if (replace) setLoading(false);
          else setLoadingMore(false);
        }
      }
    },
    [
      selectedCategories,
      selectedAges,
      selectedSizes,
      selectedColors,
      selectedFabrics,
      selectedSeasons,
      selectedBrands,
      inStockOnly,
      priceRange,
      sortBy,
      categories,
      maxPrice,
    ]
  );

  useEffect(() => {
    const load = async () => {
      await fetchPage(0, true);
    };
    if (!ready) return;
    load();
    return () => {
      seqRef.current += 1;
    };
  }, [fetchPage, ready]);

  const hasMore = products.length < totalProducts;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && !loadingMore && hasMore) {
          fetchPage(products.length, false);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, products.length, fetchPage]);

  const handleCategoryChange = (values: string[]) => {
    urlCategorySlugsRef.current = [];
    setSelectedCategories(values);
  };

  const clearAllFilters = () => {
    urlCategorySlugsRef.current = [];
    setSelectedCategories([]);
    setSelectedAges([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedSeasons([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
    router.replace("/products");
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedAges.length +
    selectedSizes.length +
    selectedColors.length +
    selectedFabrics.length +
    selectedSeasons.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div
      className="min-h-screen bg-[linear-gradient(135deg,#fff5f7_0%,#fff8f0_20%,#f0fff4_40%,#f0f7ff_60%,#faf0ff_80%,#fff5f7_100%)]"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">خانه</Link>
          <span>/</span>
          <span className="font-bold text-neutral-900">همه محصولات</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 mb-2">
              همه محصولات
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-[#d97757] border-t-transparent animate-spin" />
                  {products.length > 0 ? "در حال به‌روزرسانی..." : "در حال بارگذاری..."}
                </>
              ) : (
                <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#d97757] shadow-sm border border-neutral-100">
                  {totalProducts} محصول یافت شد
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger className={buttonVariants({ variant: "outline", className: "lg:hidden rounded-full border-neutral-200 hover:border-[#d97757] hover:text-[#d97757]" })}>
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                فیلترها
                {activeFiltersCount > 0 && (
                  <span className="mr-2 bg-[#d97757] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>فیلترها</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={handleCategoryChange}
                    selectedAges={selectedAges}
                    setSelectedAges={setSelectedAges}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    selectedFabrics={selectedFabrics}
                    setSelectedFabrics={setSelectedFabrics}
                    selectedSeasons={selectedSeasons}
                    setSelectedSeasons={setSelectedSeasons}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                    allColors={allColors}
                    allBrands={allBrands}
                    activeFiltersCount={activeFiltersCount}
                    clearAllFilters={clearAllFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                <SelectItem value="price-desc">گران‌ترین</SelectItem>
                <SelectItem value="best-selling">پرفروش‌ترین</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-neutral-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">فیلترها</h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    پاک کردن
                  </Button>
                )}
              </div>
              <ProductFilters
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={handleCategoryChange}
                selectedAges={selectedAges}
                setSelectedAges={setSelectedAges}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedFabrics={selectedFabrics}
                setSelectedFabrics={setSelectedFabrics}
                selectedSeasons={selectedSeasons}
                setSelectedSeasons={setSelectedSeasons}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                allColors={allColors}
                allBrands={allBrands}
                activeFiltersCount={activeFiltersCount}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            ) : products.length > 0 ? (
              <div className="relative">
                <div
                  className={cn(
                    "transition-opacity duration-300",
                    loading && "pointer-events-none opacity-40"
                  )}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          id: product.id,
                          name: product.title,
                          price: product.price,
                          image: (product.images && product.images[0]) || "",
                          images: product.images || [],
                          colors: product.colors || [],
                          category: product.category?.name || "",
                          originalPrice: product.originalPrice,
                          isNew: product.isNew,
                          isSale: product.isSale,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-[#d97757] border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <ProductEmptyState
                title="هیچ محصولی در این دسته‌بندی یافت نشد"
                description="در حال حاضر محصولی در این دسته‌بندی یا با این فیلترها موجود نیست."
                onReset={clearAllFilters}
                resetLabel="مشاهده همه محصولات"
              />
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              {loadingMore && (
                <div className="h-8 w-8 rounded-full border-2 border-[#d97757] border-t-transparent animate-spin" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
