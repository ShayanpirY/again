import HeroBanners from '@/components/home/HeroBanners';
import { StoriesBar } from '@/components/home/StoriesBar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* استوری‌های فعال زیر هدر */}
      <StoriesBar />

      {/* بنرهای جدید شبیه سایت Mayoral */}
      <HeroBanners />
      
      {/* بقیه سکشن‌های صفحه اصلی در آینده اینجا قرار می‌گیرند */}
    </main>
  );
}
