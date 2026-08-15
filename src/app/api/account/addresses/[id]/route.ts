import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidIranPhone, normalizeIranPhone, toEnDigits } from "@/lib/validation";

async function getOwnedAddress(id: string, userId: string) {
  if (!id) return null;
  return prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب خود شوید." }, { status: 401 });
  }

  const { id } = await params;
  const owned = await getOwnedAddress(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "آدرس یافت نشد." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  if (b.isDefault === true) {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
    return NextResponse.json({ ok: true });
  }

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

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "نام و نام خانوادگی را وارد کنید." }, { status: 400 });
  }
  if (!province || !city || !street) {
    return NextResponse.json({ error: "استان، شهر و آدرس را کامل وارد کنید." }, { status: 400 });
  }
  if (!postalCode || !/^\d{10}$/.test(toEnDigits(postalCode))) {
    return NextResponse.json({ error: "کد پستی باید ۱۰ رقم باشد." }, { status: 400 });
  }
  if (!isValidIranPhone(phone)) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست (مثال: 09123456789)" },
      { status: 400 }
    );
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      firstName,
      lastName,
      province,
      city,
      street,
      plaque: plaque || null,
      unit: unit || null,
      postalCode: toEnDigits(postalCode),
      phone: normalizeIranPhone(phone),
      email: email || null,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" ").trim() || undefined,
    },
  });

  return NextResponse.json({ address });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب خود شوید." }, { status: 401 });
  }

  const { id } = await params;
  const owned = await getOwnedAddress(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "آدرس یافت نشد." }, { status: 404 });
  }

  const deleted = await prisma.address.delete({ where: { id } });

  if (deleted.isDefault) {
    const fallback = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (fallback) {
      await prisma.address.update({
        where: { id: fallback.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
