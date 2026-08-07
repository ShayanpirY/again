"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCart";
import { applyCoupon, validateCoupon, DEMO_COUPON_HINT } from "@/lib/coupons";

export function PromoCodeBox({ subtotal }: { subtotal: number }) {
  const { promoCode, setPromoCode, clearPromo } = useCartStore();
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const promo = applyCoupon(promoCode ?? "", subtotal);

  const handleApply = () => {
    const result = validateCoupon(promoInput, subtotal);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPromoCode(result.coupon.code);
    setPromoInput("");
    setError(null);
  };

  if (promoCode && promo.ok) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-sm px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-700 truncate">
            کد {promo.coupon!.code} اعمال شد ({promo.coupon!.label})
          </span>
        </div>
        <button
          onClick={clearPromo}
          className="text-green-600 hover:text-green-800 flex-shrink-0"
          aria-label="حذف کد تخفیف"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (promoCode && !promo.ok) {
    return (
      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-sm px-3 py-2.5">
        <span className="text-xs text-amber-800">{promo.error}</span>
        <button
          onClick={clearPromo}
          className="text-amber-700 hover:text-amber-900 flex-shrink-0"
          aria-label="حذف کد تخفیف"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={promoInput}
          onChange={(e) => {
            setPromoInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="کد تخفیف"
          className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex-shrink-0"
        >
          اعمال
        </Button>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {!error && (
        <p className="text-[11px] text-neutral-500 mt-2">
          کدهای آزمایشی: {DEMO_COUPON_HINT}
        </p>
      )}
    </div>
  );
}
