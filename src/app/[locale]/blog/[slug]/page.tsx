import type { IBlog } from "@/interface/IBlog";
import { formatYearMonthLocal } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Portfolio Owner";

import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

// Dynamic route; we fetch data at request time from API/DB

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata | undefined> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  const res = await fetch(`${base}/api/${params.locale}/blog/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return undefined;
  const post = (await res.json()) as IBlog;

  let { title, createdAt: publishedTime, summary: description } = post;
  let ogImage = `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        fa: `/fa/blog/${post.slug}`,
        "x-default": `/${routing.defaultLocale}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE_URL}/${params.locale}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Blog({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!routing.locales.includes(params.locale as any)) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  const res = await fetch(`${base}/api/${params.locale}/blog/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  const post = (await res.json()) as IBlog;
  // Fetch all posts in same locale to compute prev/next and related
  const allRes = await fetch(`${base}/api/${params.locale}/blog`, {
    cache: "no-store",
  });

  const all = (allRes.ok ? ((await allRes.json()) as IBlog[]) : []).sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
  );

  const index = all.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next =
    index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <section id="blog">
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          datePublished: post.createdAt,
          dateModified: post.updatedAt || post.createdAt,
          description: post.summary,
          image: `${SITE_URL}/og?title=${encodeURIComponent(post.title)}`,
          url: `${SITE_URL}/${params.locale}/blog/${post.slug}`,
          author: { "@type": "Person", name: AUTHOR_NAME },
        }}
      />
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: params.locale === "fa" ? "صفحه اصلی" : "Home",
              item: `${SITE_URL}/${params.locale}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: params.locale === "fa" ? "بلاگ" : "Blog",
              item: `${SITE_URL}/${params.locale}/blog`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: `${SITE_URL}/${params.locale}/blog/${post.slug}`,
            },
          ],
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter max-w-[650px]">
        {post.title}
      </h1>
      <div className="flex flex-col gap-1 mt-2 mb-4 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-neutral-600 dark:text-neutral-400">
            {formatYearMonthLocal(post.createdAt || "", params.locale as any)}
          </p>
        </Suspense>
      </div>

      <h2>{post.summary}</h2>
      <article className="prose dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ]}
        >
          {post.content || ""}
        </ReactMarkdown>
      </article>

      {(prev || next) && (
        <nav className="mt-10 flex items-center justify-between text-sm">
          {next ? (
            <Link
              href={`/${params.locale}/blog/${next.slug}`}
              className="hover:underline"
            >
              → {next.title}
            </Link>
          ) : (
            <span />
          )}
          {prev ? (
            <Link
              href={`/${params.locale}/blog/${prev.slug}`}
              className="hover:underline"
            >
              {prev.title} ←
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
