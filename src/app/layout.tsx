import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "کودک | پوشاک کودک و نوجوان",
    template: "%s | کودک",
  },
  description: "فروشگاه آنلاین پوشاک کودک و نوجوان با بالاترین کیفیت، تنوع رنگی و قیمت مناسب. خرید آنلاین با ارسال سریع.",
  keywords: ["پوشاک کودک", "لباس نوزاد", "لباس کودک", "لباس نوجوان", "فروشگاه آنلاین کودک"],
  authors: [{ name: "کودک" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://kodak.ir",
    title: "کودک | فروشگاه آنلاین پوشاک کودک و نوجوان",
    description: "فروشگاه آنلاین پوشاک کودک و نوجوان با بالاترین کیفیت، تنوع رنگی و قیمت مناسب.",
    siteName: "کودک",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-vazirmatn">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
