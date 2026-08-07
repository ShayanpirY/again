"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Star, Heart, Sun, Smile } from "lucide-react";

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  category?: {
    name: string;
  };
}

interface ProductCardProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  colors: string[];
  category: string;
  subcategory: string;
  ageRange: string;
  gender: "girl" | "boy" | "unisex";
  originalPrice?: number;
}

function DecorativeBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute top-10 right-10 h-24 w-24 rounded-full bg-pink-100/60 blur-2xl" />
      <div aria-hidden className="absolute bottom-16 left-10 h-28 w-28 rounded-full bg-sky-100/60 blur-2xl" />
      <div aria-hidden className="absolute top-1/3 left-1/3 h-20 w-20 rounded-full border-2 border-dashed border-amber-200 animate-[spin_40s_linear_infinite]" />
      <Sparkles aria-hidden className="absolute top-20 left-1/4 h-6 w-6 text-pink-200" />
      <Star aria-hidden className="absolute bottom-24 right-1/4 h-5 w-5 text-amber-200" />
      <Heart aria-hidden className="absolute top-1/2 right-12 h-5 w-5 text-rose-200" />
      <Sun aria-hidden className="absolute bottom-10 right-1/3 h-6 w-6 text-sky-200" />
      <Smile aria-hidden className="absolute top-40 right-1/3 h-5 w-5 text-emerald-200" />
    </>
  );
}

function SectionHeader() {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-neutral-700 shadow-sm mb-4">
        <Sparkles className="h-4 w-4 text-pink-500" />
        تازه‌های فروشگاه
      </span>
      <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 mb-3">
        جدیدترین محصولات
      </h2>
      <p className="text-neutral-600 text-sm max-w-md mx-auto">
        آخرین محصولات اضافه شده به فروشگاه
      </p>
    </div>
  );
}

export function LatestProducts() {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data: ApiProduct[] = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.slice(0, 8).map((p): ProductCardProduct => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: (p.images && p.images[0]) || "",
            images: p.images || [],
            colors: p.colors || [],
            category: p.category?.name || "",
            subcategory: "",
            ageRange: "",
            gender: "unisex",
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-sky-50/70 py-16 lg:py-24">
        <DecorativeBackdrop />
        <div className="container mx-auto px-4 relative">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200 rounded-2xl mb-4" />
                <div className="h-4 bg-neutral-200 rounded-full mb-2" />
                <div className="h-4 bg-neutral-200 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-sky-50/70 py-16 lg:py-24">
      <DecorativeBackdrop />
      <div className="container mx-auto px-4 relative">
        <SectionHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full bg-pink-500 text-white hover:bg-pink-600 px-10 py-6 text-xs font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-lg transition-all"
            >
              مشاهده همه محصولات
              <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
