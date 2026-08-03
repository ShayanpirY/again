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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: string;
  totalPrice: number;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "در انتظار بررسی",
    className: "bg-yellow-100 text-yellow-800",
  },
  PROCESSING: {
    label: "در حال پردازش",
    className: "bg-blue-100 text-blue-800",
  },
  SHIPPED: {
    label: "ارسال شده",
    className: "bg-purple-100 text-purple-800",
  },
  DELIVERED: {
    label: "تحویل داده شده",
    className: "bg-green-100 text-green-800",
  },
  CANCELED: {
    label: "لغو شده",
    className: "bg-red-100 text-red-800",
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchOrders();
    };

    load();
    return () => {};
  }, []);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("خطا در به‌روزرسانی وضعیت سفارش.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">سفارشات</h1>
        <p className="text-sm text-neutral-600 mt-1">مدیریت سفارشات فروشگاه</p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">شماره سفارش</TableHead>
              <TableHead className="text-right">نام خریدار</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-right">مبلغ کل</TableHead>
              <TableHead className="text-right">تاریخ ثبت</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-600 py-8">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-600 py-8">
                  هیچ سفارشی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || {
                  label: order.status,
                  className: "bg-neutral-100 text-neutral-800",
                };

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-neutral-900">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-neutral-700">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-neutral-700">
                      {order.customerPhone}
                    </TableCell>
                    <TableCell className="text-neutral-700">
                      {formatPrice(order.totalPrice)}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                          onClick={() => openDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            value && updateOrderStatus(order.id, value)
                          }
                          disabled={updatingStatus === order.id}
                        >
                          <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue placeholder="تغییر وضعیت" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_CONFIG).map(
                              ([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  {config.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[80vh] my-auto flex flex-col justify-between sm:max-w-[600px]" dir="rtl">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              جزئیات سفارش #{selectedOrder?.id.slice(-8)}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              اطلاعات کامل سفارش و خریدار
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="max-h-[55vh] overflow-y-auto p-6 pr-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">
                  اطلاعات خریدار
                </Label>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">نام:</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">شماره تماس:</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {selectedOrder.customerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">آدرس:</span>
                    <span className="text-sm font-medium text-neutral-900 text-left">
                      {selectedOrder.address}
                    </span>
                  </div>
                  {selectedOrder.trackingCode && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">
                        کد رهگیری:
                      </span>
                      <span className="text-sm font-medium text-neutral-900">
                        {selectedOrder.trackingCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">
                  وضعیت سفارش
                </Label>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_CONFIG[selectedOrder.status]?.className ||
                      "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {STATUS_CONFIG[selectedOrder.status]?.label ||
                      selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">
                  محصولات سفارش
                </Label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-neutral-50 rounded-lg p-3"
                    >
                      {item.image && (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.size && (
                            <span className="text-xs text-neutral-600">
                              سایز: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-neutral-600">
                              رنگ: {item.color}
                            </span>
                          )}
                          <span className="text-xs text-neutral-600">
                            تعداد: {item.quantity}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm font-medium text-neutral-900">
                  مبلغ کل سفارش:
                </span>
                <span className="text-lg font-bold text-neutral-900">
                  {formatPrice(selectedOrder.totalPrice)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
