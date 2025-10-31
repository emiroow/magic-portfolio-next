"use client";
import BlurFade from "@/components/magicui/blur-fade";
import { Input } from "@/components/ui/input";
import type { IBlog } from "@/interface/IBlog";
import { formatYearMonthLocal } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

const BLUR_FADE_DELAY = 0.04;

function readingTime(text: string | undefined) {
  if (!text) return "";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export default function BlogListClient({
  posts,
  locale,
}: {
  posts: IBlog[];
  locale: "fa" | "en" | string;
}) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const sorted = [...(posts || [])].sort((a, b) => {
      const at = new Date(a.createdAt || 0).getTime();
      const bt = new Date(b.createdAt || 0).getTime();
      return bt - at;
    });
    if (!q) return sorted;
    const needle = q.toLowerCase();
    return sorted.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(needle) ||
        (p.slug || "").toLowerCase().includes(needle)
    );
  }, [posts, q]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {locale === "fa" ? "تعداد" : "Total"}: {posts?.length || 0}
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            locale === "fa" ? "جستجو عنوان یا اسلاگ" : "Search title or slug"
          }
          className="h-9 w-48 sm:w-64"
        />
      </div>

      {list.map((post, id) => (
        <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
          <Link
            className="block border rounded p-4 hover:bg-muted/30 transition-colors"
            href={`/${locale}/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <p className="tracking-tight font-medium line-clamp-2">
                  {post.title}
                </p>
                {post.content && (
                  <span className="text-[11px] text-muted-foreground bg-muted/40 rounded px-1 py-0.5">
                    {locale === "fa" ? "زمان مطالعه:" : "Read:"}{" "}
                    {readingTime(post.content)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-between gap-2">
                <code className="text-[11px] break-all font-normal bg-muted/50 px-1 py-0.5 rounded">
                  {post.slug}
                </code>
                <span>
                  {formatYearMonthLocal(post.createdAt || "", locale as any)}
                </span>
              </div>
              {post.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.summary}
                </p>
              )}
            </div>
          </Link>
        </BlurFade>
      ))}

      {(!list || list.length === 0) && (
        <p className="text-sm text-muted-foreground">
          {locale === "fa" ? "پستی یافت نشد." : "No posts found."}
        </p>
      )}
    </div>
  );
}
