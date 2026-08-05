import { Metadata } from "next";

export const metadata: Metadata = {
  title: "کدهای تخفیف | پنل مدیریت کودک",
};

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">کدهای تخفیف</h1>
        <p className="text-sm text-neutral-600 mt-1">تعریف و مدیریت کدهای تخفیف درصدی، مبلغی، اولین خرید و کمپین‌ها</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-neutral-600">این بخش به زودی اضافه خواهد شد.</p>
      </div>
    </div>
  );
}
