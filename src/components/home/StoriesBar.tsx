import { getCachedActiveStories } from "@/lib/stories";
import { StoriesBarContent } from "./StoriesBarContent";

export async function StoriesBar() {
  const stories = await getCachedActiveStories();

  if (!stories.length) return null;

  return <StoriesBarContent stories={stories} />;
}
