import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
] as const;

const ALLOWED_PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

const ALLOWED_RETURN_STATUSES = [
  "NONE",
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingCode, paymentStatus, returnStatus, returnReason } = body;

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

    if (paymentStatus && ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus;
    }

    if (returnStatus && ALLOWED_RETURN_STATUSES.includes(returnStatus)) {
      updateData.returnStatus = returnStatus;
    }

    if (returnReason !== undefined) {
      updateData.returnReason = returnReason || null;
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
