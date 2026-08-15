import { NextResponse } from "next/server";
import { getCachedSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getCachedSiteSettings();
  return NextResponse.json({
    supportPhone: settings.supportPhone,
    freeShippingThreshold: settings.freeShippingThreshold,
    promoText: settings.promoText,
    instagramUrl: settings.instagramUrl,
  });
}

