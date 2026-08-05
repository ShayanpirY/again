import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(last7Days[0]),
        },
      },
      select: {
        createdAt: true,
        totalPrice: true,
        status: true,
      },
    });

    const chartData = last7Days.map((date) => {
      const dayOrders = orders.filter((o) => o.createdAt.toISOString().split("T")[0] === date);
      return {
        date: new Date(date).toLocaleDateString("fa-IR", { weekday: "short" }),
        sales: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        orders: dayOrders.length,
      };
    });

    const monthlyTotal = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const previousMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      select: { totalPrice: true },
    });
    const previousMonthTotal = previousMonthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return NextResponse.json({
      chartData,
      monthlyTotal,
      previousMonthTotal,
      change: previousMonthTotal > 0 ? Math.round(((monthlyTotal - previousMonthTotal) / previousMonthTotal) * 100) : 0,
    });
  } catch (error) {
    console.error("Failed to fetch sales chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales chart" },
      { status: 500 }
    );
  }
}
