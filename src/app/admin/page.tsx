import { Metadata } from "next";
import { AdminStats } from "@/components/admin/AdminStats";

export const metadata: Metadata = {
  title: "داشبورد | پنل مدیریت کودک",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">داشبورد</h1>
        <p className="text-sm text-neutral-600 mt-1">خلاصه وضعیت فروشگاه</p>
      </div>

      <AdminStats />
    </div>
  );
}
