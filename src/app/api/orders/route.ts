import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, address, totalPrice, items } = body;

    console.log("POST /api/orders payload:", { customerName, customerPhone, address, totalPrice, itemsCount: items?.length });

    const missingFields: string[] = [];
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) missingFields.push("customerName");
    if (!customerPhone || typeof customerPhone !== "string" || !customerPhone.trim()) missingFields.push("customerPhone");
    if (!address || typeof address !== "string" || !address.trim()) missingFields.push("address");
    if (totalPrice === undefined || totalPrice === null || totalPrice === "") missingFields.push("totalPrice");
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

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        totalPrice: Number(totalPrice),
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
