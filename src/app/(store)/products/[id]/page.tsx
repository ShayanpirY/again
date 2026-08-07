"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Share2, Truck, Shield, ChevronLeft, ChevronRight, Star, MessageSquare, HelpCircle, Play, Ruler, BadgeCheck, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCart";
import { SizeGuideModal } from "@/components/modules/SizeGuideModal";
import { getColorName } from "@/lib/colorNames";

interface Product {
  id: string;
  title: string;
  price: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  category?: { name: string };
  brand?: string;
  ageGroup?: string;
  season?: string;
  fabric?: string;
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
  const { addItem, openCart } = useCartStore();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          setProduct(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
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
      gender: "unisex",
    }, 1, selectedColor || undefined, selectedSize || undefined);
    openCart();
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
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">محصول یافت نشد</h1>
          <p className="text-neutral-600">متأسفانه محصول مورد نظر شما وجود ندارد.</p>
          <Link href="/products">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              بازگشت به فروشگاه
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900 transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900 transition-colors">محصولات</Link>
          <span>/</span>
          <span className="text-neutral-600">{product.category?.name}</span>
          <span>/</span>
          <span className="text-neutral-900 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right: Media Gallery */}
          <div className="space-y-4">
            {/* Main Image/Video */}
            <div 
              ref={imageContainerRef}
              className={`relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm ${mediaTab === "video" ? "" : "cursor-crosshair"}`}
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
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                      mediaTab === "video" ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
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
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                      mediaTab === "image" && safeSelectedImage === index
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400"
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
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-sm">
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
                  className="text-xs text-neutral-600 hover:text-neutral-900 p-0 h-auto"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  مشاهده جدول سایز
                </Button>
              </div>
            </div>

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
                            ? "border-neutral-900 scale-110"
                            : "border-neutral-300 hover:border-neutral-400"
                        } ${colorOut ? "opacity-50" : ""}`}
                        style={{ backgroundColor: color, boxShadow: selectedColor === color ? "0 0 0 3px rgba(23,23,23,0.15)" : undefined }}
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
                    className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 p-0 h-auto"
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
                        className={`flex flex-col items-center min-w-[68px] px-3 py-2 text-sm font-medium border rounded-sm transition-all ${
                          selectedSize === size
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : isOutOfStock
                              ? "border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
                              : "border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
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
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-none py-6 text-sm font-semibold tracking-wider disabled:bg-neutral-400"
              >
                {currentStock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
              </Button>
              <Button variant="outline" className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-none py-6">
                <Share2 className="h-5 w-5 ml-2" />
                اشتراک‌گذاری
              </Button>
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
            <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 text-neutral-600 hover:text-neutral-900 px-4 py-3"
              >
                <MessageSquare className="h-4 w-4 ml-2" />
                نظرات کاربران ({product.reviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="questions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 text-neutral-600 hover:text-neutral-900 px-4 py-3"
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
                  <div className="flex flex-col sm:flex-row gap-6 p-6 bg-neutral-50 rounded-sm">
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
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
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
                        <div key={review.id} className="border-b border-neutral-100 pb-4">
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
                    <div className="text-center py-8 border border-dashed border-neutral-200 rounded-sm">
                      <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500 text-sm">هنوز نظری ثبت نشده است. اولین نظر را ثبت کنید.</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-neutral-50 p-6 rounded-sm">
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
                      <Button type="submit" disabled={submittingReview} className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
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
                        <div key={question.id} className="border border-neutral-200 rounded-sm overflow-hidden">
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
                    <div className="text-center py-8 border border-dashed border-neutral-200 rounded-sm">
                      <MessageCircleQuestion className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500 text-sm">هنوز سوالی پرسیده نشده است. اولین سوال را ثبت کنید.</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-neutral-50 p-6 rounded-sm">
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
                      <Button type="submit" disabled={submittingQuestion} className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900">محصولات مشابه</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
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
                  className="h-10 w-10 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
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
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm mb-3">
                    <Image
                      src={relatedProduct.images?.[0] || ""}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="256px"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-600 transition-colors">
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
