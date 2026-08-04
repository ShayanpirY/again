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
  isSale?: boolean;
  originalPrice?: number;
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const res = await fetch("/api/products?sale=true");
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: (p.images && p.images[0]) || "",
            images: p.images || [],
            colors: p.colors || [],
            category: p.category?.name || "",
            isSale: p.isSale,
            originalPrice: p.originalPrice,
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-100/80 via-orange-100/50 to-white" dir="rtl">
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
    <div className="min-h-screen bg-gradient-to-b from-red-100/80 via-orange-100/50 to-white relative" dir="rtl">
      <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />
      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <span className="text-neutral-900">حراج ویژه</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">حراج ویژه</h1>
          <p className="text-neutral-600 text-sm">
            {products.length} محصول با تخفیف ویژه
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="sale" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600">در حال حاضر هیچ محصولی در حراج ویژه وجود ندارد.</p>
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
