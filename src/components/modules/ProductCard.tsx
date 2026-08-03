"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    openCart();
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.isNew && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            جدید
          </Badge>
        )}
        {product.isSale && discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-white">
            {discount}%
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground capitalize">
              {product.gender === "unisex" ? "یونیسکس" : product.gender === "boy" ? "پسرانه" : "دخترانه"} • {product.ageRange}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {product.price.toLocaleString()} تومان
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 ml-2" />
          افزودن به سبد
        </Button>
      </div>
    </div>
  );
}
