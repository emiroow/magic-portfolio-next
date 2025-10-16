import type { MetadataRoute } from "next";

// Generates robots.txt to guide search engine crawlers
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/fa", "/en"],
      disallow: ["/api", "/api/*", "/dashboard"],
    },
    sitemap: base ? [`${base}/sitemap.xml`] : undefined,
  };
}
