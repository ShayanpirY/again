"use client";

import { Package, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "کل محصولات",
    value: "۱۲۸",
    change: "+۱۲٪",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "سفارشات",
    value: "۴۵۶",
    change: "+۸٪",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "مجموع فروش",
    value: "۲۵۰,۰۰۰,۰۰۰",
    change: "+۱۵٪",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600",
    suffix: "تومان",
  },
];

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stat.value}
                {stat.suffix && <span className="text-sm font-normal text-neutral-500 mr-1">{stat.suffix}</span>}
              </p>
              <p className="text-xs text-green-600 mt-2 font-medium">{stat.change} نسبت به ماه قبل</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
