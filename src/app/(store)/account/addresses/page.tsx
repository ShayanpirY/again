import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressManager } from "@/components/account/AddressManager";

export const metadata = {
  title: "مشخصات کاربر",
};

export default async function AddressesPage() {
  const session = await auth();

  const addresses = await prisma.address.findMany({
    where: { userId: session?.user?.id ?? "" },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <AddressManager
      initialAddresses={addresses.map((a) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        province: a.province,
        city: a.city,
        street: a.street,
        plaque: a.plaque ?? "",
        unit: a.unit ?? "",
        postalCode: a.postalCode,
        phone: a.phone,
        email: a.email ?? "",
        isDefault: a.isDefault,
      }))}
    />
  );
}
