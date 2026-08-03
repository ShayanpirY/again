import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, address, totalPrice, items } = body;

    if (!customerName || !customerPhone || !address || !totalPrice || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
