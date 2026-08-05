import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        stock: true,
        images: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 10,
    });

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error("Failed to fetch low stock products:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock products" },
      { status: 500 }
    );
  }
}
