import { JsonLd } from "@/components/JsonLd";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import Navbar from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiEndPoint } from "@/constants/global";
import { IClientResponse } from "@/interface/IGlobal";
import axios from "axios";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

type Props = {
  params: { locale: string };
};

export const generateMetadata = async ({ params: { locale } }: Props) => {
  const { data } = await axios.get<IClientResponse>(`${apiEndPoint}/${locale}`);
  const t = await getTranslations();
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  return {
    metadataBase: site ? new URL(site) : undefined,
    title: {
      default: `${data.profile?.fullName} | ${t("personalWebsite")}`,
      template: `%s | ${data.profile?.fullName} | ${t("personalWebsite")}`,
    },
    alternates: {
      canonical: site ? `${site}/${locale}` : undefined,
      languages: {
        fa: site ? `${site}/fa` : undefined,
        en: site ? `${site}/en` : undefined,
        "x-default": site ? `${site}/${locale}` : undefined,
      },
    },
    description: data.profile?.description,
    openGraph: {
      title: `${data.profile?.name}`,
      description: data.profile?.description,
      url: site ? `${site}/${locale}` : undefined,
      siteName: `${data.profile?.fullName}`,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
    appLinks: {
      web: {
        url: site ? `${site}/${locale}` : undefined,
        should_fallback: true,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // icons: {
    //   icon: [
    //     { url: "/icon.png" },
    //     new URL("/icon.png", "https://example.com"),
    //     { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    //   ],
    //   shortcut: ["/shortcut-icon.png"],
    //   apple: [
    //     { url: "/apple-icon.png" },
    //     { url: "/apple-icon-x3.png", sizes: "180x180", type: "image/png" },
    //   ],
    //   other: [
    //     {
    //       rel: "apple-touch-icon-precomposed",
    //       url: "/apple-touch-icon-precomposed.png",
    //     },
    //   ],
    // },
    twitter: {
      title: `${data.profile?.name}`,
      card: "summary_large_image",
    },
    verification: {
      google: "google",
      yandex: "yandex",
      yahoo: "yahoo",
      other: {
        me: [data.profile?.email],
      },
    },
  } as Metadata;
};

// Avoid build-time data fetching for this route
export const dynamic = "force-dynamic";

export default async function Page({ params: { locale } }: Props) {
  const t = await getTranslations();
  const tHero = await getTranslations("hero");
  const tProject = await getTranslations("project");
  const tContact = await getTranslations("contact");
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  const { data } = await axios.get<IClientResponse>(`${apiEndPoint}/${locale}`);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* Structured data for rich results */}
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: data.profile?.fullName ?? data.profile?.name,
          image: data.profile?.avatarUrl,
          email: data.profile?.email,
          description: data.profile?.description,
          sameAs: data.socials?.map((s) => s.url).filter(Boolean),
        }}
      />

      {/* Breadcrumb structured data */}
      <JsonLd
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: site ? `${site}/${locale}` : `/${locale}`,
            },
          ],
        }}
      />

      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-3 flex justify-between max-md:items-center">
            <div className="flex-col flex flex-1 space-y-1.5">
              {!!data.profile?.name && (
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none"
                  yOffset={20}
                  text={`${tHero("hi")} ${data.profile?.name} 👋`}
                />
              )}
              {!!data.profile?.summary && (
                <BlurFadeText
                  className="max-w-[600px] text-sm md:text-lg"
                  delay={BLUR_FADE_DELAY}
                  text={data.profile?.summary}
                />
              )}
            </div>
            {!!data.profile?.avatarUrl && (
              <BlurFade delay={BLUR_FADE_DELAY}>
                <Avatar className="size-32 border">
                  <AvatarImage
                    alt={data.profile?.name}
                    src={data.profile?.avatarUrl}
                  />
                </Avatar>
              </BlurFade>
            )}
          </div>
        </div>
      </section>
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">{t("about")}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown
            className="prose max-w-full text-pretty
           font-sans text-sm text-muted-foreground dark:prose-invert"
          >
            {data.profile?.description}
          </Markdown>
        </BlurFade>
      </section>
      <section id="work">
        {data.works?.length ? (
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">{t("experience")}</h2>
            </BlurFade>
            {data.works?.map((work, id) => (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 6 + id * 0.05}
              >
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        ) : null}
      </section>
      {/* educations */}
      {data.educations?.length ? (
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">{t("education")}</h2>
            </BlurFade>
            {data.educations?.map((education, id) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 8 + id * 0.05}
              >
                <ResumeCard
                  key={education.school}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                />
              </BlurFade>
            ))}
          </div>
          )
        </section>
      ) : null}
      <section id="skills">
        {data.skills?.length ? (
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-xl font-bold">{t("skills")}</h2>
            </BlurFade>
            <div className="flex flex-wrap gap-1">
              {data.skills?.map((skill, id) => (
                <BlurFade key={id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                  <Badge key={id}>{skill.name}</Badge>
                </BlurFade>
              ))}
            </div>
          </div>
        ) : null}
      </section>
      <section id="projects">
        {data.projects?.length ? (
          <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <div className="flex flex-col items-center justify-center space-y-5 text-center">
                <div className="space-y-5">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                    {tProject("myProjects")}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    {tProject("title")}
                  </h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {tProject("subTitle")}
                  </p>
                </div>
              </div>
            </BlurFade>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
              {data.projects?.map(
                (project, id) =>
                  project.active && (
                    <BlurFade
                      key={project.title}
                      delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                    >
                      <ProjectCard
                        href={project.href}
                        key={project.title}
                        title={project.title}
                        description={project.description}
                        dates={project.dates}
                        tags={project.technologies}
                        image={project.image}
                        links={project.links}
                      />
                    </BlurFade>
                  )
              )}
            </div>
          </div>
        ) : null}
      </section>
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full pb-16">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                {tContact("contact")}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {tContact("title")}
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {tContact("subTitle")}
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
      <Navbar socials={data.socials} />
    </main>
  );
}
