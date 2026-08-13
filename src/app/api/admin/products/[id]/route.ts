import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, stock, category, description, images, sizes, colors, variants, gender, type } = body;

    console.log("PUT /api/admin/products/:id payload:", { id, name, price, stock, category, description, images, sizes, colors, variants, gender, type });

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "محصول پیدا نشد." },
        { status: 404 }
      );
    }

    const parsedPrice = Number(price);

    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "قیمت باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد." },
        { status: 400 }
      );
    }

    if (gender !== undefined && gender !== null && gender !== "" && !["girl", "boy", "unisex"].includes(gender)) {
      return NextResponse.json(
        { error: "مقدار جنسیت نامعتبر است. باید girl، boy یا unisex باشد." },
        { status: 400 }
      );
    }

    if (type !== undefined && type !== null && type !== "" && !["dress", "set", "tshirt", "jeans", "knitwear", "pants"].includes(type)) {
      return NextResponse.json(
        { error: "مقدار نوع لباس نامعتبر است. باید dress، set، tshirt، jeans، knitwear یا pants باشد." },
        { status: 400 }
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

    const normalizedVariants = Array.isArray(variants)
      ? variants
          .filter((v: { color?: string; size?: string; stock?: number }) => v.color && v.size)
          .map((v: { color?: string; size?: string; stock?: number }) => ({
            color: v.color,
            size: v.size,
            stock: Number(v.stock) || 0,
          }))
      : [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: name,
        price: parsedPrice,
        stock: Number(stock) || 0,
        description: description || "",
        images: Array.isArray(images) ? images : images ? [images] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        colors: Array.isArray(colors) ? colors : [],
        gender: gender || null,
        type: type || null,
        categoryId,
        isActive: true,
        variants: {
          deleteMany: {},
          create: normalizedVariants,
        },
      },
      include: {
        category: true,
      },
    });

    console.log("PUT /api/admin/products/:id success:", product.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Prisma Error:", error);
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش محصول. لطفاً دوباره تلاش کنید." },
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
        { error: "محصول پیدا نشد." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    console.log("DELETE /api/admin/products/:id success:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prisma Error:", error);
    console.error("Failed to delete product:", error);
    const errorMessage = error instanceof Error ? error.message : "خطا در حذف محصول. لطفاً دوباره تلاش کنید.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
