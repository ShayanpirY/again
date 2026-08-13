"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Share2, Truck, Shield, ChevronLeft, ChevronRight, Star, MessageSquare, HelpCircle, Play, Ruler, BadgeCheck, ChevronDown, MessageCircleQuestion, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCart";
import { useWishlistStore } from "@/store/useWishlist";
import { Product as StoreProduct } from "@/types";
import { SizeGuideModal } from "@/components/modules/SizeGuideModal";
import { getColorName } from "@/lib/colorNames";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  category?: { name: string; slug?: string };
  brand?: string;
  ageGroup?: string;
  season?: string;
  fabric?: string;
  gender?: string;
  type?: string;
  videoUrl?: string;
  sizeChart?: string;
  stock: number;
  variants: Variant[];
  reviews: Review[];
  questions: Question[];
}

interface Variant {
  id: string;
  color?: string;
  size?: string;
  stock: number;
  sku?: string;
  price?: number;
  image?: string;
}

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer?: boolean;
}

interface Question {
  id: string;
  authorName: string;
  question: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  category?: { name: string };
}

type RawRecord = Record<string, unknown>;

function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as RawRecord;
  const id = typeof r.id === "string" ? r.id : "";
  const title = (typeof r.title === "string" ? r.title : typeof r.name === "string" ? r.name : "") as string;
  if (!id || !title) return null;

  let images: string[] = [];
  if (Array.isArray(r.images)) {
    images = (r.images as unknown[]).filter((i): i is string => typeof i === "string" && Boolean(i));
  } else if (typeof r.image === "string" && r.image) {
    images = [r.image];
  }

  const categoryName =
    r.category && typeof r.category === "object"
      ? (r.category as RawRecord).name
      : typeof r.category === "string"
      ? r.category
      : "";
  const categorySlug =
    r.category && typeof r.category === "object"
      ? (r.category as RawRecord).slug
      : undefined;

  return {
    id,
    title,
    price: Number(r.price) || 0,
    originalPrice: r.originalPrice != null ? Number(r.originalPrice) : undefined,
    isSale: Boolean(r.isSale),
    description: typeof r.description === "string" ? r.description : "",
    images,
    colors: Array.isArray(r.colors) ? (r.colors as unknown[]).filter((c): c is string => typeof c === "string") : [],
    sizes: Array.isArray(r.sizes) ? (r.sizes as unknown[]).filter((s): s is string => typeof s === "string") : [],
    gender: typeof r.gender === "string" ? r.gender : "",
    type: typeof r.type === "string" ? r.type : "",
    category: { name: typeof categoryName === "string" ? categoryName : "", slug: typeof categorySlug === "string" ? categorySlug : undefined },
    brand: typeof r.brand === "string" ? r.brand : "",
    ageGroup: typeof r.ageGroup === "string" ? r.ageGroup : "",
    season: typeof r.season === "string" ? r.season : "",
    fabric: typeof r.fabric === "string" ? r.fabric : "",
    videoUrl: typeof r.videoUrl === "string" ? r.videoUrl : undefined,
    sizeChart: typeof r.sizeChart === "string" ? r.sizeChart : undefined,
    stock: Number(r.stock) || 0,
    variants: Array.isArray(r.variants) ? (r.variants as Variant[]) : [],
    reviews: Array.isArray(r.reviews) ? (r.reviews as Review[]) : [],
    questions: Array.isArray(r.questions) ? (r.questions as Question[]) : [],
  };
}

function normalizeRelatedProduct(raw: unknown): RelatedProduct | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as RawRecord;
  const id = typeof r.id === "string" ? r.id : "";
  const title = (typeof r.title === "string" ? r.title : typeof r.name === "string" ? r.name : "") as string;
  if (!id || !title) return null;

  let images: string[] = [];
  if (Array.isArray(r.images)) {
    images = (r.images as unknown[]).filter((i): i is string => typeof i === "string" && Boolean(i));
  } else if (typeof r.image === "string" && r.image) {
    images = [r.image];
  }

  const categoryName =
    r.category && typeof r.category === "object"
      ? (r.category as RawRecord).name
      : typeof r.category === "string"
      ? r.category
      : "";

  return {
    id,
    title,
    price: Number(r.price) || 0,
    images,
    colors: Array.isArray(r.colors) ? (r.colors as unknown[]).filter((c): c is string => typeof c === "string") : [],
    category: { name: typeof categoryName === "string" ? categoryName : "" },
  };
}

