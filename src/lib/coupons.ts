export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  expiresAt?: string;
  label: string;
  description: string;
}

const COUPONS: Coupon[] = [
  {
    code: "WELCOME",
    type: "percent",
    value: 15,
    minSubtotal: 300000,
    maxDiscount: 500000,
    label: "۱۵٪ تخفیف",
    description: "تخفیف ۱۵٪ اولین خرید",
  },
  {
    code: "SAVE10",
    type: "percent",
    value: 10,
    minSubtotal: 500000,
    maxDiscount: 300000,
    label: "۱۰٪ تخفیف",
    description: "تخفیف ۱۰٪ برای خریدهای بالای ۵۰۰ هزار تومان",
  },
  {
    code: "SUMMER20",
    type: "percent",
    value: 20,
    minSubtotal: 800000,
    maxDiscount: 600000,
    label: "۲۰٪ تخفیف",
    description: "تخفیف ۲۰٪ برای خریدهای بالای ۸۰۰ هزار تومان",
  },
  {
    code: "FREE100",
    type: "flat",
    value: 100000,
    minSubtotal: 1000000,
    label: "۱۰۰ هزار تومان تخفیف",
    description: "تخفیف ۱۰۰ هزار تومانی برای خریدهای بالای ۱ میلیون تومان",
  },
  {
    code: "RANGE50",
    type: "flat",
    value: 50000,
    minSubtotal: 200000,
    label: "۵۰ هزار تومان تخفیف",
    description: "تخفیف ۵۰ هزار تومانی برای خریدهای بالای ۲۰۰ هزار تومان",
  },
];

export function findCoupon(code: string): Coupon | null {
  const normalized = (code || "").trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized) || null;
}

export function validateCoupon(
  code: string,
  subtotal: number
): { ok: true; coupon: Coupon } | { ok: false; error: string } {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { ok: false, error: "کد تخفیف معتبر نیست." };
  }
  if (coupon.expiresAt && Date.now() > new Date(coupon.expiresAt).getTime()) {
    return { ok: false, error: "این کد تخفیف منقضی شده است." };
  }
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `حداقل مبلغ خرید برای این کد، ${coupon.minSubtotal.toLocaleString("fa-IR")} تومان است.`,
    };
  }
  return { ok: true, coupon };
}

export function applyCoupon(
  code: string,
  subtotal: number
): { ok: boolean; discount: number; error?: string; coupon?: Coupon } {
  const result = validateCoupon(code, subtotal);
  if (!result.ok) {
    return { ok: false, discount: 0, error: result.error };
  }

  const { coupon } = result;
  let discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  if (coupon.type === "percent" && coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = Math.min(discount, subtotal);

  return { ok: true, discount, coupon };
}

export const DEMO_COUPON_HINT = "WELCOME، SAVE10، SUMMER20، FREE100";
