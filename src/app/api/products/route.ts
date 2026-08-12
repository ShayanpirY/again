import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const QUERY_TIMEOUT_MS = 8000;

async function withTimeout<T>(promise: Promise<T>, ms = QUERY_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Database query timed out after ${ms}ms`)),
      ms
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function emptyResponse(message: string) {
  return NextResponse.json([], {
    status: 200,
    headers: {
      "X-Total-Count": "0",
      "X-Error": message,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlugs = searchParams.get("category")?.split(",").filter(Boolean) || [];
    
    // اصلاح صفحه‌بندی برای هماهنگی با فرانت‌اند
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    const sale = searchParams.get("sale");
    const sort = searchParams.get("sort") || "newest";
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const ageGroups = searchParams.get("age")?.split(",").filter(Boolean) || [];
    const fabrics = searchParams.get("fabric")?.split(",").filter(Boolean) || [];
    const seasons = searchParams.get("season")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    const inStock = searchParams.get("inStock");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categorySlugs.length > 0) {
      const categories = await withTimeout(
        prisma.category.findMany({
          where: { slug: { in: categorySlugs } },
        })
      );

      if (categories.length === 0) {
        return emptyResponse("No matching categories found");
      }
      where.categoryId = { in: categories.map((category) => category.id) };
    }

    if (sale === "true") {
      where.isSale = true;
    }

    if (colors.length > 0) {
      where.colors = { hasSome: colors };
    }

    if (sizes.length > 0) {
      where.sizes = { hasSome: sizes };
    }

    if (ageGroups.length > 0) {
      where.ageGroup = { in: ageGroups };
    }

    if (fabrics.length > 0) {
      where.fabric = { in: fabrics };
    }

    if (seasons.length > 0) {
      where.season = { in: seasons };
    }

    if (brands.length > 0) {
      where.brand = { in: brands };
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

    const [total, products] = await Promise.all([
      withTimeout(prisma.product.count({ where })),
      withTimeout(
        prisma.product.findMany({
          where,
          include: {
            category: { select: { name: true } },
          },
          orderBy,
          take: limit,
          skip,
        })
      ),
    ]);

    return NextResponse.json(products, {
      headers: {
        "X-Total-Count": String(total),
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return emptyResponse("Failed to fetch products");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ایجاد محصول جدید در دیتابیس
    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        price: Number(body.price),
        description: body.description || "",
        categoryId: body.categoryId,
        images: body.images || [],
        sizes: body.sizes || [],
        colors: body.colors || [],
        stock: Number(body.stock || 0),
        gender: body.gender || null,
        type: body.type || null,
        brand: body.brand || null,
        ageGroup: body.ageGroup || null,
        season: body.season || null,
        fabric: body.fabric || null,
        isActive: body.isActive ?? true,
        isSale: body.isSale ?? false,
        isNew: body.isNew ?? true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره محصول" },
      { status: 500 }
    );
  }
}