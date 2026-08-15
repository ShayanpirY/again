import Link from "next/link";
import { getCachedSiteSettings } from "@/lib/site-settings";

export default async function ShippingPage() {
  const settings = await getCachedSiteSettings();

  const shippingItems = [
    {
      emoji: "📦",
      title: "آماده‌سازی سریع",
      text: "سفارش‌ها طی ۲۴ تا ۴۸ ساعت کاری آماده و تحویل شرکت پست می‌شوند.",
    },
    {
      emoji: "🚚",
      title: "ارسال سراسر ایران",
      text: "سفارش شما به تمام نقاط کشور با پست پیشتاز یا تیپاکس ارسال می‌شود.",
    },
    {
      emoji: "🎁",
      title: "ارسال رایگان",
      text: `برای سفارش‌های بالای ${settings.freeShippingThreshold.toLocaleString("fa-IR")} تومان هزینه ارسال رایگان است.`,
    },
    {
      emoji: "🔎",
      title: "پیگیری سفارش",
      text: "پس از ارسال، کد رهگیری برایتان ارسال می‌شود تا مسیر مرسوله را دنبال کنید.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">شرایط ارسال</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-8">
            شرایط ارسال
          </h1>

          <div className="grid sm:grid-cols-2 gap-5">
            {shippingItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-[#faf9f7] border border-neutral-100 p-6 flex gap-4 items-start"
              >
                <div className="text-3xl shrink-0 mt-1">{item.emoji}</div>
                <div>
                  <h2 className="font-black text-neutral-900 mb-2">{item.title}</h2>
                  <p className="text-sm text-neutral-600 leading-7">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-neutral-500 leading-7 mt-8 border-t border-neutral-100 pt-6">
            برای اطلاع از هزینه دقیق ارسال، در هنگام تسویه‌حساب، هزینه بر اساس وزن و مقصد به‌صورت خودکار محاسبه می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
