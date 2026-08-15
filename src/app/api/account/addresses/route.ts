import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidIranPhone, normalizeIranPhone, toEnDigits } from "@/lib/validation";

type AddressInput = {
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  street: string;
  plaque?: string;
  unit?: string;
  postalCode: string;
  phone: string;
  email?: string;
};

function parseBody(body: unknown): { ok: true; data: AddressInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "درخواست نامعتبر است." };
  }

  const b = body as Record<string, unknown>;
  const firstName = String(b.firstName ?? "").trim();
  const lastName = String(b.lastName ?? "").trim();
  const province = String(b.province ?? "").trim();
  const city = String(b.city ?? "").trim();
  const street = String(b.street ?? "").trim();
  const plaque = String(b.plaque ?? "").trim();
  const unit = String(b.unit ?? "").trim();
  const postalCode = String(b.postalCode ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const email = String(b.email ?? "").trim();

  if (!firstName || !lastName) return { ok: false, error: "نام و نام خانوادگی را وارد کنید." };
  if (!province) return { ok: false, error: "استان را انتخاب کنید." };
  if (!city) return { ok: false, error: "شهر را انتخاب کنید." };
  if (!street) return { ok: false, error: "آدرس را وارد کنید." };
  if (!postalCode || !/^\d{10}$/.test(toEnDigits(postalCode))) {
    return { ok: false, error: "کد پستی باید ۱۰ رقم باشد." };
  }
  if (!isValidIranPhone(phone)) {
    return { ok: false, error: "شماره موبایل معتبر نیست (مثال: 09123456789)" };
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      province,
      city,
      street,
      plaque: plaque || undefined,
      unit: unit || undefined,
      postalCode: toEnDigits(postalCode),
      phone: normalizeIranPhone(phone),
      email: email || undefined,
    },
  };
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب خود شوید." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = parseBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existingCount = await prisma.address.count({
    where: { userId: session.user.id },
  });

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      isDefault: existingCount === 0,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      name:
        [parsed.data.firstName, parsed.data.lastName].filter(Boolean).join(" ").trim() ||
        undefined,
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
