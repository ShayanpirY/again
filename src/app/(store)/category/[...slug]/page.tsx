"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
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
import { SlidersHorizontal, ArrowLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  colors?: string[];
  category?: string;
}

const slugToCategoryMap: Record<string, string> = {
  newborn: "نوزاد",
  baby: "کودک",
  girl: "دخترانه",
  boy: "پسرانه",
  "pre-teen": "نوجوان",
};

type ThemeVariant = "child" | "girl" | "boy" | "teen" | "sale" | "default";

const categoryThemeMap: Record<string, ThemeVariant> = {
  newborn: "child",
  baby: "child",
  girl: "girl",
  boy: "boy",
  "pre-teen": "teen",
};

const themeClassMap: Record<ThemeVariant, { page: string; card: string; overlay?: string }> = {
  child: {
    page: "bg-gradient-to-b from-amber-200/60 via-amber-100/30 to-white",
    card: "bg-white shadow-sm rounded-2xl overflow-hidden",
    overlay: "fixed inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none",
  },
  girl: {
    page: "bg-gradient-to-b from-rose-200/60 via-rose-100/30 to-white",
    card: "bg-white shadow-sm rounded-2xl overflow-hidden border border-rose-100",
    overlay: "fixed inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none",
  },
  boy: {
    page: "bg-gradient-to-b from-emerald-200/60 via-emerald-100/30 to-white",
    card: "bg-white shadow-sm rounded-2xl overflow-hidden border border-emerald-100",
    overlay: "fixed inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none",
  },
  teen: {
    page: "bg-gradient-to-b from-purple-200/60 via-purple-100/30 to-white",
    card: "bg-white shadow-sm rounded-2xl overflow-hidden border border-purple-50",
    overlay: "fixed inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none",
  },
  sale: {
    page: "bg-gradient-to-b from-red-200/60 via-orange-100/30 to-white",
    card: "bg-white shadow-sm rounded-2xl overflow-hidden border border-red-100",
    overlay: "fixed inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none",
  },
  default: {
    page: "bg-white",
    card: "bg-white",
  },
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>("default");
  const [categorySlug, setCategorySlug] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const seqRef = useRef(0);

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
    let cancelled = false;
    const resolveCategory = async () => {
      const resolvedParams = await params;
      const slugSegments = resolvedParams.slug || [];
      const mainSlug = slugSegments[0] || "";

      const categoryName = slugToCategoryMap[mainSlug];
      const theme = categoryThemeMap[mainSlug] || "default";
      setThemeVariant(theme);
      setCategoryTitle(categoryName || "");

      if (!categoryName) {
        setCategorySlug("");
        setProducts([]);
        setTotalProducts(0);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/categories");
        const cats: Category[] = await res.json();
        if (cancelled) return;
        const found = cats.find((c) => c.name === categoryName);
        setCategorySlug(found?.slug || categoryName);
      } catch (error) {
        console.error("Failed to resolve category:", error);
        if (!cancelled) setCategorySlug(categoryName);
      }
    };
    resolveCategory();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!categorySlug) return;
    const loadOptions = async () => {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(categorySlug)}&limit=1000`);
        const data = await res.json();
        if (!Array.isArray(data)) return;
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
    loadOptions();
  }, [categorySlug]);

  const loadProducts = useCallback(async () => {
    if (!categorySlug) return;

    const seq = ++seqRef.current;
    await Promise.resolve();
    if (seq !== seqRef.current) return;

    setLoading(true);

    const qs = new URLSearchParams();
    qs.set("category", categorySlug);

    if (selectedSizes.length > 0) qs.set("sizes", selectedSizes.join(","));
    if (selectedColors.length > 0) qs.set("colors", selectedColors.join(","));
    if (selectedAges.length > 0) qs.set("age", selectedAges.join(","));
    if (selectedFabrics.length > 0) qs.set("fabric", selectedFabrics.join(","));
    if (selectedSeasons.length > 0) qs.set("season", selectedSeasons.join(","));
    if (selectedBrands.length > 0) qs.set("brand", selectedBrands.join(","));
    if (inStockOnly) qs.set("inStock", "true");
    if (priceRange[0] > 0) qs.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < maxPrice) qs.set("maxPrice", priceRange[1].toString());
    qs.set("sort", sortBy);
    qs.set("limit", "1000");

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?${qs.toString()}`);
        const data = await res.json();
        if (seq !== seqRef.current) return;
        if (Array.isArray(data)) {
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: (p.images && p.images[0]) || "",
            images: p.images || [],
            colors: p.colors || [],
            category: p.category?.name || categoryTitle,
          }));
          setProducts(mapped as Product[]);
          setTotalProducts(Number(res.headers.get("X-Total-Count")) || mapped.length);
        }
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        if (seq === seqRef.current) setLoading(false);
      }
    };
    fetchProducts();
  }, [
    categorySlug,
    categoryTitle,
    selectedSizes,
    selectedColors,
    selectedAges,
    selectedFabrics,
    selectedSeasons,
    selectedBrands,
    inStockOnly,
    priceRange,
    maxPrice,
    sortBy,
  ]);

  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, [loadProducts]);

  const clearAllFilters = () => {
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
  };

  const activeFiltersCount =
    selectedAges.length +
    selectedSizes.length +
    selectedColors.length +
    selectedFabrics.length +
    selectedSeasons.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const themeClasses = themeClassMap[themeVariant] || themeClassMap.default;
  const showCardTheme = themeVariant !== "default";

  return (
    <div className={`min-h-screen ${themeClasses.page} relative`} dir="rtl">
      {themeClasses.overlay && <div className={themeClasses.overlay} />}
      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900 transition-colors">محصولات</Link>
          <span>/</span>
          <span className="text-neutral-900">{categoryTitle}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-1">
              {categoryTitle}
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                  در حال بارگذاری...
                </>
              ) : (
                `${totalProducts} محصول یافت شد`
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger className={buttonVariants({ variant: "outline", className: "lg:hidden" })}>
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                فیلترها
                {activeFiltersCount > 0 && (
                  <span className="mr-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                    categories={[]}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
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
                    hideCategoryFilter
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
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
            <div className="sticky top-8 bg-[#F5F5F5] rounded-sm p-5">
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
                categories={[]}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
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
                hideCategoryFilter
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200 mb-4" />
                    <div className="h-4 bg-neutral-200 rounded mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant={showCardTheme ? themeVariant : "default"} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-neutral-600">هیچ محصولی با این فیلترها یافت نشد.</p>
                <Button onClick={clearAllFilters} className="mt-4 bg-neutral-900 text-white hover:bg-neutral-800">
                  پاک کردن فیلترها
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em] border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              بازگشت به همه محصولات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
