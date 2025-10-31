import { connectDB } from "@/config/dbConnection";
import { routing } from "@/i18n/routing";
import { blogModel } from "@/models/blog";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: Request,
  { params }: { params: { locale: string } }
) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const locale = params.locale;
  if (!routing.locales.includes(locale as any)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  await connectDB();
  const posts = await blogModel
    .find({ lang: locale })
    .sort({ createdAt: -1 })
    .select("title summary slug createdAt")
    .lean();

  const feedItems = posts
    .map((p: any) => {
      const link = `${base}/${locale}/blog/${p.slug}`;
      const pub = new Date(p.createdAt || Date.now()).toUTCString();
      return `
        <item>
          <title>${escape(p.title || "")}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${pub}</pubDate>
          ${p.summary ? `<description>${escape(p.summary)}</description>` : ""}
        </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${locale === "fa" ? "وبلاگ" : "Blog"}</title>
      <link>${base}/${locale}/blog</link>
      <description>${
        locale === "fa" ? "آخرین پست‌های وبلاگ" : "Latest blog posts"
      }</description>
      <language>${locale}</language>
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
