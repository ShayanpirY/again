"use client";

import { useState } from "react";
import Link from "next/link";

const supportInfo = [
  { label: "ساعت کاری", value: "شنبه تا پنجشنبه، ۹ تا ۱۷" },
  { label: "تلفن تماس", value: "۰۲۱-۱۲۳۴۵۶۷۸", dir: "ltr" as const },
  { label: "ایمیل", value: "info@koodak.ir", dir: "ltr" as const },
  { label: "آدرس", value: "تهران، خیابان ولیعصر، مرکز خرید کودک" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#d97757] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">تماس با ما</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mb-6">
              تماس با ما
            </h1>
            <p className="text-sm text-neutral-600 leading-7 mb-6">
              تیم پشتیبانی «کودک» آماده پاسخگویی به سوالات شما درباره سفارش، ارسال و مرجوعی است.
            </p>

            <div className="space-y-4">
              {supportInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#d97757] bg-[#fdf1ec] rounded-full px-3 py-1.5 shrink-0 mt-0.5">
                    {info.label}
                  </span>
                  <span
                    className="text-sm text-neutral-700 font-medium leading-7 break-all"
                    dir={info.dir}
                  >
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 mb-6">
              فرم تماس
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-16 h-16 rounded-full bg-[#d97757]/10 text-[#d97757] flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="font-black text-neutral-900 text-lg mb-2">
                  پیام شما ثبت شد
                </h3>
                <p className="text-sm text-neutral-600 leading-7">
                  کارشناسان ما به‌زودی با شما تماس می‌گیرند.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-bold text-neutral-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]"
                    placeholder="مثلاً سارا محمدی"
                  />
                </div>

                <div>
                  <label htmlFor="contact-mobile" className="block text-sm font-bold text-neutral-700 mb-2">
                    شماره موبایل
                  </label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757]"
                    placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-bold text-neutral-700 mb-2">
                    پیام
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#d97757] focus:ring-1 focus:ring-[#d97757] resize-none"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-[#d97757] text-white py-3.5 text-sm font-bold transition-all hover:bg-[#c86a4c] shadow-[0_8px_20px_rgba(217,119,87,0.3)] disabled:opacity-60"
                >
                  {sending ? "در حال ارسال..." : "ارسال پیام"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
