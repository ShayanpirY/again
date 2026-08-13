import Link from "next/link";

const returnsItems = [
  {
    emoji: "⏳",
    title: "مرجوعی تا ۳۰ روز",
    text: "از تاریخ تحویل سفارش، تا ۳۰ روز فرصت دارید کالای خریداری‌شده را مرجوع کنید.",
  },
  {
    emoji: "🏷️",
    title: "شرایط کالای مرجوعی",
    text: "کالا باید استفاده‌نشده، شسته‌نشده و همراه با تگ و بسته‌بندی اولیه باشد.",
  },
  {
    emoji: "💬",
    title: "ثبت درخواست",
    text: "درخواست مرجوعی را از طریق صفحه «تماس با ما» ثبت کنید؛ کارشناسان ما در کوتاه‌ترین زمان پاسخ می‌دهند.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">مرجوعی و تعویض</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-8">
            مرجوعی و تعویض
          </h1>

          <div className="space-y-5">
            {returnsItems.map((item) => (
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

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-8">
            <p className="text-sm text-neutral-600 leading-7">
              سوالی درباره مرجوعی دارید؟ با ما در تماس باشید.
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
