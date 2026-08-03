export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  ageRange: string;
  gender: "girl" | "boy" | "unisex";
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface FilterState {
  categories: string[];
  subcategories: string[];
  genders: string[];
  ageRanges: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sortBy: "newest" | "price-asc" | "price-desc" | "popular";
}
