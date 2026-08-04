import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sale = searchParams.get("sale");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categorySlug) {
      const category = await prisma.category.findFirst({
        where: { slug: categorySlug },
      });

      if (category) {
        where.categoryId = category.id;
      } else {
        return NextResponse.json([]);
      }
    }

    if (sale === "true") {
      where.isSale = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
