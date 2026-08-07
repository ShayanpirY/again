"use client";

import { useState, useEffect, useMemo } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { ProductEmptyState } from "@/components/modules/ProductEmptyState";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductData {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  category?: { name: string };
  isNew?: boolean;
  isSale?: boolean;
}

function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-neutral-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-neutral-200 mb-4" />
              <div className="h-4 bg-neutral-200 rounded mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const agesKey = searchParams.get("age") || "";
  const sizesKey = searchParams.get("sizes") || "";
  const colorsKey = searchParams.get("colors") || "";
  const inStockKey = searchParams.get("inStock") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const ages = useMemo(() => agesKey.split(",").filter(Boolean), [agesKey]);
  const sizes = useMemo(() => sizesKey.split(",").filter(Boolean), [sizesKey]);
  const colors = useMemo(() => colorsKey.split(",").filter(Boolean), [colorsKey]);
  const inStock = inStockKey === "true";

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (ages.length > 0) params.set("age", ages.join(","));
        if (sizes.length > 0) params.set("sizes", sizes.join(","));
        if (colors.length > 0) params.set("colors", colors.join(","));
        if (inStock) params.set("inStock", "true");
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        params.set("limit", "100");
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setTotalCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to fetch products:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, [ages, sizes, colors, inStock, minPrice, maxPrice]);

  const activeFiltersCount =
    ages.length +
    sizes.length +
    colors.length +
    (inStock ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const clearAllFilters = () => {
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900">فروشگاه</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-1">
              فروشگاه
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                  {products.length > 0 ? "در حال به‌روزرسانی..." : "در حال بارگذاری..."}
                </>
              ) : (
                `${totalCount} محصول یافت شد`
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                <X className="h-3 w-3 ml-1" />
                پاک کردن همه
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <ProductFilters />

          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageContent />
    </Suspense>
  );
}