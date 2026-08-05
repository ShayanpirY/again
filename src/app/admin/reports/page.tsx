import { Metadata } from "next";

export const metadata: Metadata = {
  title: "گزارش‌ها و آمار | پنل مدیریت کودک",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">گزارش‌ها و آمار</h1>
        <p className="text-sm text-neutral-600 mt-1">تحلیل فروش، سود، پرفروش‌ترین‌ها و کالاهای بدون فروش</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-neutral-600">این بخش به زودی اضافه خواهد شد.</p>
      </div>
    </div>
  );
}
