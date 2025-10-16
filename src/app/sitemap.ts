import { getBlogPosts } from "@/data/blog";
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

/**
 * Generate a simple sitemap for the static pages of the site for all locales.
 * Extend this to include dynamic routes (e.g., blogs/projects) if needed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return [];

  const now = new Date();
  const basePaths = ["/"]; // add more static pages if needed

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of basePaths) {
      entries.push({
        url: `${base}/${locale}${path}`.replace(/\/$/, ""),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Include blog posts for each locale
  try {
    const posts = await getBlogPosts();
    for (const post of posts) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${base}/${locale}/blog/${post.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch (e) {
    // no-op if content folder is missing in some environments
  }
  return entries;
}
