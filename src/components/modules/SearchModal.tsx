"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  category?: {
    name: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleProductClick = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white shadow-2xl max-w-3xl mx-auto mt-20 mx-4 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-4 border-b border-neutral-200">
          <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="جستجوی محصولات..."
            className="border-0 focus:ring-0 text-base px-0 py-2"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">در حال جستجو...</p>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">محصولی با این مشخصات پیدا نشد</p>
              <p className="text-neutral-500 text-xs mt-2">لطفاً کلیدواژه دیگری را امتحان کنید</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-sm transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-neutral-900 truncate">{product.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{product.category?.name || ""}</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {product.price.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && !loading && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-sm">نام محصول مورد نظر خود را جستجو کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
