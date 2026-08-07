import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        questions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const reviewBuyers = await prisma.orderItem.findMany({
      where: { productId: id },
      select: { order: { select: { customerName: true } } },
    });
    const verifiedBuyerNames = new Set(
      reviewBuyers.map((oi) => oi.order.customerName.trim().toLowerCase())
    );

    const reviews = product.reviews.map((review) => ({
      ...review,
      isVerifiedBuyer: verifiedBuyerNames.has(review.authorName.trim().toLowerCase()),
    }));

    type RelatedCandidate = {
      id: string;
      title: string;
      price: number;
      images: string[];
      colors: string[];
      isSale: boolean;
      isNew: boolean;
      category: { name: string } | null;
    };

    const candidates: RelatedCandidate[] = [];
    const seen = new Set<string>([id]);

    const pushUnique = (items: RelatedCandidate[]) => {
      for (const p of items) {
        if (seen.has(p.id) || candidates.length >= 8) continue;
        seen.add(p.id);
        candidates.push(p);
      }
    };

    const mapCandidate = (p: {
      id: string;
      title: string;
      price: number;
      images: string[];
      colors: string[];
      isSale: boolean;
      isNew: boolean;
      category: { name: string } | null;
    }): RelatedCandidate => p;

    pushUnique(
      (
        await prisma.product.findMany({
          where: { isActive: true, categoryId: product.categoryId, id: { not: id } },
          include: { category: true },
          take: 8,
          orderBy: { createdAt: "desc" },
        })
      ).map(mapCandidate)
    );

    if (candidates.length < 8 && product.ageGroup) {
      pushUnique(
        (
          await prisma.product.findMany({
            where: {
              isActive: true,
              ageGroup: product.ageGroup,
              id: { notIn: [...seen] },
            },
            include: { category: true },
            take: 8 - candidates.length,
            orderBy: { createdAt: "desc" },
          })
        ).map(mapCandidate)
      );
    }

    if (candidates.length < 8) {
      pushUnique(
        (
          await prisma.product.findMany({
            where: {
              isActive: true,
              id: { notIn: [...seen] },
            },
            include: { category: true },
            take: 8 - candidates.length,
            orderBy: { createdAt: "desc" },
          })
        ).map(mapCandidate)
      );
    }

    return NextResponse.json({ product: { ...product, reviews }, relatedProducts: candidates });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
