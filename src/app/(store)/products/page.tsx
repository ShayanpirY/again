"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { ProductEmptyState } from "@/components/modules/ProductEmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getColorName } from "@/lib/colorNames";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AGE_GROUPS = [
  { id: "newborn", label: "نوزاد" },
  { id: "baby", label: "کودک نوپا" },
  { id: "girl", label: "دختر" },
  { id: "boy", label: "پسر" },
  { id: "pre-teen", label: "نوجوان" },
];

const STANDARD_SIZES = [
  "۰-۳ ماه",
  "۳-۶ ماه",
  "۶-۱۲ ماه",
  "۱-۲ سال",
  "۲-۴ سال",
  "۴-۶ سال",
  "۶-۸ سال",
  "۸-۱۰ سال",
  "سایز ۱",
  "سایز ۲",
  "سایز ۳",
  "سایز ۴",
];

const FABRICS = ["پنبه", "پلی‌استر", "نخی", "پشم", "الیاف مصنوعی", "مخلوط"];
const SEASONS = ["بهار", "تابستان", "پاییز", "زمستان"];
const PAGE_SIZE = 12;

function FilterContent({
  categories,
  selectedCategories,
  setSelectedCategories,
  selectedAges,
  setSelectedAges,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  selectedFabrics,
  setSelectedFabrics,
  selectedSeasons,
  setSelectedSeasons,
  selectedBrands,
  setSelectedBrands,
  inStockOnly,
  setInStockOnly,
  priceRange,
  setPriceRange,
  maxPrice,
  allColors,
  allBrands,
  activeFiltersCount,
  clearAllFilters,
}: {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (values: string[]) => void;
  selectedAges: string[];
  setSelectedAges: (values: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (values: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (values: string[]) => void;
  selectedFabrics: string[];
  setSelectedFabrics: (values: string[]) => void;
  selectedSeasons: string[];
  setSelectedSeasons: (values: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (values: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  maxPrice: number;
  allColors: string[];
  allBrands: string[];
  activeFiltersCount: number;
  clearAllFilters: () => void;
}) {
  const toggleFilter = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">دسته‌بندی</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() =>
                  toggleFilter(category.id, selectedCategories, setSelectedCategories)
                }
              />
              <label
                htmlFor={`cat-${category.id}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Age Groups */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">رده سنی</h3>
        <div className="space-y-2">
          {AGE_GROUPS.map((age) => (
            <div key={age.id} className="flex items-center gap-2">
              <Checkbox
                id={`age-${age.id}`}
                checked={selectedAges.includes(age.id)}
                onCheckedChange={() =>
                  toggleFilter(age.id, selectedAges, setSelectedAges)
                }
              />
              <label
                htmlFor={`age-${age.id}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {age.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">سایز</h3>
        <div className="space-y-2">
          {STANDARD_SIZES.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() =>
                  toggleFilter(size, selectedSizes, setSelectedSizes)
                }
              />
              <label
                htmlFor={`size-${size}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">رنگ</h3>
        <div className="space-y-2">
          {allColors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                toggleFilter(color, selectedColors, setSelectedColors)
              }
            >
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() =>
                  toggleFilter(color, selectedColors, setSelectedColors)
                }
              />
              <span
                className="w-4 h-4 rounded-full border border-neutral-200 inline-block"
                style={{ backgroundColor: color }}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {getColorName(color)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">محدوده قیمت</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            step={100000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>{priceRange[0].toLocaleString("fa-IR")} تومان</span>
            <span>{priceRange[1].toLocaleString("fa-IR")} تومان</span>
          </div>
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">جنس پارچه</h3>
        <div className="space-y-2">
          {FABRICS.map((fabric) => (
            <div key={fabric} className="flex items-center gap-2">
              <Checkbox
                id={`fabric-${fabric}`}
                checked={selectedFabrics.includes(fabric)}
                onCheckedChange={() =>
                  toggleFilter(fabric, selectedFabrics, setSelectedFabrics)
                }
              />
              <label
                htmlFor={`fabric-${fabric}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {fabric}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Season */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">فصل</h3>
        <div className="space-y-2">
          {SEASONS.map((season) => (
            <div key={season} className="flex items-center gap-2">
              <Checkbox
                id={`season-${season}`}
                checked={selectedSeasons.includes(season)}
                onCheckedChange={() =>
                  toggleFilter(season, selectedSeasons, setSelectedSeasons)
                }
              />
              <label
                htmlFor={`season-${season}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {season}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">برند</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() =>
                  toggleFilter(brand, selectedBrands, setSelectedBrands)
                }
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) =>
              setInStockOnly(checked as boolean)
            }
          />
          <label
            htmlFor="in-stock"
            className="text-sm font-medium text-neutral-900 cursor-pointer"
          >
            فقط کالاهای موجود
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="h-4 w-4 ml-2" />
          پاک کردن همه فیلترها
        </Button>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const seqRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/products?limit=1000");
        const data: ApiProduct[] = await res.json();

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

        const categorySlugs = selectedCategories
          .map((id) => categories.find((c) => c.id === id)?.slug)
          .filter((slug): slug is string => Boolean(slug));
        if (categorySlugs.length > 0) {
          params.set("category", categorySlugs.join(","));
        }

        if (selectedAges.length > 0) {
          params.set("age", selectedAges.join(","));
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

        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ApiProduct[] = await res.json();
        if (seq !== seqRef.current) return;

        setProducts((prev) => (replace ? data : [...prev, ...data]));
        setTotalProducts(Number(res.headers.get("X-Total-Count")) || data.length);
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
    load();
    return () => {
      seqRef.current += 1;
    };
  }, [fetchPage]);

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
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <span className="text-neutral-900">همه محصولات</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-1">
              همه محصولات
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                  {products.length > 0 ? "در حال به‌روزرسانی..." : "در حال بارگذاری..."}
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
                  <FilterContent
                    categories={categories}
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
              <FilterContent
                categories={categories}
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
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200 mb-4" />
                    <div className="h-4 bg-neutral-200 rounded mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
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
                    <div className="h-8 w-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <ProductEmptyState onReset={clearAllFilters} />
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              {loadingMore && (
                <div className="h-8 w-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
