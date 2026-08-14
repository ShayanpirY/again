import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "حساب من",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user;
  const firstName = user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "کاربر";

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      items: { select: { id: true, name: true, quantity: true } },
    },
  });

  const statusLabels: Record<string, string> = {
    PENDING: "در انتظار بررسی",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    DELIVERED: "تحویل شده",
    CANCELLED: "لغو شده",
  };

  return (
    <div className="min-h-[70vh] px-4 py-10" style={{ background: "#faf9f7" }}>
      <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سلام {firstName} خوش آمدید</h1>
              <p className="mt-2 text-sm text-gray-500">
                از این صفحه می‌توانید اطلاعات حساب و سفارش‌های اخیر خود را ببینید.
              </p>
            </div>
            <span className="shrink-0 w-12 h-12 rounded-2xl bg-[#d97757]/10 text-[#d97757] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center gap-3">
            <span className="text-sm text-gray-500 shrink-0">ایمیل:</span>
            <span className="text-sm text-gray-800 font-medium" dir="ltr">
              {user.email}
            </span>
          </div>

          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#d97757] hover:bg-[#c96445] text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              ورود به پنل مدیریت
            </Link>
          )}
        </div>

        <div id="orders" className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">سفارش‌های اخیر</h2>

          {orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">هنوز سفارشی ثبت نکرده‌اید.</p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-xl border border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                شروع خرید
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.items.map((item) => item.name).join("، ") || "سفارش"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {order.createdAt.toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {order.totalPrice.toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
