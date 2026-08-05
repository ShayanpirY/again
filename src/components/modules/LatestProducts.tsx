"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              جدیدترین محصولات
            </h2>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              آخرین محصولات اضافه شده به فروشگاه
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200 mb-4" />
                <div className="h-4 bg-neutral-200 rounded mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
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
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
            جدیدترین محصولات
          </h2>
          <p className="text-neutral-600 text-sm max-w-md mx-auto">
            آخرین محصولات اضافه شده به فروشگاه
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em] border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
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
