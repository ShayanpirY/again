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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Printer, RotateCcw } from "lucide-react";

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
  paymentStatus: string;
  returnStatus: string;
  returnReason?: string;
  totalPrice: number;
  discount: number;
  shippingCost: number;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
};

const ORDER_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار بررسی", className: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "در حال پردازش", className: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "ارسال شده", className: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "تحویل داده شده", className: "bg-green-100 text-green-800" },
  CANCELED: { label: "لغو شده", className: "bg-red-100 text-red-800" },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار پرداخت", className: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "پرداخت شده", className: "bg-green-100 text-green-800" },
  FAILED: { label: "پرداخت ناموفق", className: "bg-red-100 text-red-800" },
  REFUNDED: { label: "بازپرداخت شده", className: "bg-gray-100 text-gray-800" },
};

const RETURN_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NONE: { label: "بدون مرجوعی", className: "bg-gray-100 text-gray-800" },
  REQUESTED: { label: "درخواست مرجوعی", className: "bg-orange-100 text-orange-800" },
  APPROVED: { label: "تایید شده", className: "bg-blue-100 text-blue-800" },
  REJECTED: { label: "رد شده", className: "bg-red-100 text-red-800" },
  COMPLETED: { label: "تکمیل شده", className: "bg-green-100 text-green-800" },
};

const STATUS_TRANSLATIONS: Record<string, string> = {
  PENDING: "در انتظار بررسی",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل داده شده",
  CANCELED: "لغو شده",
  CANCELLED: "لغو شده",
  PAID: "پرداخت شده",
  FAILED: "پرداخت ناموفق",
  REFUNDED: "بازپرداخت شده",
  NONE: "بدون مرجوعی",
  REQUESTED: "درخواست مرجوعی",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  COMPLETED: "تکمیل شده",
};

