"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-[0.2em] text-neutral-900">کودک</span>
            </Link>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              پوشاک کودک و نوجوان با بالاترین کیفیت. راحتی و استایل برای کوچک‌ترین‌های شما.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">فروشگاه</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products?age=newborn" className="text-neutral-600 hover:text-black transition-colors">نوزاد</Link></li>
              <li><Link href="/products?age=baby" className="text-neutral-600 hover:text-black transition-colors">کودک</Link></li>
              <li><Link href="/products?age=girl" className="text-neutral-600 hover:text-black transition-colors">دختر</Link></li>
              <li><Link href="/products?age=boy" className="text-neutral-600 hover:text-black transition-colors">پسر</Link></li>
              <li><Link href="/products?age=pre-teen" className="text-neutral-600 hover:text-black transition-colors">نوجوان</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">راهنما</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/shipping" className="text-neutral-600 hover:text-black transition-colors">شرایط ارسال و بازگشت</Link></li>
              <li><Link href="/size-guide" className="text-neutral-600 hover:text-black transition-colors">راهنمای سایز</Link></li>
              <li><Link href="/faq" className="text-neutral-600 hover:text-black transition-colors">سوالات متداول</Link></li>
              <li><Link href="/contact" className="text-neutral-600 hover:text-black transition-colors">تماس با ما</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">درباره ما</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-neutral-600 hover:text-black transition-colors">داستان ما</Link></li>
              <li><Link href="/sustainability" className="text-neutral-600 hover:text-black transition-colors">پایداری</Link></li>
              <li><Link href="/careers" className="text-neutral-600 hover:text-black transition-colors">فرصت‌های شغلی</Link></li>
              <li><Link href="/press" className="text-neutral-600 hover:text-black transition-colors">رسانه‌ها</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">© ۲۰۲۵ کودک. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <Link href="/privacy" className="hover:text-black transition-colors">حریم خصوصی</Link>
            <Link href="/terms" className="hover:text-black transition-colors">شرایط استفاده</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
