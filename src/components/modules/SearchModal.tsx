"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/modules/ProductCard";

interface LightProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  colors: string[];
  brand?: string | null;
  category?: {
    name: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const CATALOG_LIMIT = 100;

const MemoizedProductCard = memo(ProductCard);

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<LightProduct[] | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [filtered, setFiltered] = useState<LightProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  // یک‌بار لیست سبک محصولات را می‌گیریم؛ fetch قبلی با AbortController لغو می‌شود
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setLoadingCatalog(true);

    fetch(`/api/products/search?limit=${CATALOG_LIMIT}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (controller.signal.aborted) return;
        setCatalog(Array.isArray(data) ? (data as LightProduct[]) : []);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load search catalog:", error);
        setCatalog([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCatalog(false);
      });

    return () => controller.abort();
  }, [isOpen]);

  // فیلتر client-side با debounce و حداقل ۲ حرف
  useEffect(() => {
    const value = normalize(query);

    if (value.length < MIN_QUERY_LENGTH || !catalog) {
      setFiltered([]);
      return;
    }

    const timer = setTimeout(() => {
      const matches = catalog
        .filter((product) => {
          const title = normalize(product.title || "");
          const category = normalize(product.category?.name || "");
          const brand = normalize(product.brand || "");
          return title.includes(value) || category.includes(value) || brand.includes(value);
        })
        .slice(0, 24);

      setFiltered(matches);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, catalog]);

  const handleClear = useCallback(() => {
    setQuery("");
    setFiltered([]);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setQuery("");
    setFiltered([]);
  }, [onClose]);

  if (!isOpen) return null;

  const value = normalize(query);
  const showLoading = loadingCatalog && value.length >= MIN_QUERY_LENGTH;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-white shadow-2xl max-w-3xl mx-auto mt-20 mx-4 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-4 border-b border-neutral-200">
          <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

          {!showLoading && value.length < MIN_QUERY_LENGTH && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">
                {value.length === 0
                  ? "نام محصول مورد نظر خود را جستجو کنید"
                  : "برای جستجو حداقل ۲ حرف وارد کنید"}
              </p>
            </div>
          )}

          {!showLoading && value.length >= MIN_QUERY_LENGTH && filtered.length === 0 && (
            <div className="text-center py-12">
              <SearchX className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">محصولی با این مشخصات پیدا نشد</p>
              <p className="text-neutral-500 text-xs mt-2">لطفاً کلیدواژه دیگری را امتحان کنید</p>
            </div>
          )}

          {!showLoading && filtered.length > 0 && (
            <div
              className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4"
              onClick={handleClose}
            >
              {filtered.map((product) => (
                <MemoizedProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.image || "/placeholder.png",
                    images: product.image ? [product.image] : [],
                    colors: product.colors || [],
                    category: product.category?.name || "",
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
