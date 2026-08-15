"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/modules/ProductCard";

interface SearchResultProduct {
  id: string;
  title: string;
  price: number;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  brand?: string | null;
  isNew?: boolean;
  isSale?: boolean;
  category?: { name: string } | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const RESULT_LIMIT = 24;

const MemoizedProductCard = memo(ProductCard);

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // جستجوی سمت سرور با debounce و حداقل ۲ حرف؛ درخواست قبلی لغو می‌شود
  useEffect(() => {
    const value = normalize(query);
    if (!isOpen || value.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      fetch(
        `/api/products?q=${encodeURIComponent(value)}&limit=${RESULT_LIMIT}&page=1`,
        { signal: controller.signal }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: unknown) => {
          if (controller.signal.aborted) return;
          setResults(Array.isArray(data) ? (data as SearchResultProduct[]) : []);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          console.error("Search failed:", err);
          setResults([]);
          setError("خطا در دریافت نتایج. لطفاً دوباره تلاش کنید.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setQuery(next);
      setResults([]);
      setError(null);
      setLoading(normalize(next).length >= MIN_QUERY_LENGTH);
    },
    []
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, [onClose]);

  if (!isOpen) return null;

  const value = normalize(query);
  const showLoading = loading && value.length >= MIN_QUERY_LENGTH;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white shadow-2xl max-w-3xl mx-4 mt-20 md:mx-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-4 border-b border-neutral-200">
          <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="جستجوی محصولات..."
            className="border-0 focus:ring-0 text-base px-0 py-2"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 flex-shrink-0"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 flex-shrink-0"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {/* loading فقط برای ناحیه نتایج */}
          {showLoading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[#d97757] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">در حال جستجو...</p>
            </div>
          )}

          {!showLoading && error && (
            <div className="text-center py-12">
              <SearchX className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">{error}</p>
              <p className="text-neutral-500 text-xs mt-2">لطفاً دوباره تلاش کنید</p>
            </div>
          )}

          {!showLoading && !error && value.length < MIN_QUERY_LENGTH && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">
                {value.length === 0
                  ? "نام محصول مورد نظر خود را جستجو کنید"
                  : "برای جستجو حداقل ۲ حرف وارد کنید"}
              </p>
            </div>
          )}

          {!showLoading && !error && value.length >= MIN_QUERY_LENGTH && results.length === 0 && (
            <div className="text-center py-12">
              <SearchX className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">محصولی با این مشخصات پیدا نشد</p>
              <p className="text-neutral-500 text-xs mt-2">لطفاً کلیدواژه دیگری را امتحان کنید</p>
            </div>
          )}

          {!showLoading && !error && results.length > 0 && (
            <div
              className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4"
              onClick={handleClose}
            >
              {results.map((product) => (
                <MemoizedProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.images?.[0] || "/placeholder.png",
                    images: product.images || [],
                    colors: product.colors || [],
                    sizes: product.sizes || [],
                    category: product.category?.name || "",
                    isNew: product.isNew,
                    isSale: product.isSale,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
