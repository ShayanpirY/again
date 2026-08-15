import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const metadata = {
  title: "حساب کاربری",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      firstName: true,
      lastName: true,
      displayName: true,
      role: true,
    },
  });

  const email = user?.email ?? session.user.email ?? "";

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.displayName ||
    user?.name ||
    email?.split("@")[0] ||
    "کاربر";

  return (
    <div className="min-h-[70vh] bg-[#faf9f7]" dir="rtl">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <AccountSidebar
          user={{
            id: user?.id ?? session.user.id,
            name: displayName,
            email,
            image: user?.image ?? session.user.image ?? null,
          }}
        >
          {children}
        </AccountSidebar>
      </div>
    </div>
  );
}
