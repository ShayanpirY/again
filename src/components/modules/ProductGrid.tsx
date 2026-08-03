"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/modules/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
}

export function ProductGrid({ products, loading = false, title }: ProductGridProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
