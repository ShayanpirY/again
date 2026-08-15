// تنظیمات فروشگاه (SiteSettings) — یک ردیف با id="default"
//
// بعد از افزودن یا تغییر هر مدل Prisma:
//   1) npx prisma generate && npx prisma db push
//   2) پوشه .next را حذف کن (Remove-Item -Recurse -Force .next)
//   3) dev server را ری‌استارت کن
//
// نکته: اگر فرآیند dev قدیمی باشد (قبل از generate)، prisma.siteSettings
// در حافظه تعریف نشده است؛ در این حالت مقدار پیش‌فرض برگردانده می‌شود تا
// کل سایت crash نکند. بعد از ری‌استارت، مدل در دسترس خواهد بود.

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  supportPhone: "",
  freeShippingThreshold: 2500000,
  promoText: "۱۰٪ تخفیف با کد B2510",
  instagramUrl: "",
} as const;

export type SiteSettings = {
  id: string;
  supportPhone: string;
  freeShippingThreshold: number;
  promoText: string;
  instagramUrl: string;
  updatedAt: Date;
};

let staleClientLogged = false;

function makeDefaults(): SiteSettings {
  return { id: "default", ...DEFAULT_SETTINGS, updatedAt: new Date() };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const delegate = prisma.siteSettings;
  if (!delegate) {
    if (!staleClientLogged && process.env.NODE_ENV === "development") {
      staleClientLogged = true;
      console.error(
        "[site-settings] prisma.siteSettings is unavailable (stale Prisma Client). " +
          "Run `npx prisma generate`, delete .next, and restart the dev server."
      );
    }
    return makeDefaults();
  }

  const existing = await delegate.findUnique({ where: { id: "default" } });
  if (existing) return existing;

  try {
    return await delegate.create({
      data: { id: "default", ...DEFAULT_SETTINGS },
    });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "P2002") {
      const row = await delegate.findUnique({ where: { id: "default" } });
      if (row) return row;
    }
    if (!staleClientLogged && process.env.NODE_ENV === "development") {
      staleClientLogged = true;
      console.error("[site-settings] failed to read/create settings, using defaults:", error);
    }
    return makeDefaults();
  }
}

export const getCachedSiteSettings = unstable_cache(
  () => getSiteSettings(),
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}
