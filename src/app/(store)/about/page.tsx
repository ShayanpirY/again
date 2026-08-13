import Link from "next/link";

const features = [
  {
    emoji: "🧵",
    title: "کیفیت برتر",
    text: "همه پوشاک ما از پارچه‌های نرم، لطیف و استاندارد دوخته می‌شوند تا پوست حساس کودک در امان بماند.",
  },
  {
    emoji: "🎨",
    title: "تنوع بالا",
    text: "از نوزاد تا نوجوان، برای هر سلیقه و هر مناسبتی مجموعه‌ای کامل از پوشاک دخترانه و پسرانه داریم.",
  },
  {
    emoji: "🛍️",
    title: "خرید آسان آنلاین",
    text: "با چند کلیک سفارش‌تان را ثبت کنید و آن را در سریع‌ترین زمان درب منزل تحویل بگیرید.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">درباره ما</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-8">
            درباره ما
          </h1>

          <p className="text-neutral-600 leading-8 mb-4">
            «کودک» فروشگاه تخصصی پوشاک کودک، نوزاد و نوجوان است. ما باور داریم کوچک‌ترین‌های خانواده لایق بهترین‌ها هستند؛
            به همین دلیل مجموعه‌ای از پوشاک باکیفیت، راحت و شیک را برای هر رده سنی گرد هم آورده‌ایم.
          </p>
          <p className="text-neutral-600 leading-8 mb-10">
            هدف ما ساده است: خرید آسان و مطمئن آنلاین برای والدین. از انتخاب تا ارسال، همه‌چیز را برای شما ساده کرده‌ایم تا
            خیالتان از کیفیت، قیمت و دقت ارسال راحت باشد.
          </p>

          <div className="grid sm:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-[#faf9f7] border border-neutral-100 p-6 text-center"
              >
                <div className="text-4xl mb-3">{feature.emoji}</div>
                <h2 className="font-black text-neutral-900 mb-2">{feature.title}</h2>
                <p className="text-sm text-neutral-600 leading-7">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
