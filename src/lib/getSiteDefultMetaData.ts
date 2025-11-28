import { site } from './seo';

type Locale = 'fa' | 'en';

export const getSiteMeta = (locale: Locale) => {
  const isFa = locale === 'fa';

  return {
    site: site,
    title: isFa ? process.env.NEXT_PUBLIC_SITE_TITLE_FA : process.env.NEXT_PUBLIC_SITE_TITLE_EN,

    description: isFa ? process.env.NEXT_PUBLIC_SITE_DESCRIPTION_FA : process.env.NEXT_PUBLIC_SITE_DESCRIPTION_EN,

    author: isFa ? process.env.NEXT_PUBLIC_AUTHOR_NAME_FA : process.env.NEXT_PUBLIC_AUTHOR_NAME_EN,

    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ''),
  };
};
