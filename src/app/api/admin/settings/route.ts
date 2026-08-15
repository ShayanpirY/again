import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

function forbidden() {
  return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
}

function normalizeInstagramUrl(value: string): string {
  const url = value.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return forbidden();

  const settings = await getSiteSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "فرمت درخواست نامعتبر است" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "فرمت درخواست نامعتبر است" }, { status: 400 });
  }

  const data: Record<string, string | number> = {};
  const record = body as Record<string, unknown>;

  if (typeof record.supportPhone === "string") {
    data.supportPhone = record.supportPhone.trim();
  }

  if (typeof record.freeShippingThreshold === "number") {
    if (!Number.isInteger(record.freeShippingThreshold) || record.freeShippingThreshold < 0) {
      return NextResponse.json({ error: "مبلغ ارسال رایگان باید عدد صحیح و نامنفی باشد" }, { status: 400 });
    }
    data.freeShippingThreshold = record.freeShippingThreshold;
  }

  if (typeof record.promoText === "string") {
    data.promoText = record.promoText.trim();
  }

  if (typeof record.instagramUrl === "string") {
    data.instagramUrl = normalizeInstagramUrl(record.instagramUrl);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "هیچ فیلد قابل ذخیره‌ای ارسال نشده است" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  revalidateTag("site-settings", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/contact");
  revalidatePath("/shipping");

  return NextResponse.json(settings, {
    headers: { "Cache-Control": "no-store" },
  });
}
