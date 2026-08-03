"use client";

import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";

interface ProductGridProps {
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ title = "جدیدترین‌های فصل", subtitle }: ProductGridProps) {
  const products = useProductStore((state) => state.products);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none px-8 py-6 text-xs font-semibold uppercase tracking-[0.15em] border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  مشاهده همه محصولات
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600">هیچ محصولی یافت نشد.</p>
          </div>
        )}
      </div>
    </section>
  );
}
