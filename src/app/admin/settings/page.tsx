"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

type Settings = {
  id: string;
  supportPhone: string;
  freeShippingThreshold: number;
  promoText: string;
  instagramUrl: string;
  updatedAt: string;
};

const DEFAULT_VALUES = {
  supportPhone: "",
  freeShippingThreshold: 2500000,
  promoText: "۱۰٪ تخفیف با کد B2510",
  instagramUrl: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) {
        setMessage({ type: "error", text: "خطا در دریافت تنظیمات. دسترسی غیرمجاز است." });
        return;
      }
      const data: Settings = await res.json();
      setForm({
        supportPhone: data.supportPhone ?? DEFAULT_VALUES.supportPhone,
        freeShippingThreshold: data.freeShippingThreshold ?? DEFAULT_VALUES.freeShippingThreshold,
        promoText: data.promoText ?? DEFAULT_VALUES.promoText,
        instagramUrl: data.instagramUrl ?? DEFAULT_VALUES.instagramUrl,
      });
    } catch {
      setMessage({ type: "error", text: "خطا در دریافت تنظیمات." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchSettings();
    };
    load();
    return () => {};
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportPhone: form.supportPhone,
          freeShippingThreshold: Number(form.freeShippingThreshold),
          promoText: form.promoText,
          instagramUrl: form.instagramUrl,
        }),
      });
      const data: Settings & { error?: string } = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "خطا در ذخیره تنظیمات." });
        return;
      }
      setMessage({ type: "success", text: "تنظیمات با موفقیت ذخیره شد." });
      setForm({
        supportPhone: data.supportPhone,
        freeShippingThreshold: data.freeShippingThreshold,
        promoText: data.promoText,
        instagramUrl: data.instagramUrl,
      });
    } catch {
      setMessage({ type: "error", text: "خطا در ارتباط با سرور." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">تنظیمات فروشگاه</h1>
          <p className="text-sm text-neutral-500 mt-1">
            مقادیر زیر در بخش‌های سایت (نوار اطلاع‌رسانی، ارسال رایگان، تماس) نمایش داده می‌شود.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="supportPhone">شماره تلفن پشتیبانی</Label>
          <Input
            id="supportPhone"
            dir="ltr"
            className="h-9 text-left"
            placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
            value={form.supportPhone}
            onChange={(e) => setForm((prev) => ({ ...prev, supportPhone: e.target.value }))}
          />
          <p className="text-xs text-neutral-400">اگر خالی باشد، در بخش تماس و فوتر نمایش داده نمی‌شود.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="freeShippingThreshold">حداقل خرید برای ارسال رایگان (تومان)</Label>
          <Input
            id="freeShippingThreshold"
            type="number"
            min={0}
            step={1000}
            className="h-9"
            value={form.freeShippingThreshold}
            onChange={(e) => setForm((prev) => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
          />
          <p className="text-xs text-neutral-400">
            این عدد در سبد خرید، تسویه‌حساب و صفحه شرایط ارسال برای محاسبه هزینه ارسال استفاده می‌شود.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="promoText">متن نوار اطلاع‌رسانی بالای سایت</Label>
          <Input
            id="promoText"
            className="h-9"
            placeholder="۱۰٪ تخفیف با کد B2510"
            value={form.promoText}
            onChange={(e) => setForm((prev) => ({ ...prev, promoText: e.target.value }))}
          />
          <p className="text-xs text-neutral-400">اگر خالی باشد، نوار اطلاع‌رسانی نمایش داده نمی‌شود.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramUrl">لینک اینستاگرام</Label>
          <Input
            id="instagramUrl"
            dir="ltr"
            className="h-9 text-left"
            placeholder="https://instagram.com/koodak"
            value={form.instagramUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))}
          />
          <p className="text-xs text-neutral-400">اگر خالی باشد، در بخش تماس و فوتر نمایش داده نمی‌شود.</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving || loading} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
