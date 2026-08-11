"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

const AGE_GROUPS = [
  { id: "newborn", label: "نوزاد", range: "۰ تا ۱۸ ماه" },
  { id: "baby", label: "کودک نوپا", range: "۱ تا ۳ سال" },
  { id: "kids", label: "کودک", range: "۴ تا ۹ سال" },
  { id: "teens", label: "نوجوان", range: "۱۰ تا ۱۶ سال" },
];

const SIZES = ["۳۵", "۴۰", "۴۵", "۵۰", "۵۵", "S", "M", "L", "XL"];

const COLORS = [
  { hex: "#000000", name: "مشکی" },
  { hex: "#FFFFFF", name: "سفید" },
  { hex: "#FF0000", name: "قرمز" },
  { hex: "#0000FF", name: "آبی" },
  { hex: "#008000", name: "سبز" },
  { hex: "#FFFF00", name: "زرد" },
  { hex: "#FFA500", name: "نارنجی" },
  { hex: "#800080", name: "بنفش" },
  { hex: "#FFC0CB", name: "صورتی" },
  { hex: "#A52A2A", name: "قهوه‌ای" },
  { hex: "#808080", name: "خاکستری" },
  { hex: "#E6E6FA", name: "یاسی" },
  { hex: "#F5F5DC", name: "کرم" },
  { hex: "#40E0D0", name: "فیروزه‌ای" },
  { hex: "#98FF98", name: "نعنایی" },
  { hex: "#FFD700", name: "طلایی" },
];

const MAX_PRICE = 5000000;

function getArray(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(",").filter(Boolean) || [];
}

function getBool(params: URLSearchParams, key: string): boolean {
  return params.get(key) === "true";
}

function getNumber(params: URLSearchParams, key: string, fallback: number): number {
  const v = params.get(key);
  return v ? parseInt(v) : fallback;
}

function FilterBody() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedAges = getArray(searchParams, "age");
  const selectedSizes = getArray(searchParams, "sizes");
  const selectedColors = getArray(searchParams, "colors");
  const inStockOnly = getBool(searchParams, "inStock");
  const priceMin = getNumber(searchParams, "minPrice", 0);
  const priceMax = getNumber(searchParams, "maxPrice", MAX_PRICE);

  const setParams = useCallback(
    (updates: Record<string, string | boolean | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === false || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      router.push(`/shop${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams]
  );

  const toggleArray = useCallback(
    (key: string, value: string, current: string[]) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setParams({ [key]: next.length ? next.join(",") : null });
    },
    [setParams]
  );

  const clearAll = useCallback(() => {
    router.push("/shop");
  }, [router]);

  const activeCount = useMemo(
    () =>
      selectedAges.length +
      selectedSizes.length +
      selectedColors.length +
      (inStockOnly ? 1 : 0) +
      (priceMin > 0 || priceMax < MAX_PRICE ? 1 : 0),
    [selectedAges, selectedSizes, selectedColors, inStockOnly, priceMin, priceMax]
  );

  const priceRange: [number, number] = [priceMin, priceMax];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">فیلترها</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
            <X className="h-3 w-3 ml-1" />
            پاک کردن
          </Button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
          رده سنی
        </h4>
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((age) => {
            const active = selectedAges.includes(age.id);
            return (
              <button
                key={age.id}
                onClick={() => toggleArray("age", age.id, selectedAges)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {age.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
          سایز
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleArray("sizes", size, selectedSizes)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
          رنگ
        </h4>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => {
            const active = selectedColors.includes(color.hex);
            return (
              <button
                key={color.hex}
                onClick={() => toggleArray("colors", color.hex, selectedColors)}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  active ? "border-neutral-900 scale-110" : "border-neutral-300 hover:border-neutral-400"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {active && (
                  <svg
                    className="absolute inset-0 m-auto h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
          محدوده قیمت
        </h4>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(v) => {
              const range = v as [number, number];
              setParams({
                minPrice: range[0] > 0 ? String(range[0]) : null,
                maxPrice: range[1] < MAX_PRICE ? String(range[1]) : null,
              });
            }}
            max={MAX_PRICE}
            step={100000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>{priceRange[0].toLocaleString("fa-IR")} تومان</span>
            <span>{priceRange[1].toLocaleString("fa-IR")} تومان</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setParams({ inStock: checked ? "true" : null })}
        />
        <label htmlFor="in-stock" className="text-sm font-medium text-neutral-900 cursor-pointer">
          فقط کالاهای موجود
        </label>
      </div>
    </div>
  );
}

export function ProductFilters() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const ages = getArray(searchParams, "age");
  const sizes = getArray(searchParams, "sizes");
  const colors = getArray(searchParams, "colors");
  const inStock = getBool(searchParams, "inStock");
  const minPrice = getNumber(searchParams, "minPrice", 0);
  const maxPrice = getNumber(searchParams, "maxPrice", MAX_PRICE);

  const activeCount =
    ages.length +
    sizes.length +
    colors.length +
    (inStock ? 1 : 0) +
    (minPrice > 0 || maxPrice < MAX_PRICE ? 1 : 0);

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer lg:hidden">
          <Filter className="h-4 w-4 ml-2" />
          فیلترها
          {activeCount > 0 && <Badge className="mr-2 bg-neutral-900 text-white">{activeCount}</Badge>}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>فیلترها</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterBody />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-8 self-start">
        <FilterBody />
      </aside>
    </>
  );
}