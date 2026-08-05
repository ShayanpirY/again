import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerName: true,
        totalPrice: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
