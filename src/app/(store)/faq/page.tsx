import Link from "next/link";

const faqs = [
  {
    q: "سفارش من چه زمانی ارسال می‌شود؟",
    a: "سفارش‌های ثبت‌شده طی ۲۴ تا ۴۸ ساعت کاری بسته‌بندی و تحویل پست یا تیپاکس می‌شوند. زمان رسیدن مرسوله به مقصد معمولاً ۲ تا ۵ روز کاری است.",
  },
  {
    q: "هزینه ارسال چگونه محاسبه می‌شود؟",
    a: "هزینه ارسال بر اساس وزن و مقصد، هنگام تسویه‌حساب به‌صورت خودکار محاسبه می‌شود. برای سفارش‌های بالای حد معین، ارسال رایگان است.",
  },
  {
    q: "چطور سایز مناسب کودکم را انتخاب کنم؟",
    a: "قد کودک را با متر اندازه بگیرید و آن را با جدول «راهنمای سایز» مقایسه کنید. اگر قد بین دو سایز بود، سایز بزرگ‌تر را انتخاب کنید.",
  },
  {
    q: "آیا امکان مرجوعی یا تعویض کالا وجود دارد؟",
    a: "بله؛ تا ۳۰ روز پس از تحویل می‌توانید درخواست مرجوعی بدهید. کالا باید استفاده‌نشده، شسته‌نشده و همراه با تگ و بسته‌بندی اولیه باشد.",
  },
  {
    q: "جنس پارچه‌های محصولات چیست؟",
    a: "پوشاک ما از پارچه‌های نرم، لطیف و استاندارد دوخته می‌شود که برای پوست حساس کودک مناسب است.",
  },
  {
    q: "چطور با پشتیبانی در ارتباط باشم؟",
    a: "از طریق صفحه «تماس با ما» می‌توانید پیام بگذارید یا در ساعت کاری با تلفن پشتیبانی تماس بگیرید.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">سوالات متداول</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
            سوالات متداول
          </h1>
          <p className="text-sm text-neutral-600 leading-7 mb-8">
            پاسخ سوال‌های پرتکرار شما درباره خرید، ارسال و مرجوعی.
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-[#faf9f7] border border-neutral-100 open:border-[#d97757]/40"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-sm md:text-base font-bold text-neutral-900 select-none">
                  {faq.q}
                  <span className="text-[#d97757] transition-transform duration-200 group-open:rotate-45 text-xl shrink-0 leading-none">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm text-neutral-600 leading-7">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-8">
            <p className="text-sm text-neutral-600 leading-7">
              پاسخ سوال خود را پیدا نکردید؟ با ما در تماس باشید.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#d97757] text-white px-8 py-3 text-sm font-bold transition-all hover:bg-[#c86a4c] shadow-[0_8px_20px_rgba(217,119,87,0.3)] shrink-0"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
