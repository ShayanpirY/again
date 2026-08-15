import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/modules/CartDrawer";
import { getCachedSiteSettings } from "@/lib/site-settings";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSiteSettings();
  return (
    <div className="min-h-full flex flex-col">
      <Header promoText={settings.promoText} />
      <main className="flex-1">{children}</main>
      <Footer supportPhone={settings.supportPhone} instagramUrl={settings.instagramUrl} />
      <CartDrawer />
    </div>
  );
}
