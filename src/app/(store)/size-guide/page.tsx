import Link from "next/link";

const groups = [
  {
    title: "نوزاد",
    emoji: "👶",
    note: "۰ تا ۲۴ ماه",
    rows: [
      { age: "۰ تا ۳ ماه", height: "۵۴ تا ۶۲", size: "۵۶" },
      { age: "۳ تا ۶ ماه", height: "۶۲ تا ۶۸", size: "۶۲" },
      { age: "۶ تا ۹ ماه", height: "۶۸ تا ۷۴", size: "۶۸" },
      { age: "۹ تا ۱۲ ماه", height: "۷۴ تا ۸۰", size: "۷۴" },
      { age: "۱۲ تا ۱۸ ماه", height: "۸۰ تا ۸۶", size: "۸۰" },
      { age: "۱۸ تا ۲۴ ماه", height: "۸۶ تا ۹۲", size: "۸۶" },
    ],
  },
  {
    title: "کودک",
    emoji: "🧒",
    note: "۲ تا ۸ سال",
    rows: [
      { age: "۲ سال", height: "۹۲ تا ۹۸", size: "۲" },
      { age: "۳ سال", height: "۹۸ تا ۱۰۴", size: "۳" },
      { age: "۴ سال", height: "۱۰۴ تا ۱۱۰", size: "۴" },
      { age: "۵ سال", height: "۱۱۰ تا ۱۱۶", size: "۵" },
      { age: "۶ سال", height: "۱۱۶ تا ۱۲۲", size: "۶" },
      { age: "۷ سال", height: "۱۲۲ تا ۱۲۸", size: "۷" },
      { age: "۸ سال", height: "۱۲۸ تا ۱۳۴", size: "۸" },
    ],
  },
  {
    title: "نوجوان",
    emoji: "🧑",
    note: "۱۰ تا ۱۶ سال",
    rows: [
      { age: "۱۰ سال", height: "۱۳۴ تا ۱۴۰", size: "۱۰" },
      { age: "۱۲ سال", height: "۱۴۰ تا ۱۵۲", size: "۱۲" },
      { age: "۱۴ سال", height: "۱۵۲ تا ۱۶۴", size: "۱۴" },
      { age: "۱۶ سال", height: "۱۶۴ تا ۱۷۶", size: "۱۶" },
    ],
  },
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">راهنمای سایز</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
            راهنمای سایز
          </h1>
          <p className="text-sm text-neutral-600 leading-7 mb-8">
            قد کودک را با متر اندازه بگیرید و با جدول زیر مقایسه کنید. اگر قد بین
            دو سایز بود، سایز بزرگ‌تر را انتخاب کنید.
          </p>

          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{group.emoji}</span>
                  <div>
                    <h2 className="font-black text-neutral-900 text-lg">
                      {group.title}
                    </h2>
                    <p className="text-xs text-neutral-500">{group.note}</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-100">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#d97757] text-white">
                        <th className="py-3 px-2 text-sm font-bold">سن</th>
                        <th className="py-3 px-2 text-sm font-bold">
                          قد (سانتی‌متر)
                        </th>
                        <th className="py-3 px-2 text-sm font-bold">سایز</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((row, index) => (
                        <tr
                          key={row.age}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-[#faf9f7]"
                          }
                        >
                          <td className="py-3 px-2 text-sm text-neutral-700">
                            {row.age}
                          </td>
                          <td className="py-3 px-2 text-sm text-neutral-700">
                            {row.height}
                          </td>
                          <td className="py-3 px-2 text-sm font-bold text-[#d97757]">
                            {row.size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#faf9f7] border border-neutral-100 p-6">
            <h3 className="font-black text-neutral-900 mb-2">
              نکته اندازه‌گیری
            </h3>
            <p className="text-sm text-neutral-600 leading-7">
              قد را بدون کفش و با بدن صاف اندازه بگیرید. سایز محصولات معمولاً
              بر اساس قد است؛ برای اندام ریزتر یک سایز کوچک‌تر و برای اندام
              درشت‌تر یک سایز بزرگ‌تر انتخاب کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
