import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true },
    });

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
      },
      _sum: { totalPrice: true },
    });

    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);

    const previousMonthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _sum: { totalPrice: true },
    });

    const newCustomers = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
      },
      select: {
        customerPhone: true,
      },
      distinct: ["customerPhone"],
    });

    const profit = monthlyRevenue._sum.totalPrice || 0;
    const previousProfit = previousMonthRevenue._sum.totalPrice || 0;
    const profitChange = previousProfit > 0 ? Math.round(((profit - previousProfit) / previousProfit) * 100) : 0;

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      monthlyProfit: profit,
      profitChange,
      newCustomers: newCustomers.length,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
