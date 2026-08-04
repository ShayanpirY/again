"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
  girl: "دختر",
  boy: "پسر",
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
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>("default");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const resolvedParams = await params;
        const slugSegments = resolvedParams.slug || [];
        const mainSlug = slugSegments[0] || "";
        
        const categoryName = slugToCategoryMap[mainSlug];
        const theme = categoryThemeMap[mainSlug] || "default";
        setThemeVariant(theme);
        
        if (!categoryName) {
          setProducts([]);
          setLoading(false);
          return;
        }

        setCategoryTitle(categoryName);

        const res = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: (p.images && p.images[0]) || "",
            images: p.images || [],
            colors: p.colors || [],
            category: p.category?.name || categoryName,
          }));
          setProducts(mapped as Product[]);
        }
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [params]);

  if (loading) {
    const themeClasses = themeClassMap[themeVariant] || themeClassMap.default;
    return (
      <div className={`min-h-screen ${themeClasses.page}`} dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">{categoryTitle}</h1>
          <p className="text-neutral-600 text-sm">
            {products.length} محصول یافت شد
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant={showCardTheme ? themeVariant : "default"} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600">هیچ محصولی در این دسته‌بندی یافت نشد.</p>
            <Link href="/products">
              <Button className="mt-4 bg-neutral-900 text-white hover:bg-neutral-800">
                مشاهده همه محصولات
              </Button>
            </Link>
          </div>
        )}

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
