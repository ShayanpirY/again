"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";

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

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  colors?: string[];
  category?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data: ApiProduct[] = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: (p.images && p.images[0]) || "",
            images: p.images || [],
            colors: p.colors || [],
            category: p.category?.name || "",
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <span className="text-neutral-900">همه محصولات</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">همه محصولات</h1>
          <p className="text-neutral-600 text-sm">
            {products.length} محصول یافت شد
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600">هیچ محصولی یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
