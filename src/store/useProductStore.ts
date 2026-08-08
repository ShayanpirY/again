import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [
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
          category: "دخترانه",
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
          category: "پسرانه",
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
      ],

      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now().toString(),
        };
        set((state) => ({
          products: [...state.products, newProduct as Product],
        }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: "product-storage",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
