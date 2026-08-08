import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, mediaUrl, badge, productId, isActive, order } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "عنوان استوری الزامی است." },
        { status: 400 }
      );
    }

    if (!mediaUrl || !mediaUrl.trim()) {
      return NextResponse.json(
        { error: "لینک تصویر یا ویدیو الزامی است." },
        { status: 400 }
      );
    }

    const safeProductId =
      typeof productId === "string" && productId.trim() ? productId.trim() : null;

    if (!safeProductId) {
      return NextResponse.json(
        { error: "انتخاب محصول الزامی است." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: safeProductId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول مرتبط یافت نشد." },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        title: title.trim(),
        mediaUrl: mediaUrl.trim(),
        badge: badge?.trim() || null,
        productId: safeProductId,
        isActive: isActive !== false,
        order: Number.isInteger(order) ? order : 0,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create story",
      },
      { status: 500 }
    );
  }
}