const getStatusLabel = (status: string): string => {
  return STATUS_TRANSLATIONS[status?.toUpperCase()] || status || "نامشخص";
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [returnForm, setReturnForm] = useState({ status: "", reason: "" });

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

  const openPrint = () => {
    setIsDetailsOpen(false);
    setIsPrintOpen(true);
  };

  const openReturn = (order: Order) => {
    setSelectedOrder(order);
    setReturnForm({ status: order.returnStatus || "REQUESTED", reason: order.returnReason || "" });
    setIsReturnOpen(true);
  };

  const updateOrderStatus = async (orderId: string, field: string, value: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("خطا در به‌روزرسانی وضعیت سفارش.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnStatus: returnForm.status,
          returnReason: returnForm.reason,
        }),
      });

      if (!res.ok) throw new Error("Failed to update return status");

      setIsReturnOpen(false);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update return:", error);
      alert("خطا در به‌روزرسانی وضعیت مرجوعی.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price?: number | null): string => {
    if (price === undefined || price === null || isNaN(Number(price))) {
      return "۰";
    }
    return Number(price).toLocaleString("fa-IR");
  };

  const getFinalPrice = (order: Order) => {
    return order.totalPrice - order.discount + order.shippingCost;
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
              <TableHead className="text-right">کد سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">تماس</TableHead>
              <TableHead className="text-right">مبلغ کل</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-right">وضعیت سفارش</TableHead>
              <TableHead className="text-right">مرجوعی</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-neutral-600 py-8">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-neutral-600 py-8">
                  هیچ سفارشی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const paymentStatus = PAYMENT_STATUS_CONFIG[order.paymentStatus] || {
                  label: "نامشخص",
                  className: "bg-neutral-100 text-neutral-800",
                };
                const returnStatus = RETURN_STATUS_CONFIG[order.returnStatus] || {
                  label: "نامشخص",
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
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatus.className}`}>
                        {paymentStatus.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          value && updateOrderStatus(order.id, "status", value)
                        }
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue>
                            {getStatusLabel(order.status)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${returnStatus.className}`}>
                        {returnStatus.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                          onClick={() => openDetails(order)}
                          title="مشاهده"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                          onClick={() => openPrint()}
                          title="چاپ فاکتور"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-orange-600 hover:text-orange-700"
                          onClick={() => openReturn(order)}
                          title="مرجوعی"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[80vh] my-auto flex flex-col justify-between sm:max-w-[600px]" dir="rtl">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-neutral-900">
                  جزئیات سفارش #{selectedOrder?.id.slice(-8)}
                </DialogTitle>
                <DialogDescription className="text-neutral-600">
                  اطلاعات کامل سفارش و خریدار
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openPrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                پرینت فاکتور
              </Button>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="max-h-[55vh] overflow-y-auto p-6 pr-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">اطلاعات خریدار</Label>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">نام:</span>
                    <span className="text-sm font-medium text-neutral-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">شماره تماس:</span>
                    <span className="text-sm font-medium text-neutral-900">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">آدرس:</span>
                    <span className="text-sm font-medium text-neutral-900 text-left">{selectedOrder.address}</span>
                  </div>
                  {selectedOrder.trackingCode && (
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">کد رهگیری:</span>
                      <span className="text-sm font-medium text-neutral-900">{selectedOrder.trackingCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-900">وضعیت سفارش</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => value && updateOrderStatus(selectedOrder.id, "status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {getStatusLabel(selectedOrder.status)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-900">وضعیت پرداخت</Label>
                  <Select
                    value={selectedOrder.paymentStatus}
                    onValueChange={(value) => value && updateOrderStatus(selectedOrder.id, "paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {getStatusLabel(selectedOrder.paymentStatus)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">محصولات سفارش</Label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-neutral-50 rounded-lg p-3">
                      {item.image && (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.size && <span className="text-xs text-neutral-600">سایز: {item.size}</span>}
                          {item.size && item.color && <span className="text-xs text-neutral-400">|</span>}
                          {item.color && <span className="text-xs text-neutral-600">رنگ: {item.color}</span>}
                          <span className="text-xs text-neutral-400">|</span>
                          <span className="text-xs text-neutral-600">تعداد: {item.quantity}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-900 mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">جمع اقلام:</span>
                  <span className="text-neutral-900">{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">تخفیف:</span>
                  <span className="text-red-600">-{formatPrice(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">هزینه ارسال:</span>
                  <span className="text-neutral-900">{formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-neutral-900">مبلغ نهایی:</span>
                  <span className="text-lg font-bold text-neutral-900">{formatPrice(getFinalPrice(selectedOrder))}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Invoice Dialog */}
      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900">فاکتور خرید</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="p-4 space-y-4" id="invoice-print">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-neutral-900">کودک</h2>
                <p className="text-sm text-neutral-600">فروشگاه کودک</p>
                <p className="text-xs text-neutral-500 mt-1">فاکتور خرید #{selectedOrder.id.slice(-8)}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">تاریخ:</span>
                  <span className="text-neutral-900">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">نام خریدار:</span>
                  <span className="text-neutral-900">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">شماره تماس:</span>
                  <span className="text-neutral-900">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">آدرس:</span>
                  <span className="text-neutral-900 text-left">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">محصولات</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">
                          {item.size && `سایز: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `رنگ: ${item.color}`}
                          {" | "}
                          تعداد: {item.quantity}
                        </p>
                        <p className="text-xs text-neutral-500">قیمت واحد: {formatPrice(item.price)}</p>
                      </div>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">جمع اقلام:</span>
                  <span className="text-neutral-900">{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">تخفیف:</span>
                  <span className="text-red-600">-{formatPrice(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">هزینه ارسال:</span>
                  <span className="text-neutral-900">{formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-neutral-900">مبلغ نهایی:</span>
                  <span className="text-lg font-bold text-neutral-900">{formatPrice(getFinalPrice(selectedOrder))}</span>
                </div>
              </div>

              <div className="text-center text-xs text-neutral-500 pt-4 border-t">
                <p>با تشکر از خرید شما</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPrintOpen(false)}>
              بستن
            </Button>
            <Button onClick={() => window.print()} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Printer className="h-4 w-4 ml-2" />
              چاپ فاکتور
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Request Dialog */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900">درخواست مرجوعی</DialogTitle>
            <DialogDescription className="text-neutral-600">
              ثبت و مدیریت درخواست مرجوعی سفارش #{selectedOrder?.id.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReturnSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900">وضعیت مرجوعی</Label>
              <Select
                value={returnForm.status}
                onValueChange={(value) => value && setReturnForm({ ...returnForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RETURN_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900">دلیل مرجوعی</Label>
              <Input
                value={returnForm.reason}
                onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                placeholder="دلیل مرجوعی را وارد کنید"
                className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsReturnOpen(false)}>
                بستن
              </Button>
              <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800">
                ذخیره
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
