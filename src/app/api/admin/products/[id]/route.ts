import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, description, images, sizes } = body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let categoryId = existing.categoryId;

    if (category && category !== existing.category?.name) {
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

      categoryId = categoryRecord.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: name,
        price: parseInt(price) || 0,
        description: description || "",
        images: Array.isArray(images) ? images : images ? [images] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
