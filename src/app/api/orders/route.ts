import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { applyCoupon } from "@/lib/coupons";
import { getCachedSiteSettings } from "@/lib/site-settings";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    const body = await request.json();
    const { customerName, customerPhone, address, items, promoCode } = body;

    console.log("POST /api/orders payload:", { customerName, customerPhone, address, itemsCount: items?.length, promoCode });

    const missingFields: string[] = [];
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) missingFields.push("customerName");
    if (!customerPhone || typeof customerPhone !== "string" || !customerPhone.trim()) missingFields.push("customerPhone");
    if (!address || typeof address !== "string" || !address.trim()) missingFields.push("address");
    if (!items || !Array.isArray(items) || items.length === 0) missingFields.push("items");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
          message: `فیلدهای لازم ثبت نشده‌اند: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const promo = applyCoupon(promoCode ?? "", subtotal);
    const discount = promo.ok ? promo.discount : 0;
    const settings = await getCachedSiteSettings();
    const shippingCost = subtotal > settings.freeShippingThreshold ? 0 : 150000;
    const totalPrice = subtotal - discount + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId,
        customerName,
        customerPhone,
        address,
        totalPrice,
        discount,
        shippingCost,
        items: {
          create: items.map((item: Record<string, unknown>) => ({
            productId: item.productId as string | undefined,
            product: item.product as string | undefined,
            name: item.name as string,
            price: Number(item.price),
            quantity: Number(item.quantity),
            size: item.size as string | undefined,
            color: item.color as string | undefined,
            image: item.image as string | undefined,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
