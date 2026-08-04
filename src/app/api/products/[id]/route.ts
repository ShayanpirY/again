import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        questions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: id },
      },
      include: {
        category: true,
      },
      take: 8,
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
