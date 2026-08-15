import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { StoryItem } from "@/components/home/StoriesViewer";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i;

export async function getStories({
  active = true,
}: { active?: boolean } = {}): Promise<StoryItem[]> {
  const stories = await prisma.story.findMany({
    where: active ? { isActive: true, product: { isActive: true } } : {},
    select: {
      id: true,
      title: true,
      mediaUrl: true,
      badge: true,
      isActive: true,
      order: true,
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          images: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return stories.map((story) => ({
    id: story.id,
    title: story.title,
    mediaUrl: story.mediaUrl,
    type: VIDEO_EXT.test(story.mediaUrl) ? "video" : "image",
    thumbnail: story.product.images[0],
    badge: story.badge,
    isActive: story.isActive,
    order: story.order,
    productId: story.product.id,
    productTitle: story.product.title,
    productPrice: story.product.price,
  }));
}

export const getCachedActiveStories = unstable_cache(
  () => getStories({ active: true }),
  ["active-stories"],
  { revalidate: 60, tags: ["stories"] }
);
