"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getColorName } from "@/lib/colorNames";

export const AGE_GROUPS = [
  { id: "newborn", label: "نوزاد" },
  { id: "baby", label: "کودک نوپا" },
  { id: "girl", label: "دخترانه" },
  { id: "boy", label: "پسرانه" },
  { id: "pre-teen", label: "نوجوان" },
];

export const STANDARD_SIZES = [
  "۰-۳ ماه",
  "۳-۶ ماه",
  "۶-۱۲ ماه",
  "۱-۲ سال",
  "۲-۴ سال",
  "۴-۶ سال",
  "۶-۸ سال",
  "۸-۱۰ سال",
  "سایز ۱",
  "سایز ۲",
  "سایز ۳",
  "سایز ۴",
];

export const FABRICS = ["پنبه", "پلی‌استر", "نخی", "پشم", "الیاف مصنوعی", "مخلوط"];
export const SEASONS = ["بهار", "تابستان", "پاییز", "زمستان"];

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (values: string[]) => void;
  selectedAges: string[];
  setSelectedAges: (values: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (values: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (values: string[]) => void;
  selectedFabrics: string[];
  setSelectedFabrics: (values: string[]) => void;
  selectedSeasons: string[];
  setSelectedSeasons: (values: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (values: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  maxPrice: number;
  allColors: string[];
  allBrands: string[];
  activeFiltersCount: number;
  clearAllFilters: () => void;
  hideCategoryFilter?: boolean;
}

export function ProductFilters({
  categories,
  selectedCategories,
  setSelectedCategories,
  selectedAges,
  setSelectedAges,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  selectedFabrics,
  setSelectedFabrics,
  selectedSeasons,
  setSelectedSeasons,
  selectedBrands,
  setSelectedBrands,
  inStockOnly,
  setInStockOnly,
  priceRange,
  setPriceRange,
  maxPrice,
  allColors,
  allBrands,
  activeFiltersCount,
  clearAllFilters,
  hideCategoryFilter = false,
}: ProductFiltersProps) {
  const toggleFilter = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      {!hideCategoryFilter && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">دسته‌بندی</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() =>
                    toggleFilter(category.id, selectedCategories, setSelectedCategories)
                  }
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="text-sm text-neutral-700 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Age Groups */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">رده سنی</h3>
        <div className="space-y-2">
          {AGE_GROUPS.map((age) => (
            <div key={age.id} className="flex items-center gap-2">
              <Checkbox
                id={`age-${age.id}`}
                checked={selectedAges.includes(age.id)}
                onCheckedChange={() =>
                  toggleFilter(age.id, selectedAges, setSelectedAges)
                }
              />
              <label
                htmlFor={`age-${age.id}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {age.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">سایز</h3>
        <div className="space-y-2">
          {STANDARD_SIZES.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() =>
                  toggleFilter(size, selectedSizes, setSelectedSizes)
                }
              />
              <label
                htmlFor={`size-${size}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">رنگ</h3>
        <div className="space-y-2">
          {allColors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                toggleFilter(color, selectedColors, setSelectedColors)
              }
            >
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() =>
                  toggleFilter(color, selectedColors, setSelectedColors)
                }
              />
              <span
                className="w-4 h-4 rounded-full border border-neutral-200 inline-block"
                style={{ backgroundColor: color }}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {getColorName(color)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">محدوده قیمت</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            step={100000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>{priceRange[0].toLocaleString("fa-IR")} تومان</span>
            <span>{priceRange[1].toLocaleString("fa-IR")} تومان</span>
          </div>
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">جنس پارچه</h3>
        <div className="space-y-2">
          {FABRICS.map((fabric) => (
            <div key={fabric} className="flex items-center gap-2">
              <Checkbox
                id={`fabric-${fabric}`}
                checked={selectedFabrics.includes(fabric)}
                onCheckedChange={() =>
                  toggleFilter(fabric, selectedFabrics, setSelectedFabrics)
                }
              />
              <label
                htmlFor={`fabric-${fabric}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {fabric}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Season */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">فصل</h3>
        <div className="space-y-2">
          {SEASONS.map((season) => (
            <div key={season} className="flex items-center gap-2">
              <Checkbox
                id={`season-${season}`}
                checked={selectedSeasons.includes(season)}
                onCheckedChange={() =>
                  toggleFilter(season, selectedSeasons, setSelectedSeasons)
                }
              />
              <label
                htmlFor={`season-${season}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {season}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">برند</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() =>
                  toggleFilter(brand, selectedBrands, setSelectedBrands)
                }
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm text-neutral-700 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) =>
              setInStockOnly(checked as boolean)
            }
          />
          <label
            htmlFor="in-stock"
            className="text-sm font-medium text-neutral-900 cursor-pointer"
          >
            فقط کالاهای موجود
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="h-4 w-4 ml-2" />
          پاک کردن همه فیلترها
        </Button>
      )}
    </div>
  );
}
