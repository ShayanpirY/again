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
    const { name, price, stock, category, description, images, sizes, colors } = body;

    console.log("POST /api/admin/products payload:", { name, price, stock, category, description, images, sizes, colors });

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "فیلدهای نام، قیمت و دسته‌بندی الزامی هستند." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "قیمت باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { error: "موجودی باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد." },
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
        price: parsedPrice,
        stock: parsedStock,
        description: description || "",
        images: Array.isArray(images) ? images : images ? [images] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        colors: Array.isArray(colors) ? colors : [],
        categoryId: categoryRecord.id,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    console.log("POST /api/admin/products success:", product.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Prisma Error:", error);
    console.error("Failed to create product:", error);
    const errorMessage = error instanceof Error ? error.message : "خطا در ایجاد محصول. لطفاً دوباره تلاش کنید.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
