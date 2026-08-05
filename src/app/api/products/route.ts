import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sale = searchParams.get("sale");
    const sort = searchParams.get("sort") || "newest";
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const fabric = searchParams.get("fabric");
    const season = searchParams.get("season");
    const brand = searchParams.get("brand");
    const inStock = searchParams.get("inStock");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

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

    if (colors.length > 0) {
      where.colors = { hasSome: colors };
    }

    if (fabric) {
      where.fabric = fabric;
    }

    if (season) {
      where.season = season;
    }

    if (brand) {
      where.brand = brand;
    }

    if (inStock === "true") {
      where.stock = { gt: 0 };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseInt(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseInt(maxPrice);
    }

    const orderBy: Record<string, unknown> = {};
    switch (sort) {
      case "price-asc":
        orderBy.price = "asc";
        break;
      case "price-desc":
        orderBy.price = "desc";
        break;
      case "best-selling":
        orderBy.stock = "desc";
        break;
      case "newest":
      default:
        orderBy.createdAt = "desc";
        break;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
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
