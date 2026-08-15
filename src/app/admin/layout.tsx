import { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت | کودک",
    template: "%s | پنل مدیریت",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
