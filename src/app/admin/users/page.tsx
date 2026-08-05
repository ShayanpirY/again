import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کاربران | پنل مدیریت کودک",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">مدیریت کاربران</h1>
        <p className="text-sm text-neutral-600 mt-1">مشاهده لیست کاربران، آدرس‌ها، کیف پول و امتیازات</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-neutral-600">این بخش به زودی اضافه خواهد شد.</p>
      </div>
    </div>
  );
}
