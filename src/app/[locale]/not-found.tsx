import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Button } from "@/components/ui/button";
import { getPathname } from "@/i18n/routing";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("NotFoundPage");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: getPathname({ href: "/404", locale }),
    },
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: getPathname({ href: "/404", locale }),
      languages: {
        fa: getPathname({ href: "/404", locale: "fa" }),
        en: getPathname({ href: "/404", locale: "en" }),
        "x-default": getPathname({ href: "/404", locale }),
      },
    },
  } as Metadata;
}

export default async function NotFoundPage() {
  const t = await getTranslations("NotFoundPage");
  const locale = await getLocale();
  const BLUR_FADE_DELAY = 0.04;

  return (
    <main className="fixed inset-0 flex items-center justify-center px-4 text-center min-h-screen">
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 Badge */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="relative inline-flex items-center justify-center mb-4">
            <span className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl animate-pulse" />
            <span className="relative inline-flex h-32 w-32 items-center justify-center rounded-3xl border-2 bg-background/80 backdrop-blur-sm text-6xl font-black shadow-2xl">
              404
            </span>
          </div>
        </BlurFade>

        {/* Title */}
        <BlurFadeText
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
          containerClassName="justify-center"
          text={t("title")}
          delay={BLUR_FADE_DELAY * 2}
          yOffset={20}
        />

        {/* Description */}
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed text-center">
            {t("description")}
          </p>
        </BlurFade>

        {/* Action Buttons */}
        <BlurFade delay={BLUR_FADE_DELAY * 6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="min-w-[140px]">
              <Link href={`/${locale}`}>{t("goHome")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[140px]"
            >
              <Link href={`/${locale}/blog`}>{t("browse")}</Link>
            </Button>
          </div>
        </BlurFade>

        {/* Decorative Elements */}
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <div className="w-full flex flex-col items-center justify-center pt-8">
            <div className="flex items-center justify-center gap-2 opacity-40">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-muted-foreground" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Page Not Found
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-muted-foreground" />
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}
