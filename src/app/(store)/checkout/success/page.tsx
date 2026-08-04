"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTrackingCode("KDK" + Math.random().toString(36).substring(2, 10).toUpperCase());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">سفارش شما با موفقیت ثبت شد!</h1>
            <p className="text-neutral-600">از اعتماد شما سپاسگزاریم. سفارش شما در حال پردازش است.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">سفارش شما با موفقیت ثبت شد!</h1>
          <p className="text-neutral-600">از اعتماد شما سپاسگزاریم. سفارش شما در حال پردازش است.</p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-sm space-y-2">
          <p className="text-sm text-neutral-600">کد پیگیری سفارش شما:</p>
          <p className="text-xl font-bold text-neutral-900 tracking-wider">{trackingCode}</p>
          <p className="text-xs text-neutral-500 mt-2">این کد را برای پیگیری سفارش خود ذخیره کنید.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/">
            <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              بازگشت به فروشگاه
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
