import { connectDB } from "@/config/dbConnection";
import { routing } from "@/i18n/routing";
import { blogModel } from "@/models/blog";
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
      const url = `${base}/${locale}${path}`.replace(/\/$/, "");
      entries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            en: `${base}/en${path}`.replace(/\/$/, ""),
            fa: `${base}/fa${path}`.replace(/\/$/, ""),
            "x-default": `${base}/${routing.defaultLocale}${path}`.replace(
              /\/$/,
              ""
            ),
          },
        },
      });
    }
  }

  // Include blog posts for each locale from DB
  try {
    await connectDB();
    const slugs = await blogModel.find().select("slug").lean();
    const uniqueSlugs = Array.from(new Set(slugs.map((s: any) => s.slug)));
    for (const slug of uniqueSlugs) {
      for (const locale of routing.locales) {
        const path = `/blog/${slug}`;
        entries.push({
          url: `${base}/${locale}${path}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.5,
          alternates: {
            languages: {
              en: `${base}/en${path}`,
              fa: `${base}/fa${path}`,
              "x-default": `${base}/${routing.defaultLocale}${path}`,
            },
          },
        });
      }
    }
  } catch {}
  return entries;
}
