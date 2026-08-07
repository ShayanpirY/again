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
    const { name, price, stock, category, description, images, sizes, colors, variants } = body;

    console.log("POST /api/admin/products payload:", { name, price, stock, category, description, images, sizes, colors, variants });

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "فیلدهای نام، قیمت و دسته‌بندی الزامی هستند." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);

    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "قیمت باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد." },
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

    const normalizedVariants = Array.isArray(variants)
      ? variants
          .filter((v: { color?: string; size?: string; stock?: number }) => v.color && v.size)
          .map((v: { color?: string; size?: string; stock?: number }) => ({
            color: v.color,
            size: v.size,
            stock: Number(v.stock) || 0,
          }))
      : [];

    const product = await prisma.product.create({
      data: {
        title: name,
        price: parsedPrice,
        stock: Number(stock) || 0,
        description: description || "",
        images: Array.isArray(images) ? images : images ? [images] : [],
        sizes: Array.isArray(sizes) ? sizes : [],
        colors: Array.isArray(colors) ? colors : [],
        categoryId: categoryRecord.id,
        isActive: true,
        variants: {
          create: normalizedVariants,
        },
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
