import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel } from "@/lib/orderStatus";
import { WishlistCountCard } from "@/components/account/WishlistCountCard";
import { Package, Heart, UserRound, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "پیشخوان",
};

export default async function AccountDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, displayName: true, firstName: true, lastName: true },
      })
    : null;

  const orders = userId
    ? await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          items: { select: { id: true, name: true, quantity: true } },
        },
      })
    : [];

  const lastOrder = orders[0];
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.displayName ||
    user?.name ||
    session?.user?.email?.split("@")[0] ||
    "کاربر";
  const firstName = user?.firstName || fullName.split(" ")[0];

  const quickLinks = [
    { href: "/account/orders", label: "سفارش‌های من", icon: Package },
    { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
    { href: "/account/addresses", label: "مشخصات کاربر", icon: UserRound },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-black text-neutral-900">
          سلام {firstName}، خوش آمدید 👋
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          از اینجا می‌توانید سفارش‌ها، علاقه‌مندی‌ها، آدرس‌ها و اطلاعات حساب خود را مدیریت کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
          <p className="text-sm text-neutral-500">تعداد سفارش‌ها</p>
          <p className="mt-2 text-2xl font-black text-neutral-900">
            {orders.length.toLocaleString("fa-IR")}
          </p>
          <p className="mt-1 text-xs text-neutral-400">سفارش ثبت‌شده</p>
        </div>

        <WishlistCountCard />

        <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
          <p className="text-sm text-neutral-500">آخرین سفارش</p>
          {lastOrder ? (
            <>
              <p className="mt-2 text-2xl font-black text-neutral-900">
                {lastOrder.totalPrice.toLocaleString("fa-IR")}
                <span className="text-sm font-medium text-neutral-400"> تومان</span>
              </p>
              <span className="mt-2 inline-block rounded-full bg-[#d97757]/10 px-2.5 py-1 text-xs font-medium text-[#d97757]">
                {orderStatusLabel(lastOrder.status)}
              </span>
            </>
          ) : (
            <p className="mt-2 text-sm text-neutral-400">هنوز سفارشی ندارید</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between gap-3 rounded-2xl bg-white border border-neutral-200 px-5 py-4 shadow-sm transition-colors hover:border-[#d97757]/40 hover:bg-[#d97757]/5"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#d97757]/10 text-[#d97757]">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-bold text-neutral-900">{link.label}</span>
              </span>
              <ChevronLeft className="size-4 text-neutral-400 transition-transform group-hover:-translate-x-1" />
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">سفارش‌های اخیر</h2>
          <Link href="/account/orders" className="text-sm font-medium text-[#d97757] hover:underline">
            مشاهده همه
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-neutral-500">هنوز سفارشی ثبت نکرده‌اید.</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-full bg-[#d97757] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c86a4c]"
            >
              شروع خرید
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {order.items.map((item) => item.name).join("، ") || "سفارش"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {order.createdAt.toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-bold text-neutral-900">
                    {order.totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
