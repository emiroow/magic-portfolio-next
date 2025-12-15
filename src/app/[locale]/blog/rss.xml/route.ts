import { connectDB } from "@/config/dbConnection";
import { routing } from "@/i18n/routing";
import { blogModel } from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  await connectDB();

  const posts = await blogModel
    .find({ lang: locale })
    .sort({ createdAt: -1 })
    .lean();

  // تولید آیتم‌های RSS
  const feedItems = posts
    .map((p: any) => {
      const link = `${base}/${locale}/blog/${p.slug}`;
      const pub = new Date(p.createdAt || Date.now()).toUTCString();

      return `
        <item>
          <title>${escapeXml(p.title || "")}</title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <pubDate>${pub}</pubDate>
          ${
            p.summary
              ? `<description><![CDATA[${p.summary}]]></description>`
              : ""
          }
        </item>`;
    })
    .join("\n");

  // محتوای RSS نهایی
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${locale === "fa" ? "وبلاگ" : "Blog"}</title>
    <link>${base}/${locale}/blog</link>
    <description>${
      locale === "fa" ? "آخرین پست‌های وبلاگ" : "Latest blog posts"
    }</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
