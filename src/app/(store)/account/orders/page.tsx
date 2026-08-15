import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel } from "@/lib/orderStatus";
import { Package } from "lucide-react";

export const metadata = {
  title: "سفارش‌ها",
};

export default async function OrdersPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session?.user?.id ?? "" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      totalPrice: true,
      discount: true,
      shippingCost: true,
      status: true,
      paymentStatus: true,
      trackingCode: true,
      address: true,
      createdAt: true,
      items: {
        select: { id: true, name: true, price: true, quantity: true, size: true, color: true, image: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-neutral-900">سفارش‌های من</h1>
            <p className="mt-1 text-sm text-neutral-500">
              وضعیت و جزئیات سفارش‌های خود را پیگیری کنید.
            </p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#d97757]/10 text-[#d97757]">
            <Package className="size-5" />
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-neutral-200 px-6 py-16 text-center shadow-sm">
          <p className="text-neutral-500">هنوز سفارشی ندارید.</p>
          <p className="mt-1 text-sm text-neutral-400">
            برای شروع خرید، محصولات مورد علاقه‌تان را ببینید.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-[#d97757] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c86a4c]"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const total = order.totalPrice + order.discount - order.shippingCost;
            return (
              <li
                key={order.id}
                className="rounded-2xl bg-white border border-neutral-200 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-neutral-400">
                      {order.createdAt.toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {order.trackingCode && (
                      <p className="text-xs text-neutral-400">
                        کد پیگیری: <span dir="ltr">{order.trackingCode}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        order.status === "CANCELLED"
                          ? "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                          : order.status === "DELIVERED"
                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-[#d97757]/10 px-3 py-1 text-xs font-medium text-[#d97757]"
                      }
                    >
                      {orderStatusLabel(order.status)}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <ul className="space-y-3">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-14 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-300">
                            <Package className="size-5" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {[item.size, item.color].filter(Boolean).join(" • ")}
                            {" - "}
                            <span>تعداد {item.quantity.toLocaleString("fa-IR")}</span>
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-neutral-900">
                          {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <p className="text-sm font-black text-neutral-900">
                      جمع کل: {total.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
