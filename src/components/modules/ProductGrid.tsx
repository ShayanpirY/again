"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/modules/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "ست لباس نوزاد سوزن‌دوزی",
    category: "نوزاد",
    subcategory: "لباس نوزاد",
    price: 850000,
    originalPrice: 1200000,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop"],
    colors: ["#FFB6C1", "#E6E6FA", "#FFFFFF"],
    sizes: ["سایز ۱", "سایز ۲", "سایز ۳"],
    ageRange: "۰ تا ۱۸ ماه",
    gender: "unisex",
    isNew: true,
    isSale: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "پیراهن دخترانه طرح گل",
    category: "دختر",
    subcategory: "پیراهن",
    price: 620000,
    image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1596870230751-eb7bc4ef65b3?q=80&w=600&auto=format&fit=crop"],
    colors: ["#FFB6C1", "#FFF0F5"],
    sizes: ["سایز ۲", "سایز ۳", "سایز ۴"],
    ageRange: "۲ تا ۹ سال",
    gender: "girl",
    isNew: true,
    isSale: false,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "تی‌شرت پسرانه طرح ماشین",
    category: "پسر",
    subcategory: "تی‌شرت",
    price: 340000,
    originalPrice: 450000,
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=600&auto=format&fit=crop"],
    colors: ["#4169E1", "#87CEEB", "#FFFFFF"],
    sizes: ["سایز ۲", "سایز ۳", "سایز ۴", "سایز ۵"],
    ageRange: "۲ تا ۹ سال",
    gender: "boy",
    isNew: false,
    isSale: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "4",
    name: "شلوار جین کودک اسکینی",
    category: "کودک",
    subcategory: "شلوار",
    price: 480000,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop"],
    colors: ["#4169E1", "#000080", "#808080"],
    sizes: ["سایز ۱", "سایز ۲", "سایز ۳"],
    ageRange: "۶ تا ۳۶ ماه",
    gender: "unisex",
    isNew: false,
    isSale: false,
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "5",
    name: "پولوشرت نوجوان طرح ساده",
    category: "نوجوان",
    subcategory: "پولوشرت",
    price: 720000,
    originalPrice: 890000,
    image: "https://images.unsplash.com/photo-1566492031773-4f4f446fc1c3?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=600&auto=format&fit=crop"],
    colors: ["#FFFFFF", "#F5F5DC", "#2F4F4F"],
    sizes: ["سایز ۶", "سایز ۷", "سایز ۸"],
    ageRange: "۸ تا ۱۶ سال",
    gender: "unisex",
    isNew: true,
    isSale: true,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "6",
    name: "ست لباس نوزاد نرم",
    category: "نوزاد",
    subcategory: "ست",
    price: 950000,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop"],
    colors: ["#FFF5EE", "#F0FFF0", "#F0F8FF"],
    sizes: ["سایز ۱", "سایز ۲"],
    ageRange: "۰ تا ۱۸ ماه",
    gender: "unisex",
    isNew: true,
    isSale: false,
    rating: 4.9,
    reviewCount: 45,
  },
  {
    id: "7",
    name: "دامن دخترانه تورتیلا",
    category: "دختر",
    subcategory: "دامن",
    price: 380000,
    image: "https://images.unsplash.com/photo-1596870230751-eb7bc4ef65b3?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=600&auto=format&fit=crop"],
    colors: ["#FFB6C1", "#DDA0DD", "#FFFFFF"],
    sizes: ["سایز ۲", "سایز ۳", "سایز ۴"],
    ageRange: "۲ تا ۹ سال",
    gender: "girl",
    isNew: false,
    isSale: false,
    rating: 4.5,
    reviewCount: 112,
  },
  {
    id: "8",
    name: "کاپشن پسرانه ضد آب",
    category: "پسر",
    subcategory: "کاپشن",
    price: 1250000,
    originalPrice: 1580000,
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1566492031773-4f4f446fc1c3?q=80&w=600&auto=format&fit=crop"],
    colors: ["#2F4F4F", "#000000", "#8B4513"],
    sizes: ["سایز ۳", "سایز ۴", "سایز ۵", "سایز ۶"],
    ageRange: "۲ تا ۹ سال",
    gender: "boy",
    isNew: true,
    isSale: true,
    rating: 4.9,
    reviewCount: 78,
  },
];

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
}

export function ProductGrid({ title = "جدیدترین‌های فصل", subtitle, products = mockProducts }: ProductGridProps) {
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
      </div>
    </section>
  );
}

export { mockProducts };
