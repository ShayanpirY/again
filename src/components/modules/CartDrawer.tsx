"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl">سبد خرید</SheetTitle>
              <SheetDescription>
                {items.length === 0
                  ? "سبد خرید شما خالی است"
                  : `${items.reduce((total, item) => total + item.quantity, 0)} کالا`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🛒</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">سبد خرید خالی است</h3>
              <p className="text-sm text-muted-foreground">
                محصولات مورد علاقه خود را به سبد خرید اضافه کنید
              </p>
            </div>
            <Link href="/products" onClick={closeCart} className="mt-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium transition-all outline-none select-none h-9 gap-1.5 px-2.5 bg-primary text-primary-foreground hover:bg-primary/80 px-8">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-4 p-3 rounded-xl bg-muted/50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedColor && `رنگ: ${item.selectedColor}`}
                            {item.selectedSize && ` • سایز: ${item.selectedSize}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {(item.product.price * item.quantity).toLocaleString()} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>جمع کل:</span>
                <span className="text-primary">{getTotalPrice().toLocaleString()} تومان</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6">
                تکمیل خرید
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
