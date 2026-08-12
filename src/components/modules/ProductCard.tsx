"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/useWishlist";

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

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const productUrl = `/products/${product.id}`;

  const mainImage =
    product.image ||
    product.images?.[0] ||
    "/placeholder.png";

  const hoverImage =
    product.images?.[1] ||
    product.images?.[0] ||
    product.image ||
    "/placeholder.png";

  const hasHoverImage = hoverImage && hoverImage !== mainImage;

  const toFullProduct = (): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: mainImage,
    images: product.images || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    category: product.category || "",
    subcategory: "",
    ageRange: "",
    gender: "unisex",
  });

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(toFullProduct());
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="group relative bg-white">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
        <Link href={productUrl} className="absolute inset-0 block">
          {/* Main image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ease-out ${
              hasHoverImage
                ? "opacity-100 group-hover:opacity-0"
                : "group-hover:scale-[1.03]"
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />

          {/* Hover image */}
          {hasHoverImage && (
            <Image
              src={hoverImage}
              alt={product.name}
              fill
              className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          )}
        </Link>

        {/* Badges */}
        {(product.isNew || product.isSale) && (
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-white px-2 py-1 text-[10px] font-semibold text-neutral-900 shadow-sm">
                جدید
              </span>
            )}

            {product.isSale && discount > 0 && (
              <span className="bg-[#d97757] px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
                -{discount}٪
              </span>
            )}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isWishlisted
              ? "حذف از علاقه‌مندی‌ها"
              : "افزودن به علاقه‌مندی‌ها"
          }
          className="group/btn absolute left-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-neutral-500 shadow-sm backdrop-blur transition-all duration-200 hover:bg-red-500 hover:text-white"
        >
          <Heart
            className={`h-[18px] w-[18px] transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-neutral-500 group-hover/btn:text-white"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="pt-3">
        <Link href={productUrl}>
          <h3 className="line-clamp-1 text-sm font-bold text-neutral-700 transition-colors hover:text-neutral-900">
            {product.name}
          </h3>
        </Link>

        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] font-semibold text-neutral-400">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-black text-neutral-900">
            {product.price.toLocaleString("fa-IR")} تومان
          </span>

          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {product.originalPrice.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}