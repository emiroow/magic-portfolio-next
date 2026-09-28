import { tryConnectDB } from '@/config/dbConnection';
import { blogModel } from '@/models/blog';
import { educationModel } from '@/models/education';
import { profileModel } from '@/models/profile';
import { projectModel } from '@/models/project';
import { skillModel } from '@/models/skill';
import { socialModel } from '@/models/social';
import { workModel } from '@/models/work';
import type { AppLocale, IBlog, IEducation, IProfile, IProject, ISkill, ISocial, IWork } from '@/types';

/** Server-side data access layer. DB-safe: returns empty results when unreachable. */

/** Convert BSON documents into plain JSON. */
function serialize<T>(doc: Record<string, unknown> | null): T | null {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc)) as T;
}

function serializeList<T>(docs: Record<string, unknown>[]): T[] {
  return docs.map(doc => serialize<T>(doc) as T);
}

/** Strip legacy `?cb=` cache-buster cruft from stored URLs. */
function cleanUrl(url?: string) {
  return url ? url.split('?')[0] : url;
}

/** Defensive cleanup for stored profile documents. */
function normalizeProfile(profile: IProfile | null): IProfile | null {
  if (!profile) return null;
  return { ...profile, avatarUrl: cleanUrl(profile.avatarUrl) };
}

/** Strip leading YAML front-matter (`--- ... ---`) from Markdown content. */
function stripFrontMatter(markdown?: string) {
  if (!markdown) return markdown;
  const text = markdown.replace(/^\uFEFF/, '');
  if (!text.startsWith('---')) return markdown;

  const lines = text.split(String.fromCharCode(10));
  const end = lines.findIndex((line, index) => index > 0 && /^(---|\.\.\.)\s*$/.test(line));
  if (end === -1) return markdown;

  return lines
    .slice(end + 1)
    .join(String.fromCharCode(10))
    .replace( /^\s+/, '');
}

export interface PortfolioData {
  profile: IProfile | null;
  projects: IProject[];
  works: IWork[];
  educations: IEducation[];
  skills: ISkill[];
  socials: ISocial[];
}

const EMPTY_PORTFOLIO: PortfolioData = {
  profile: null,
  projects: [],
  works: [],
  educations: [],
  skills: [],
  socials: [],
};

/** Load every public home-page section in one call (empty when DB unavailable). */
export async function getPortfolioData(locale: AppLocale): Promise<PortfolioData> {
  if (!(await tryConnectDB())) return EMPTY_PORTFOLIO;

  const [profile, projects, works, educations, skills, socials] = await Promise.all([
    profileModel.findOne({ lang: locale }).lean(),
    projectModel.find({ lang: locale }).sort({ createdAt: -1 }).lean(),
    workModel.find({ lang: locale }).sort({ start: -1 }).lean(),
    educationModel.find({ lang: locale }).sort({ start: -1 }).lean(),
    skillModel.find({ lang: locale }).sort({ name: 1 }).lean(),
    socialModel.find({ lang: locale }).lean(),
  ]);

  return {
    profile: normalizeProfile(serialize<IProfile>(profile as Record<string, unknown> | null)),
    projects: serializeList<IProject>(projects as Record<string, unknown>[]),
    works: serializeList<IWork>(works as Record<string, unknown>[]),
    educations: serializeList<IEducation>(educations as Record<string, unknown>[]),
    skills: serializeList<ISkill>(skills as Record<string, unknown>[]),
    socials: serializeList<ISocial>(socials as Record<string, unknown>[]),
  };
}

/** Public blog list (content stripped to keep the payload small). */
export async function getBlogList(locale: AppLocale): Promise<IBlog[]> {
  if (!(await tryConnectDB())) return [];

  const docs = await blogModel
    .find({ lang: locale })
    .select('-content')
    .sort({ createdAt: -1 })
    .lean();

  return serializeList<IBlog>(docs as Record<string, unknown>[]);
}

/** Single blog post with full content, or `null` when not found. */
export async function getBlogBySlug(locale: AppLocale, slug: string): Promise<IBlog | null> {
  if (!(await tryConnectDB())) return null;

  const doc = await blogModel.findOne({ lang: locale, slug }).lean();
  const post = serialize<IBlog>(doc as Record<string, unknown> | null);
  return post ? { ...post, content: stripFrontMatter(post.content) } : null;
}

/** Profile document only (used by metadata/OG generation). */
export async function getProfile(locale: AppLocale): Promise<IProfile | null> {
  if (!(await tryConnectDB())) return null;

  const doc = await profileModel.findOne({ lang: locale }).lean();
  return normalizeProfile(serialize<IProfile>(doc as Record<string, unknown> | null));
}

/** Social links (used by the floating dock on every public page). */
export async function getSocials(locale: AppLocale): Promise<ISocial[]> {
  if (!(await tryConnectDB())) return [];

  const docs = await socialModel.find({ lang: locale }).lean();
  return serializeList<ISocial>(docs as Record<string, unknown>[]);
}
