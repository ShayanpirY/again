"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCart";
import { getColorName } from "@/lib/colorNames";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    colors?: string[];
    sizes?: string[];
    category?: string;
    originalPrice?: number;
    isNew?: boolean;
    isSale?: boolean;
  };
  variant?: "default" | "child" | "girl" | "boy" | "teen" | "sale";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCartStore();
  const router = useRouter();

  const isThemed = variant !== "default";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const fullProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || "",
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      category: product.category || "",
      subcategory: "",
      ageRange: "",
      gender: "unisex",
    };
    addItem(fullProduct, 1);
    openCart();
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cardClass = variant === "child"
    ? "bg-white shadow-sm rounded-2xl overflow-hidden"
    : variant === "girl"
      ? "bg-white shadow-sm rounded-2xl overflow-hidden border border-rose-100"
      : variant === "boy"
        ? "bg-white shadow-sm rounded-2xl overflow-hidden border border-emerald-100"
        : variant === "teen"
          ? "bg-white shadow-sm rounded-2xl overflow-hidden border border-purple-50"
          : variant === "sale"
            ? "bg-white shadow-sm rounded-2xl overflow-hidden border border-red-100"
            : "bg-white";

  return (
    <div
      className={`group relative ${cardClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className={`block relative aspect-[3/4] overflow-hidden ${isThemed ? "bg-neutral-50" : "bg-neutral-100"}`}>
        {/* Main Image */}
        <Image
          src={isHovered && product.images?.[0] ? product.images[0] : (product.image || "/placeholder.png")}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-medium tracking-wider">
              جدید
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-medium tracking-wider">
              -{discount}٪
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-red-600 text-red-600" : "text-neutral-700"
            }`}
          />
        </button>

        {/* Quick Actions Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-3 text-xs font-medium tracking-wider"
            >
              <ShoppingBag className="h-4 w-4 ml-2" />
              افزودن به سبد
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/products/${product.id}`)}
              aria-label="مشاهده محصول"
              className="h-10 w-10 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-none"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-4 space-y-2">
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="w-3.5 h-3.5 rounded-full border border-neutral-200"
                style={{ backgroundColor: color }}
                title={getColorName(color)}
              />
            ))}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            {product.price.toLocaleString("fa-IR")} تومان
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-500 line-through">
              {product.originalPrice.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
