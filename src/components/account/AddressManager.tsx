"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { iranLocations, provinces } from "@/data/iran-locations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Pencil, Trash2, Plus, Check, X } from "lucide-react";

type AddressData = {
  id: string;
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  street: string;
  plaque: string;
  unit: string;
  postalCode: string;
  phone: string;
  email: string;
  isDefault: boolean;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  province: "",
  city: "",
  street: "",
  plaque: "",
  unit: "",
  postalCode: "",
  phone: "",
  email: "",
};

export function AddressManager({
  initialAddresses,
}: {
  initialAddresses: AddressData[];
}) {
  const router = useRouter();
  const { update } = useSession();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(initialAddresses.length === 0);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cities = form.province ? iranLocations[form.province] || [] : [];

  const set = (key: keyof typeof emptyForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (a: AddressData) => {
    setEditingId(a.id);
    setForm({
      firstName: a.firstName,
      lastName: a.lastName,
      province: a.province,
      city: a.city,
      street: a.street,
      plaque: a.plaque,
      unit: a.unit,
      postalCode: a.postalCode,
      phone: a.phone.replace(/^0/, ""),
      email: a.email,
    });
    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
      ...form,
      phone: form.phone,
    };

    setSaving(true);
    try {
      const isEdit = editingId !== null;
      const res = await fetch(
        isEdit ? `/api/account/addresses/${editingId}` : "/api/account/addresses",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();

      if (!res.ok) {
        setError(result?.error || "خطا در ذخیره آدرس");
        setSaving(false);
        return;
      }

      setSuccess(true);
      closeForm();
      setSaving(false);
      await update();
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;
    setError("");
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const result = await res.json().catch(() => null);
      setError(result?.error || "خطا در حذف آدرس");
    }
  };

  const setDefault = async (id: string) => {
    setError("");
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const result = await res.json().catch(() => null);
      setError(result?.error || "خطا در ذخیره آدرس");
    }
  };

  const inputCls =
    "rounded-xl w-full h-11 border-neutral-200";
  const selectCls =
    "w-full h-11 px-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757] disabled:bg-neutral-50 disabled:text-neutral-400";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-neutral-900">مشخصات کاربر</h1>
            <p className="mt-1 text-sm text-neutral-500">
              نام و نام خانوادگی خود را ثبت کنید و آدرس‌های ذخیره‌شده را برای ارسال سفارش‌ها مدیریت کنید.
            </p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#d97757]/10 text-[#d97757]">
            <UserRound className="size-5" />
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          آدرس با موفقیت ذخیره شد.
        </p>
      )}

      {initialAddresses.length > 0 && !formOpen && (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {initialAddresses.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-neutral-900">
                    {a.firstName} {a.lastName}
                  </p>
                  {a.isDefault && (
                    <span className="rounded-full bg-[#d97757]/10 px-2.5 py-0.5 text-xs font-medium text-[#d97757]">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(a)}
                    className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {a.street}
                {a.plaque && <>، پلاک {a.plaque}</>}
                {a.unit && <>، واحد {a.unit}</>}
                <br />
                {a.city}، {a.province} - کد پستی {a.postalCode}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-neutral-400" dir="ltr">
                  {a.phone}
                </p>
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(a.id)}
                    className="flex items-center gap-1 text-xs font-medium text-[#d97757] hover:underline"
                  >
                    <Check className="size-3.5" />
                    پیش‌فرض کن
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!formOpen && (
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 rounded-full border border-[#d97757] px-6 py-2.5 text-sm font-bold text-[#d97757] transition-colors hover:bg-[#d97757] hover:text-white"
        >
          <Plus className="size-4" />
          افزودن آدرس جدید
        </button>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm md:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">
              {editingId ? "ویرایش آدرس" : "آدرس جدید"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="بستن"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="addr-firstName">نام</Label>
                <Input
                  id="addr-firstName"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="نام"
                  required
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-lastName">نام خانوادگی</Label>
                <Input
                  id="addr-lastName"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="نام خانوادگی"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="addr-province">استان</Label>
                <select
                  id="addr-province"
                  value={form.province}
                  onChange={(e) => {
                    set("province", e.target.value);
                    set("city", "");
                  }}
                  className={selectCls}
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-city">شهر</Label>
                <select
                  id="addr-city"
                  value={form.city}
                  disabled={!form.province}
                  onChange={(e) => set("city", e.target.value)}
                  className={selectCls}
                >
                  <option value="">
                    {form.province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr-street">آدرس</Label>
              <textarea
                id="addr-street"
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                placeholder="خیابان، کوچه، پلاک، واحد..."
                required
                className="w-full min-h-[90px] px-3 py-2.5 text-sm border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addr-plaque">پلاک</Label>
                <Input
                  id="addr-plaque"
                  value={form.plaque}
                  onChange={(e) => set("plaque", e.target.value)}
                  placeholder="مثلاً ۱۲"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-unit">واحد</Label>
                <Input
                  id="addr-unit"
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  placeholder="مثلاً ۳"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="addr-postalCode">کد پستی</Label>
                <Input
                  id="addr-postalCode"
                  value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value.replace(/[^\d۰-۹]/g, ""))}
                  placeholder="۱۰ رقم"
                  required
                  className={inputCls}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-phone">شماره موبایل</Label>
                <Input
                  id="addr-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/[^\d۰-۹]/g, ""))}
                  placeholder="09123456789"
                  required
                  className={inputCls}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr-email">ایمیل (اختیاری)</Label>
              <Input
                id="addr-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="example@mail.com"
                className={inputCls}
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#d97757] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c86a4c] disabled:opacity-60"
              >
                {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ذخیره آدرس"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full px-6 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
              >
                انصراف
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
