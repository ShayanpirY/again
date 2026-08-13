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

const normalize = (value: string) => value.trim().toLowerCase();

const SLUG_ALIASES: Record<string, string> = {
  kids: "kids",
  کودک: "kids",
  baby: "baby",
  نوزاد: "baby",
  "کودک نوپا": "baby",
  نوپا: "baby",
  preteen: "preteen",
  "pre-teen": "preteen",
  نوجوان: "preteen",
  newborn: "newborn",
  "تازه متولد شده": "newborn",
  girl: "girl",
  دخترانه: "girl",
  boy: "boy",
  پسرانه: "boy",
  essentials: "essentials",
  "لوازم ضروری": "essentials",
  sale: "sale",
  "حراج ویژه": "sale",
};

const GENDER_ALIASES: Record<string, string> = {
  girl: "girl",
  دخترانه: "girl",
  female: "girl",
  boy: "boy",
  پسرانه: "boy",
  male: "boy",
  unisex: "unisex",
  یونیسکس: "unisex",
};

const GENDER_SLUGS = ["girl", "boy"];

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
    const genders = searchParams.get("gender")?.split(",").filter(Boolean) || [];
    const fabrics = searchParams.get("fabric")?.split(",").filter(Boolean) || [];
    const seasons = searchParams.get("season")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    const inStock = searchParams.get("inStock");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: Record<string, unknown> = {
      isActive: true,
    };
    // هر گروه فیلتر جداگانه، بین گروه‌ها AND
    const andGroups: Record<string, unknown>[] = [];

    // دسته‌بندی: اسلاگ + معادل فارسی/انگلیسی.
    // دخترانه/پسرانه هم روی gender تطبیق داده می‌شود (نه فقط category).
    // «حراج ویژه» (sale) → isSale.
    if (categorySlugs.length > 0) {
      const normalizedSlugs = [
        ...new Set(
          categorySlugs
            .map((s) => SLUG_ALIASES[normalize(s)] || normalize(s))
            .filter(Boolean)
        ),
      ];

      const isSaleRequested = normalizedSlugs.includes("sale");
      const genderSlugs = normalizedSlugs.filter((s) => GENDER_SLUGS.includes(s));
      const plainSlugs = normalizedSlugs.filter(
        (s) => !GENDER_SLUGS.includes(s) && s !== "sale"
      );

      const categoryOr: Record<string, unknown>[] = [];
      if (plainSlugs.length > 0) {
        const categories = await withTimeout(
          prisma.category.findMany({
            where: { slug: { in: plainSlugs } },
          })
        );
        if (categories.length === 0) {
          return emptyResponse("No matching categories found");
        }
        categoryOr.push({ categoryId: { in: categories.map((c) => c.id) } });
      }
      if (genderSlugs.length > 0) {
        categoryOr.push({ gender: { in: genderSlugs } });
      }
      if (categoryOr.length === 1) {
        andGroups.push(categoryOr[0]);
      } else if (categoryOr.length > 1) {
        andGroups.push({ OR: categoryOr });
      }
      if (isSaleRequested) {
        andGroups.push({ isSale: true });
      }
    }

    if (sale === "true") {
      andGroups.push({ isSale: true });
    }

    if (genders.length > 0) {
      const normalizedGenders = [
        ...new Set(
          genders.map((g) => GENDER_ALIASES[normalize(g)] || normalize(g)).filter(Boolean)
        ),
      ];
      if (normalizedGenders.length > 0) {
        andGroups.push({ gender: { in: normalizedGenders } });
      }
    }

    if (colors.length > 0) {
      andGroups.push({ colors: { hasSome: colors } });
    }

    if (sizes.length > 0) {
      andGroups.push({ sizes: { hasSome: sizes } });
    }

    if (ageGroups.length > 0) {
      // رده سنی: هم ageGroup و هم اسلاگ دسته سنی (newborn/baby/preteen/...)
      // دخترانه/پسرانه اگر در age آمد → روی gender هم تطبیق داده شود
      const ageOr: Record<string, unknown>[] = [{ ageGroup: { in: ageGroups } }];
      const normalizedAges = [
        ...new Set(
          ageGroups.map((a) => SLUG_ALIASES[normalize(a)] || normalize(a)).filter(Boolean)
        ),
      ];
      const ageGenderSlugs = normalizedAges.filter((s) => GENDER_SLUGS.includes(s));
      const ageCategorySlugs = normalizedAges.filter((s) => !GENDER_SLUGS.includes(s));
      if (ageGenderSlugs.length > 0) {
        ageOr.push({ gender: { in: ageGenderSlugs } });
      }
      if (ageCategorySlugs.length > 0) {
        const ageCategories = await withTimeout(
          prisma.category.findMany({ where: { slug: { in: ageCategorySlugs } } })
        );
        if (ageCategories.length > 0) {
          ageOr.push({ categoryId: { in: ageCategories.map((c) => c.id) } });
        }
      }
      if (ageOr.length === 1) {
        andGroups.push(ageOr[0]);
      } else {
        andGroups.push({ OR: ageOr });
      }
    }

    if (fabrics.length > 0) {
      andGroups.push({ fabric: { in: fabrics } });
    }

    if (seasons.length > 0) {
      andGroups.push({ season: { in: seasons } });
    }

    if (brands.length > 0) {
      andGroups.push({ brand: { in: brands } });
    }

    if (inStock === "true") {
      andGroups.push({ stock: { gt: 0 } });
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, unknown> = {};
      if (minPrice) priceFilter.gte = parseInt(minPrice);
      if (maxPrice) priceFilter.lte = parseInt(maxPrice);
      andGroups.push({ price: priceFilter });
    }

    if (andGroups.length === 1) {
      Object.assign(where, andGroups[0]);
    } else if (andGroups.length > 1) {
      where.AND = andGroups;
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