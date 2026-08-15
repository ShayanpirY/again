import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

const storyInclude = {
  product: {
    select: {
      id: true,
      title: true,
      price: true,
      images: true,
      isActive: true,
    },
  },
} as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, mediaUrl, badge, productId, isActive, order } = body;

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (productId && productId !== existing.productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: "محصول مرتبط یافت نشد." },
          { status: 400 }
        );
      }
    }

    const story = await prisma.story.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        mediaUrl:
          mediaUrl !== undefined ? mediaUrl.trim() : existing.mediaUrl,
        badge: badge !== undefined ? badge?.trim() || null : existing.badge,
        productId: productId || existing.productId,
        isActive:
          isActive !== undefined ? isActive === true : existing.isActive,
        order:
          order !== undefined && Number.isInteger(order)
            ? order
            : existing.order,
      },
      include: storyInclude,
    });

    revalidateTag("stories", { expire: 0 });
    revalidatePath("/");

    return NextResponse.json(story);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const story = await prisma.story.update({
      where: { id },
      data: {
        isActive:
          typeof body.isActive === "boolean"
            ? body.isActive
            : existing.isActive,
      },
      include: storyInclude,
    });

    revalidateTag("stories", { expire: 0 });
    revalidatePath("/");

    return NextResponse.json(story);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update story status",
      },
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

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    await prisma.story.delete({ where: { id } });

    revalidateTag("stories", { expire: 0 });
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete story" },
      { status: 500 }
    );
  }
}