const GENDER_LABELS: Record<string, string> = {
  girl: "دخترانه",
  female: "دخترانه",
  boy: "پسرانه",
  male: "پسرانه",
  unisex: "لباس مشترک",
};

const TYPE_LABELS: Record<string, string> = {
  tshirt: "تی‌شرت",
  dress: "پیراهن",
  pants: "شلوار",
  jeans: "جین",
  set: "ست",
  knitwear: "بافت",
  outerwear: "بیرونی",
  shoes: "کفش",
};

const normalizeGender = (gender?: string): string => {
  if (!gender) return "";
  const g = gender.trim().toLowerCase();
  return GENDER_LABELS[g] || gender;
};

const normalizeType = (type?: string): string => {
  if (!type) return "";
  const t = type.trim().toLowerCase();
  return TYPE_LABELS[t] || type;
};

const defaultColors = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"];

const LOW_STOCK_THRESHOLD = 5;

type StockLevel = "in" | "low" | "out";

const getStockLevel = (stock: number): StockLevel => {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
};

const STOCK_LABELS: Record<StockLevel, string> = {
  in: "موجود",
  low: "کم موجود",
  out: "ناموجود",
};

const STOCK_TEXT_COLORS: Record<StockLevel, string> = {
  in: "text-green-600",
  low: "text-amber-600",
  out: "text-red-600",
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState<"image" | "video">("image");
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });
  const [questionForm, setQuestionForm] = useState({ authorName: "", question: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { addItem, openCart } = useCartStore();
  const { toggleItem: toggleWishlistItem, isInWishlist } = useWishlistStore();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const fetchProduct = useCallback(async () => {
    setFetchError(null);
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeProduct(data?.product ?? data);
        if (normalized) {
          setProduct(normalized);
          const related: unknown[] = Array.isArray(data?.relatedProducts) ? data.relatedProducts : [];
          setRelatedProducts(related.map((p) => normalizeRelatedProduct(p)).filter((p): p is RelatedProduct => Boolean(p)));
          return;
        }
      }

      const listRes = await fetch("/api/products?limit=1000");
      if (listRes.ok) {
        const list: unknown = await listRes.json();
        if (Array.isArray(list)) {
          const found = list.find((p) => {
            const id = p && typeof p === "object" ? (p as RawRecord).id : undefined;
            return String(id) === String(productId);
          });
          const normalized = normalizeProduct(found);
          if (normalized) {
            setProduct(normalized);
            return;
          }
        }
      }

      setProduct(null);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setProduct(null);
      setFetchError("خطا در دریافت اطلاعات محصول. لطفاً دوباره تلاش کنید.");
    }
  }, [productId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setProduct(null);
      setRelatedProducts([]);
      setSelectedImage(0);
      setSelectedColor(null);
      setSelectedSize(null);
      setMediaTab("image");
      setIsZoomed(false);
      await fetchProduct();
      setLoading(false);
    };
    load();
  }, [fetchProduct]);

  const allImages = product 
    ? [product.images?.[0] || "", ...(product.images?.slice(1) || [])].filter(Boolean)
    : [];
  const safeSelectedImage = allImages.length > 0 ? Math.min(selectedImage, allImages.length - 1) : 0;

  const availableColors = product?.variants && product.variants.length > 0
    ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] as string[]
    : (product?.colors && product.colors.length > 0 ? product.colors : defaultColors);

  const availableSizes = product?.variants && product.variants.length > 0
    ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] as string[]
    : (product?.sizes || []);

  const selectedVariant = product?.variants.find(v => {
    const colorMatch = !selectedColor || v.color === selectedColor;
    const sizeMatch = !selectedSize || v.size === selectedSize;
    return colorMatch && sizeMatch;
  });

  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const currentStockLevel = getStockLevel(currentStock);

  const getColorStock = (color: string): number | null => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    const matching = product.variants.filter(v => v.color === color);
    if (matching.length === 0) return null;
    return matching.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  const getSizeStock = (size: string): number => {
    if (product && product.variants && product.variants.length > 0) {
      const matching = product.variants.filter(
        v => v.size === size && (!selectedColor || v.color === selectedColor)
      );
      if (matching.length > 0) return matching.reduce((sum, v) => sum + (v.stock || 0), 0);
      return 0;
    }
    return product?.stock ?? 0;
  };

  const selectedSizeStock = selectedSize !== null ? getSizeStock(selectedSize) : null;
  const selectedSizeLevel = selectedSizeStock !== null
    ? getStockLevel(selectedSizeStock)
    : currentStockLevel;

  const ratingCounts = product?.reviews.reduce<number[]>(
    (acc, r) => {
      const idx = Math.min(Math.max(Math.round(r.rating), 1), 5);
      acc[idx] = (acc[idx] || 0) + 1;
      return acc;
    },
    [0, 0, 0, 0, 0, 0]
  ) ?? [0, 0, 0, 0, 0, 0];

  const averageRating = product && product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const toggleQuestion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? null : id));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedColor && availableColors.length > 0) {
      alert("لطفاً رنگ را انتخاب کنید.");
      return;
    }
    if (!selectedSize && availableSizes.length > 0) {
      alert("لطفاً سایز را انتخاب کنید.");
      return;
    }
    addItem({
      id: product!.id,
      name: product!.title,
      price: product!.price,
      image: product!.images?.[0] || "",
      images: product!.images || [],
      colors: availableColors,
      category: product!.category?.name || "",
      subcategory: "",
      sizes: availableSizes,
      ageRange: product!.ageGroup || "",
      gender: (normalizeGender(product!.gender) || "unisex").toLowerCase() as "girl" | "boy" | "unisex",
    }, 1, selectedColor || undefined, selectedSize || undefined);
    openCart();
  };

  const toWishlistProduct = (): StoreProduct => ({
    id: product!.id,
    name: product!.title,
    category: product!.category?.name || "",
    subcategory: "",
    price: product!.price,
    image: product!.images?.[0] || "",
    images: product!.images || [],
    colors: availableColors,
    sizes: availableSizes,
    ageRange: product!.ageGroup || "",
    gender: (normalizeGender(product!.gender) || "unisex").toLowerCase() as "girl" | "boy" | "unisex",
    originalPrice: product!.originalPrice,
    isSale: product!.isSale,
    description: product!.description,
  });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlistItem(toWishlistProduct());
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setReviewForm({ authorName: "", rating: 5, comment: "" });
      await fetchProduct();
      alert("نظر شما با موفقیت ثبت شد.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("خطا در ثبت نظر.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuestion(true);
    try {
      const res = await fetch(`/api/products/${productId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionForm),
      });
      if (!res.ok) throw new Error("Failed to submit question");
      setQuestionForm({ authorName: "", question: "" });
      await fetchProduct();
      alert("سوال شما با موفقیت ثبت شد.");
    } catch (error) {
      console.error("Failed to submit question:", error);
      alert("خطا در ثبت سوال.");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]" dir="rtl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#d97757] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]" dir="rtl">
        <div className="text-center space-y-4">
          {fetchError ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">خطا در دریافت محصول</h1>
              <p className="text-neutral-600">{fetchError}</p>
              <Button
                className="rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c]"
                onClick={() => { setLoading(true); fetchProduct().finally(() => setLoading(false)); }}
              >
                تلاش مجدد
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">محصول یافت نشد</h1>
              <p className="text-neutral-600">متأسفانه محصول مورد نظر شما وجود ندارد.</p>
            </>
          )}
          <div>
            <Link href="/products">
              <Button className="rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c]">
                بازگشت به فروشگاه
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8 flex-wrap">
          <Link href="/" className="hover:text-[#d97757] transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/products" className="font-bold text-neutral-900 hover:text-[#d97757] transition-colors">
            همه محصولات
          </Link>
          {product.category?.name && (
            <>
              <span>/</span>
              {product.category?.slug ? (
                <Link href={`/category/${product.category.slug}`} className="text-neutral-600 hover:text-[#d97757] transition-colors">
                  {product.category.name}
                </Link>
              ) : (
                <span className="text-neutral-600">{product.category.name}</span>
              )}
            </>
          )}
          <span>/</span>
          <span className="text-neutral-900 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right: Media Gallery */}
          <div className="space-y-4">
            {/* Main Image/Video */}
            <div 
              ref={imageContainerRef}
              className={`relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] ${mediaTab === "video" ? "" : "cursor-crosshair"}`}
              onMouseEnter={() => mediaTab !== "video" && setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.videoUrl && mediaTab === "video" ? (
                <video
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  poster={allImages[0]}
                />
              ) : allImages.length > 0 && (
                <Image
                  src={allImages[safeSelectedImage]}
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              )}
            </div>

            {/* Thumbnails */}
            {(allImages.length > 1 || product.videoUrl) && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.videoUrl && (
                  <button
                    key="video-tab"
                    onClick={() => { setMediaTab("video"); setIsZoomed(false); }}
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                      mediaTab === "video" ? "border-[#d97757]" : "border-neutral-200 hover:border-[#d97757]"
                    }`}
                    style={{ backgroundImage: `url(${allImages[0]})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    title="ویدیو محصول"
                    aria-label="ویدیو محصول"
                  >
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90">
                        <Play className="h-4 w-4 text-neutral-900 fill-neutral-900 ml-0.5" />
                      </span>
                    </span>
                    <span className="absolute bottom-1 right-1 text-[10px] font-medium text-white drop-shadow">ویدیو</span>
                  </button>
                )}
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedImage(index); setMediaTab("image"); }}
                    onMouseEnter={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                      mediaTab === "image" && safeSelectedImage === index
                        ? "border-[#d97757]"
                        : "border-neutral-200 hover:border-[#d97757]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - تصویر ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left: Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                {product.ageGroup && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span className="text-xs text-neutral-500">{product.ageGroup}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-neutral-900">
                  {product.price.toLocaleString("fa-IR")} <span className="text-base font-normal text-neutral-600">تومان</span>
                </span>
                {product.isSale && product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    {product.originalPrice.toLocaleString("fa-IR")}
                  </span>
                )}
                {product.isSale && product.originalPrice && product.originalPrice > product.price && (
                  <span className="px-2.5 py-1 bg-[#d97757] text-white text-xs font-semibold rounded-full">
                    ٪{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-3 p-5 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              {product.category?.name && (
                <div>
                  <p className="text-xs text-neutral-500">دسته‌بندی</p>
                  <p className="text-sm font-medium text-neutral-900">{product.category.name}</p>
                </div>
              )}
              {product.gender && (
                <div>
                  <p className="text-xs text-neutral-500">جنسیت</p>
                  <p className="text-sm font-medium text-neutral-900">{normalizeGender(product.gender)}</p>
                </div>
              )}
              {product.type && (
                <div>
                  <p className="text-xs text-neutral-500">نوع</p>
                  <p className="text-sm font-medium text-neutral-900">{normalizeType(product.type)}</p>
                </div>
              )}
              {product.fabric && (
                <div>
                  <p className="text-xs text-neutral-500">جنس پارچه</p>
                  <p className="text-sm font-medium text-neutral-900">{product.fabric}</p>
                </div>
              )}
              {product.season && (
                <div>
                  <p className="text-xs text-neutral-500">فصل</p>
                  <p className="text-sm font-medium text-neutral-900">{product.season}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500">موجودی</p>
                <p className={`text-sm font-medium ${STOCK_TEXT_COLORS[currentStockLevel]}`}>
                  {STOCK_LABELS[currentStockLevel]}
                  {currentStock > 0 ? ` (${currentStock.toLocaleString("fa-IR")} عدد)` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">راهنمای سایز</p>
                <Button
                  variant="link"
                  className="text-xs text-neutral-600 hover:text-[#d97757] p-0 h-auto"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  مشاهده جدول سایز
                </Button>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                <h2 className="text-sm font-semibold text-neutral-900 mb-2">توضیحات محصول</h2>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">انتخاب رنگ</span>
                  {selectedColor && (
                    <span className="text-sm text-neutral-600">{getColorName(selectedColor)}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const colorStock = getColorStock(color);
                    const colorOut = colorStock === 0;
                    const colorLabel = colorOut ? `${getColorName(color)} (ناموجود)` : getColorName(color);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === color
                            ? "border-[#d97757] scale-110"
                            : "border-neutral-300 hover:border-[#d97757]"
                        } ${colorOut ? "opacity-50" : ""}`}
                        style={{ backgroundColor: color, boxShadow: selectedColor === color ? "0 0 0 3px rgba(217,119,87,0.25)" : undefined }}
                        title={colorLabel}
                        aria-label={colorLabel}
                      >
                        {colorOut && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-px h-7 bg-red-600 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">انتخاب سایز</span>
                  <Button
                    variant="link"
                    className="flex items-center gap-1 text-xs text-neutral-600 hover:text-[#d97757] p-0 h-auto"
                    onClick={() => setIsSizeGuideOpen(true)}
                  >
                    <Ruler className="h-4 w-4" />
                    جدول سایز
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const sizeStock = getSizeStock(size);
                    const sizeLevel = getStockLevel(sizeStock);
                    const isOutOfStock = sizeLevel === "out";
                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`flex flex-col items-center min-w-[68px] px-3 py-2 text-sm font-medium border rounded-full transition-all ${
                          selectedSize === size
                            ? "border-[#d97757] bg-[#d97757] text-white shadow-[0_4px_12px_rgba(217,119,87,0.35)]"
                            : isOutOfStock
                              ? "border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
                              : "border-neutral-200 text-neutral-700 hover:border-[#d97757] hover:text-[#d97757]"
                        }`}
                      >
                        <span>{size}</span>
                        <span className={`text-[10px] mt-0.5 font-normal ${
                          selectedSize === size ? "text-white/80" : STOCK_TEXT_COLORS[sizeLevel]
                        }`}>
                          {STOCK_LABELS[sizeLevel]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedSizeStock !== null && (
                  <p className={`text-xs font-medium ${STOCK_TEXT_COLORS[selectedSizeLevel]}`}>
                    {STOCK_LABELS[selectedSizeLevel]}
                    {selectedSizeStock > 0
                      ? ` - ${selectedSizeStock.toLocaleString("fa-IR")} عدد موجود`
                      : " - این سایز فعلاً موجود نیست"}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart & Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className="w-full rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c] py-6 text-sm font-semibold tracking-wider shadow-[0_8px_20px_rgba(217,119,87,0.3)] transition-all disabled:bg-neutral-300 disabled:shadow-none"
              >
                {currentStock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
              </Button>
              <Button variant="outline" className="w-full rounded-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-[#d97757] py-6">
                <Share2 className="h-5 w-5 ml-2" />
                اشتراک‌گذاری
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className={`w-full rounded-full py-6 ${
                  isWishlisted
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
                    : "border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-[#d97757]"
                }`}
              >
                <Heart className={`h-5 w-5 ml-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              </Button>

              {/* Category Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href={product.category?.slug ? `/category/${product.category.slug}` : "/products"}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-800 hover:border-[#d97757] hover:text-[#d97757] transition-colors"
                >
                  همه محصولات این بخش
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-800 hover:border-[#d97757] hover:text-[#d97757] transition-colors"
                >
                  مشاهده همه محصولات فروشگاه
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-full">
                  <Truck className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">ارسال سریع</p>
                  <p className="text-xs text-neutral-600">ارسال در کمتر از ۲۴ ساعت</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-full">
                  <Shield className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">ضمانت اصالت</p>
                  <p className="text-xs text-neutral-600">۱۰۰٪ تضمین کیفیت</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <Tabs defaultValue="reviews" className="w-full" dir="rtl">
            <TabsList className="w-full sm:w-auto justify-start sm:justify-start gap-1 inline-flex p-1.5 bg-white rounded-full border border-neutral-200 shadow-[0_6px_20px_rgba(0,0,0,0.04)] h-auto">
              <TabsTrigger 
                value="reviews" 
                className="rounded-full px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-[#d97757] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(217,119,87,0.35)] text-neutral-600 hover:text-[#d97757]"
              >
                <MessageSquare className="h-4 w-4 ml-2" />
                نظرات کاربران ({product.reviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="questions"
                className="rounded-full px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-[#d97757] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(217,119,87,0.35)] text-neutral-600 hover:text-[#d97757]"
              >
                <HelpCircle className="h-4 w-4 ml-2" />
                سوالات متداول ({product.questions.length})
              </TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Rating Summary */}
                  <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <div className="sm:w-40 shrink-0 flex flex-col items-center justify-center">
                      <p className="text-5xl font-bold text-neutral-900">
                        {averageRating.toLocaleString("fa-IR")}
                      </p>
                      <div className="flex items-center gap-0.5 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">از {product.reviews.length.toLocaleString("fa-IR")} نظر</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star] || 0;
                        const pct = product.reviews.length > 0
                          ? Math.round((count / product.reviews.length) * 100)
                          : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="w-6 text-sm text-neutral-700 shrink-0">{star.toLocaleString("fa-IR")}</span>
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-8 text-xs text-neutral-600 shrink-0 text-left">{count.toLocaleString("fa-IR")}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review List */}
                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-neutral-900">{review.authorName}</span>
                            {review.isVerifiedBuyer && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-medium">
                                <BadgeCheck className="h-3 w-3" />
                                خریدار تایید شده
                              </span>
                            )}
                            <span className="text-xs text-neutral-500">
                              {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-neutral-200 bg-white rounded-2xl">
                      <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500 text-sm">هنوز نظری ثبت نشده است. اولین نظر را ثبت کنید.</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-4">ثبت نظر</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <Label htmlFor="authorName" className="text-xs text-neutral-600">نام شما</Label>
                        <Input
                          id="authorName"
                          value={reviewForm.authorName}
                          onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating" className="text-xs text-neutral-600">امتیاز</Label>
                        <select
                          id="rating"
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                          className="mt-1 w-full h-10 px-3 text-sm border border-neutral-300 rounded-md"
                        >
                          <option value={5}>۵ ستاره</option>
                          <option value={4}>۴ ستاره</option>
                          <option value={3}>۳ ستاره</option>
                          <option value={2}>۲ ستاره</option>
                          <option value={1}>۱ ستاره</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="comment" className="text-xs text-neutral-600">نظر شما</Label>
                        <Textarea
                          id="comment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          required
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={submittingReview} className="w-full rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c]">
                        {submittingReview ? "در حال ثبت..." : "ثبت نظر"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                  {product.questions.length > 0 ? (
                    product.questions.map((question, index) => {
                      const isOpen = openQuestionId === question.id || (openQuestionId === null && index === 0);
                      const isAnswered = !!question.answer;
                      return (
                        <div key={question.id} className="border border-neutral-200 bg-white rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
                          <button
                            type="button"
                            onClick={() => toggleQuestion(question.id)}
                            aria-expanded={isOpen}
                            className="w-full flex items-center gap-3 p-4 text-right hover:bg-neutral-50 transition-colors"
                          >
                            <HelpCircle className="h-5 w-5 text-neutral-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 line-clamp-2">{question.question}</p>
                              <p className="text-xs text-neutral-500 mt-1">
                                {question.authorName} • {new Date(question.createdAt).toLocaleDateString("fa-IR")}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                              isAnswered ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {isAnswered ? "پاسخ داده شده" : "در انتظار پاسخ"}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="border-t border-neutral-100 p-4 pr-14">
                              {question.answer ? (
                                <div>
                                  <p className="text-xs font-semibold text-neutral-500 mb-1">پاسخ فروشگاه:</p>
                                  <p className="text-sm text-neutral-700 leading-relaxed">{question.answer}</p>
                                  {question.answeredAt && (
                                    <p className="text-xs text-neutral-500 mt-2">
                                      پاسخ داده شده در {new Date(question.answeredAt).toLocaleDateString("fa-IR")}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-neutral-500">هنوز پاسخی برای این سوال ثبت نشده است.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 border border-dashed border-neutral-200 bg-white rounded-2xl">
                      <MessageCircleQuestion className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500 text-sm">هنوز سوالی پرسیده نشده است. اولین سوال را ثبت کنید.</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-4">ثبت سوال</h3>
                    <form onSubmit={handleSubmitQuestion} className="space-y-4">
                      <div>
                        <Label htmlFor="q-authorName" className="text-xs text-neutral-600">نام شما</Label>
                        <Input
                          id="q-authorName"
                          value={questionForm.authorName}
                          onChange={(e) => setQuestionForm({ ...questionForm, authorName: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="question" className="text-xs text-neutral-600">سوال شما</Label>
                        <Textarea
                          id="question"
                          value={questionForm.question}
                          onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                          required
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={submittingQuestion} className="w-full rounded-full bg-[#d97757] text-white hover:bg-[#c86a4c]">
                        {submittingQuestion ? "در حال ثبت..." : "ثبت سوال"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-12">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900">محصولات مشابه</h2>
              <div className="flex items-center gap-2">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:border-[#d97757] hover:text-[#d97757] transition-colors"
                >
                  همه محصولات
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-[#d97757] hover:border-[#d97757]"
                  onClick={() => {
                    const container = document.getElementById('related-products');
                    container?.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-[#d97757] hover:border-[#d97757]"
                  onClick={() => {
                    const container = document.getElementById('related-products');
                    container?.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              id="related-products"
              className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}
            >
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="flex-shrink-0 w-64 group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-2xl mb-3 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <Image
                      src={relatedProduct.images?.[0] || ""}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="256px"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-[#d97757] transition-colors">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {relatedProduct.price.toLocaleString("fa-IR")} <span className="text-xs font-normal text-neutral-600">تومان</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen} sizeChartUrl={product.sizeChart} />
    </div>
  );
}
