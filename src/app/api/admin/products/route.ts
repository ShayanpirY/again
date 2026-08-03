import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, images, sizes } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      const slug = category
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
        .replace(/^-+|-+$/g, "");

      categoryRecord = await prisma.category.create({
        data: {
          name: category,
          slug: slug || "uncategorized",
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        title: name,
        price: parseInt(price) || 0,
        description: description || "",
        images: Array.isArray(images) ? images : images ? [images] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        categoryId: categoryRecord.id,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
