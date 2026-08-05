"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, AlertTriangle, TrendingUp, Users, Package, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartData {
  date: string;
  sales: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
  images: string[];
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyProfit: number;
  profitChange: number;
  newCustomers: number;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار بررسی", className: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "در حال پردازش", className: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "ارسال شده", className: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "تحویل داده شده", className: "bg-green-100 text-green-800" },
  CANCELED: { label: "لغو شده", className: "bg-red-100 text-red-800" },
};

export default function AdminDashboardPage() {
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [salesRes, ordersRes, stockRes, statsRes] = await Promise.all([
          fetch("/api/admin/dashboard/sales-chart"),
          fetch("/api/admin/dashboard/recent-orders"),
          fetch("/api/admin/dashboard/low-stock"),
          fetch("/api/admin/dashboard/stats"),
        ]);

        const sales = await salesRes.json();
        const orders = await ordersRes.json();
        const stock = await stockRes.json();
        const dashboardStats = await statsRes.json();

        if (sales.chartData) setSalesData(sales.chartData);
        if (Array.isArray(orders)) setRecentOrders(orders);
        if (Array.isArray(stock)) setLowStockProducts(stock);
        if (dashboardStats) setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">داشبورد</h1>
        <p className="text-sm text-neutral-600 mt-1">خلاصه وضعیت فروشگاه</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">سود خالص این ماه</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatPrice(stats.monthlyProfit)}
                </p>
                <p className={`text-xs mt-2 font-medium ${stats.profitChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.profitChange >= 0 ? "+" : ""}{stats.profitChange}% نسبت به ماه قبل
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">تعداد مشتریان جدید</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.newCustomers}</p>
                <p className="text-xs text-neutral-500 mt-2">در ماه جاری</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">کل سفارشات</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders.toLocaleString("fa-IR")}</p>
                <p className="text-xs text-neutral-500 mt-2">تا کنون</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">کل محصولات</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalProducts.toLocaleString("fa-IR")}</p>
                <p className="text-xs text-neutral-500 mt-2">در فروشگاه</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">روند فروش ۷ روز اخیر</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `${((value as number) / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value) => formatPrice(value as number)}
                labelStyle={{ fontFamily: "var(--font-vazirmatn)" }}
                contentStyle={{ fontFamily: "var(--font-vazirmatn)", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Line type="monotone" dataKey="sales" stroke="#111827" strokeWidth={2} dot={{ fill: "#111827", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">آخرین سفارشات</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-neutral-600">در حال بارگذاری...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">مشتری</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-600 py-8">
                      هیچ سفارشی یافت نشد.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => {
                    const statusConfig = STATUS_CONFIG[order.status] || {
                      label: order.status,
                      className: "bg-neutral-100 text-neutral-800",
                    };
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-neutral-900">{order.customerName}</TableCell>
                        <TableCell className="text-neutral-700">{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            {statusConfig.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-neutral-600">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-neutral-900">هشدار انبار</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-neutral-600">در حال بارگذاری...</div>
          ) : lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-neutral-600">همه کالاها موجود هستند.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                    {product.images && product.images[0] && (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{product.title}</p>
                    <p className="text-xs text-neutral-500">موجودی: {product.stock} عدد</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    در شرف اتمام
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900">
              جزئیات سفارش #{selectedOrder?.id.slice(-8)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">نام مشتری:</span>
                  <span className="text-neutral-900">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">مبلغ کل:</span>
                  <span className="text-neutral-900 font-medium">{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">وضعیت:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedOrder.status]?.className || "bg-neutral-100 text-neutral-800"}`}>
                    {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">تاریخ:</span>
                  <span className="text-neutral-900">{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
