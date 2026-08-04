"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Variant {
  id: string;
  color?: string;
  size?: string;
  stock: number;
  sku?: string;
  price?: number;
}

interface ProductOptionsProps {
  title: string;
  brand?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  rating?: number;
  stock: number;
  colors: string[];
  sizes: string[];
  variants: Variant[];
  onAddToCart: (color?: string, size?: string) => void;
}

const defaultColors = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"];

const sizeGuideData = [
  { size: "۳ تا ۶ ماه", height: "۶۲-۶۸", chest: "۴۲-۴۴", waist: "۴۲-۴۴" },
  { size: "۶ تا ۱۲ ماه", height: "۶۸-۷۴", chest: "۴۴-۴۶", waist: "۴۴-۴۶" },
  { size: "۱ تا ۲ سال", height: "۷۴-۸۰", chest: "۴۶-۴۸", waist: "۴۶-۴۸" },
  { size: "۲ تا ۳ سال", height: "۸۰-۸۶", chest: "۴۸-۵۰", waist: "۴۸-۵۰" },
  { size: "۳ تا ۴ سال", height: "۸۶-۹۲", chest: "۵۰-۵۲", waist: "۵۰-۵۲" },
];

export function ProductOptions({
  title,
  brand,
  sku,
  price,
  salePrice,
  rating = 0,
  stock,
  colors,
  sizes,
  variants,
  onAddToCart,
}: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const availableColors = variants && variants.length > 0
    ? [...new Set(variants.map(v => v.color).filter(Boolean))] as string[]
    : (colors && colors.length > 0 ? colors : defaultColors);

  const availableSizes = variants && variants.length > 0
    ? [...new Set(variants.map(v => v.size).filter(Boolean))] as string[]
    : (sizes || []);

  const isSizeOutOfStock = (size: string): boolean => {
    if (!selectedColor) {
      const sizeVariants = variants.filter(v => v.size === size);
      if (sizeVariants.length === 0) return false;
      return sizeVariants.every(v => v.stock === 0);
    }

    const variant = variants.find(v => v.size === size && v.color === selectedColor);
    if (!variant) return false;
    return variant.stock === 0;
  };

  const getCurrentStock = (): number => {
    if (selectedSize && selectedColor) {
      const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (variant) return variant.stock;
    }
    if (selectedColor) {
      const colorVariants = variants.filter(v => v.color === selectedColor);
      if (colorVariants.length > 0) return colorVariants.reduce((sum, v) => sum + v.stock, 0);
    }
    if (variants.length > 0) return variants.reduce((sum, v) => sum + v.stock, 0);
    return stock;
  };

  const currentStock = getCurrentStock();
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(selectedColor || undefined, selectedSize || undefined);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
            }`}
          />
        ))}
        <span className="text-xs text-neutral-500 mr-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title, Brand, SKU, Rating */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {brand && (
            <Badge variant="secondary" className="text-xs font-semibold">
              {brand}
            </Badge>
          )}
          {sku && (
            <span className="text-xs text-neutral-500">کد کالا: {sku}</span>
          )}
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight mb-2">
          {title}
        </h1>
        {rating > 0 && renderStars(rating)}
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-neutral-900">
          {salePrice ? salePrice.toLocaleString("fa-IR") : price.toLocaleString("fa-IR")}
          <span className="text-base font-normal text-neutral-600 mr-1">تومان</span>
        </span>
        {salePrice && salePrice < price && (
          <span className="text-lg text-neutral-500 line-through">
            {price.toLocaleString("fa-IR")} تومان
          </span>
        )}
        {salePrice && salePrice < price && (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            {Math.round(((price - salePrice) / price) * 100)}% تخفیف
          </Badge>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <Badge
          variant={isOutOfStock ? "destructive" : "default"}
          className={isOutOfStock ? "" : "bg-green-100 text-green-700 hover:bg-green-100"}
        >
          {isOutOfStock ? "ناموجود" : `موجود در انبار (${currentStock} عدد)`}
        </Badge>
      </div>

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <span className="text-sm font-semibold text-neutral-900">
            رنگ: {selectedColor || "انتخاب کنید"}
          </span>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color
                    ? "border-neutral-900 scale-110 shadow-md"
                    : "border-neutral-300 hover:border-neutral-400 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900">
              سایز: {selectedSize || "انتخاب کنید"}
            </span>
            <Dialog>
              <DialogTrigger>
                <Button
                  variant="link"
                  className="text-xs text-neutral-600 hover:text-neutral-900 p-0 h-auto"
                >
                  جدول راهنمای سایز
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>راهنمای سایز</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="py-2 px-3 font-semibold text-neutral-900">سایز</th>
                        <th className="py-2 px-3 font-semibold text-neutral-900">قد (cm)</th>
                        <th className="py-2 px-3 font-semibold text-neutral-900">دور سینه (cm)</th>
                        <th className="py-2 px-3 font-semibold text-neutral-900">دور کمر (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.map((row) => (
                        <tr key={row.size} className="border-b border-neutral-100 last:border-0">
                          <td className="py-2.5 px-3 text-neutral-900 font-medium">{row.size}</td>
                          <td className="py-2.5 px-3 text-neutral-600">{row.height}</td>
                          <td className="py-2.5 px-3 text-neutral-600">{row.chest}</td>
                          <td className="py-2.5 px-3 text-neutral-600">{row.waist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const sizeIsOutOfStock = isSizeOutOfStock(size);
              return (
                <button
                  key={size}
                  onClick={() => !sizeIsOutOfStock && setSelectedSize(size)}
                  disabled={sizeIsOutOfStock}
                  className={`px-4 py-2.5 text-sm font-medium border rounded-sm transition-all duration-200 ${
                    selectedSize === size
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : sizeIsOutOfStock
                        ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                        : "border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  {size}
                  {sizeIsOutOfStock && " (ناموجود)"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-6 text-sm font-semibold tracking-wider disabled:bg-neutral-400 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? "ناموجود" : "افزودن به سبد خرید"}
      </Button>
    </div>
  );
}
