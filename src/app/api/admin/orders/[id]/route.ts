import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingCode } = body;

    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (status && ALLOWED_STATUSES.includes(status)) {
      updateData.status = status;
    }

    if (trackingCode !== undefined) {
      updateData.trackingCode = trackingCode || null;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
