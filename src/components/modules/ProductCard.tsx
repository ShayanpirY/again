"use client";

import { useState, useRef } from "react";
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

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ["/placeholder.png"];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const mainImage = gallery[0];
  const hoverImage = gallery[1] || gallery[0];
  const hasHoverImage = gallery.length > 1 && hoverImage !== mainImage;
  const currentMobile = gallery[index] || mainImage;

  const goTo = (i: number) => {
    if (gallery.length < 2) return;
    setIndex((i + gallery.length) % gallery.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || gallery.length < 2) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      // RTL: انگشت به چپ = بعدی
      if (diff < 0) goTo(index + 1);
      else goTo(index - 1);
    }
    touchStartX.current = null;
  };

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
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Link href={productUrl} className="absolute inset-0 block">
          {/* موبایل: عکس فعلی بر اساس index */}
          <Image
            src={currentMobile}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 md:hidden"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />

          {/* دسکتاپ: عکس اصلی + hover */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ease-out hidden md:block ${
              hasHoverImage
                ? "opacity-100 group-hover:opacity-0"
                : "group-hover:scale-[1.03]"
            }`}
            sizes="(max-width: 1200px) 33vw, 25vw"
            unoptimized
          />

          {hasHoverImage && (
            <Image
              src={hoverImage}
              alt={product.name}
              fill
              className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.02] hidden md:block"
              sizes="(max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          )}
        </Link>

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

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
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

        {/* نقاط — موبایل (و کمی دسکتاپ روی hover) */}
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {gallery.slice(0, 5).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`تصویر ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white shadow" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

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