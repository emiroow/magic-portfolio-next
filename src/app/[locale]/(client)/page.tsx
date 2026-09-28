import { JsonLd } from '@/components/JsonLd';
import Navbar from '@/components/navbar';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Education } from '@/components/sections/education';
import { Experience } from '@/components/sections/experience';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { Skills } from '@/components/sections/skills';
import { getPortfolioData, getProfile } from '@/lib/data';
import { OG_IMAGE_URL, TWITTER_HANDLE, brandedTitle, languageAlternates, localeUrl, site } from '@/lib/seo';
import type { AppLocale } from '@/types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AlertTriangle } from 'lucide-react';

/** Revalidate the home page every hour; admin mutations revalidate sooner. */
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

function asLocale(locale: string): AppLocale {
  return locale === 'fa' ? 'fa' : 'en';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = asLocale(locale);
  const profile = await getProfile(lang);
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  const title = brandedTitle(profile, lang);
  const description = profile?.summary || profile?.description || t('description');
  const ogImage = profile?.avatarUrl?.startsWith('http') ? profile.avatarUrl : OG_IMAGE_URL;

  return {
    // Home shows the full brand as-is; the root template must not append to it.
    title: { absolute: title },
    description,
    keywords: [profile?.fullName || profile?.name, profile?.jobTitle, 'portfolio', 'developer', locale === 'fa' ? 'نمونه کار' : 'web developer'].filter(Boolean) as string[],
    alternates: {
      canonical: localeUrl(locale),
      languages: languageAlternates(''),
    },
    openGraph: {
      type: 'website',
      url: localeUrl(locale),
      title,
      description,
      siteName: title,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE || undefined,
      creator: TWITTER_HANDLE || undefined,
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const lang = asLocale(locale);

  const [t, tHero, tProject, tContact, data] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'project' }),
    getTranslations({ locale, namespace: 'contact' }),
    getPortfolioData(lang),
  ]);

  const { profile, projects, works, educations, skills, socials } = data;

  // First-run experience: no database (or no content) yet.
  if (!profile) {
    return (
      <main className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" aria-hidden />
        <h1 className="text-xl font-bold">{t('empty.title')}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{t('empty.description')}</p>
        <Navbar socials={[]} />
      </main>
    );
  }

  const jsonLdBase = site ?? '';

  return (
    <main className="flex min-h-[100dvh] flex-col gap-12 sm:gap-16">
      {/* Structured data: person + breadcrumbs for rich results */}
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.fullName || profile.name,
          url: localeUrl(locale),
          image: profile.avatarUrl || undefined,
          email: profile.email ? `mailto:${profile.email}` : undefined,
          jobTitle: profile.jobTitle || undefined,
          description: profile.summary || profile.description || undefined,
          sameAs: socials.map(s => s.url).filter(Boolean),
        }}
      />
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{ '@type': 'ListItem', position: 1, name: t('navbar.home'), item: `${jsonLdBase}/${locale}` }],
        }}
      />

      <Hero profile={profile} greeting={tHero('hi')} />
      <About title={t('about')} description={profile.description} delay={0.1} />
      <Experience title={t('experience')} works={works} locale={lang} presentLabel={t('present')} delay={0.15} />
      <Education title={t('education')} educations={educations} locale={lang} delay={0.2} />
      <Skills title={t('skills')} skills={skills} delay={0.25} />
      <Projects
        label={tProject('myProjects')}
        title={tProject('title')}
        description={tProject('subTitle')}
        projects={projects}
        delay={0.3}
      />
      <Contact
        title={tContact('title')}
        description={tContact('subTitle')}
        emailLabel={tContact('emailCta')}
        profile={profile}
        socials={socials}
        delay={0.35}
      />

      <Navbar socials={socials} />
    </main>
  );
}
