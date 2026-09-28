/**
 * Shared domain types for the whole application.
 * These mirror the Mongoose schemas in `src/models` and the public API payloads.
 */

/** Locales supported by the site. */
export type AppLocale = 'fa' | 'en';

/** External link attached to a project (demo, source, docs, ...). */
export interface IProjectLink {
  type: string;
  href: string;
  icon: string;
}

/** Site owner profile (one document per locale). */
export interface IProfile {
  _id?: string;
  name: string;
  fullName: string;
  jobTitle: string;
  description?: string;
  summary?: string;
  avatarUrl?: string;
  tel?: string;
  email?: string;
  lang: AppLocale;
}

/** Portfolio project shown on the home page. */
export interface IProject {
  _id?: string;
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: IProjectLink[];
  image: string;
  lang: AppLocale;
}

/** Skill badge. */
export interface ISkill {
  _id?: string;
  name: string;
  lang: AppLocale;
}

/** Social media profile. */
export interface ISocial {
  _id?: string;
  name: string;
  url: string;
  icon: string;
  lang: AppLocale;
}

/** Professional work experience entry. */
export interface IWork {
  _id?: string;
  company?: string;
  href?: string;
  location?: string;
  title?: string;
  logoUrl?: string;
  /** ISO date or `YYYY/MM` string. */
  start?: string;
  /** ISO date or `YYYY/MM` string; empty means "present". */
  end?: string;
  description?: string;
  lang: AppLocale;
}

/** Education entry. */
export interface IEducation {
  _id?: string;
  school?: string;
  href?: string;
  degree?: string;
  logoUrl?: string;
  /** ISO date or `YYYY/MM` string. */
  start?: string;
  /** ISO date or `YYYY/MM` string. */
  end?: string;
  lang: AppLocale;
}

/** Blog post stored in MongoDB; `content` is Markdown. */
export interface IBlog {
  _id?: string;
  title: string;
  summary?: string;
  content?: string;
  slug: string;
  lang: AppLocale;
  createdAt?: string;
  updatedAt?: string;
}

/** Aggregated payload consumed by the public site and `/api/[lang]`. */
export interface IPortfolioData {
  profile?: IProfile;
  educations: IEducation[];
  projects: IProject[];
  works: IWork[];
  socials: ISocial[];
  skills: ISkill[];
}
