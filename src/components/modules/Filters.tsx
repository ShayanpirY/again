"use client";

import { useState } from "react";
import { FilterState } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const categories = ["دخترانه", "پسرانه", "نوزاد", "اکسسوری"];
const genders = ["دختر", "پسر"];
const ageRanges = ["۰-۱ سال", "۱-۳ سال", "۳-۶ سال", "۶-۱۰ سال", "۱۰-۱۴ سال"];

function FilterContent({ localFilters, updateFilter, toggleArrayFilter, clearFilters }: {
  localFilters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleArrayFilter: (key: "categories" | "genders" | "ageRanges", value: string) => void;
  clearFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">فیلترها</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive">
          <X className="h-4 w-4 ml-1" />
          حذف همه
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">دسته‌بندی</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={localFilters.categories.includes(cat)}
                onCheckedChange={() => toggleArrayFilter("categories", cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">جنسیت</h4>
        <div className="space-y-2">
          {genders.map((gender) => (
            <div key={gender} className="flex items-center gap-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={localFilters.genders.includes(gender)}
                onCheckedChange={() => toggleArrayFilter("genders", gender)}
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">سن</h4>
        <div className="space-y-2">
          {ageRanges.map((age) => (
            <div key={age} className="flex items-center gap-2">
              <Checkbox
                id={`age-${age}`}
                checked={localFilters.ageRanges.includes(age)}
                onCheckedChange={() => toggleArrayFilter("ageRanges", age)}
              />
              <Label htmlFor={`age-${age}`} className="text-sm cursor-pointer">
                {age}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">حداکثر قیمت</h4>
        <Slider
          value={[localFilters.priceRange[1]]}
          max={10000000}
          step={50000}
          onValueChange={(value) => {
            const newValue = Array.isArray(value) ? value[0] : value;
            updateFilter("priceRange", [localFilters.priceRange[0], newValue]);
          }}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>۰ تومان</span>
          <span>{localFilters.priceRange[1].toLocaleString()} تومان</span>
        </div>
      </div>
    </div>
  );
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: "categories" | "genders" | "ageRanges", value: string) => {
    const current = localFilters[key];
    const newValue = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateFilter(key, newValue);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      categories: [],
      subcategories: [],
      genders: [],
      ageRanges: [],
      priceRange: [0, 10000000],
      sizes: [],
      colors: [],
      sortBy: "newest",
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <>
      <Sheet>
<SheetTrigger className={buttonVariants({ variant: "outline", className: "lg:hidden" })}>
  <SlidersHorizontal className="h-4 w-4 ml-2" />
  فیلترها
</SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>فیلترهای جستجو</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent
              localFilters={localFilters}
              updateFilter={updateFilter}
              toggleArrayFilter={toggleArrayFilter}
              clearFilters={clearFilters}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <FilterContent
            localFilters={localFilters}
            updateFilter={updateFilter}
            toggleArrayFilter={toggleArrayFilter}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </>
  );
}
