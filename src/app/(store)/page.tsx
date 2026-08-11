import HeroBanners from '@/components/home/HeroBanners';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* بنرهای جدید شبیه سایت Mayoral */}
      <HeroBanners />
      
      {/* بقیه سکشن‌های صفحه اصلی در آینده اینجا قرار می‌گیرند */}
    </main>
  );
}
