import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  setPromoCode: (code: string) => void;
  clearPromo: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const matchesItem = (
  item: CartItem,
  productId: string,
  selectedColor?: string,
  selectedSize?: string
) =>
  item.product.id === productId &&
  item.selectedColor === selectedColor &&
  item.selectedSize === selectedSize;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,

      addItem: (product, quantity = 1, selectedColor, selectedSize) => {
        set((state) => {
          const existingItem = state.items.find((item) =>
            matchesItem(item, product.id, selectedColor, selectedSize)
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                matchesItem(item, product.id, selectedColor, selectedSize)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, selectedColor, selectedSize }],
          };
        });
      },

      removeItem: (productId, selectedColor, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !matchesItem(item, productId, selectedColor, selectedSize)
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedColor, selectedSize) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            matchesItem(item, productId, selectedColor, selectedSize)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: null }),

      setPromoCode: (code) => set({ promoCode: code.trim().toUpperCase() }),
      clearPromo: () => set({ promoCode: null }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    }
  )
);
