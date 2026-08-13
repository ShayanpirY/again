import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim();
    const limitRaw = parseInt(searchParams.get("limit") || "", 10);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 200)
        : query
          ? 24
          : 100;

    const where: Record<string, unknown> = { isActive: true };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        {
          category: {
            is: { name: { contains: query, mode: "insensitive" } },
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // فقط فیلدهای سبک؛ تصویر اول (بدون base64 حجیم)
    const light = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.images?.[0] || "",
      colors: p.colors || [],
      brand: p.brand,
      category: p.category ? { name: p.category.name } : undefined,
    }));

    return NextResponse.json(light);
  } catch (error) {
    console.error("Failed to search products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
