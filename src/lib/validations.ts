import { z } from 'zod';

/** Zod schemas shared by API handlers and dashboard forms. */

/** Locales accepted by the API (`/api/[lang]/...`). */
export const langSchema = z.enum(['fa', 'en']);

/** MongoDB object id. */
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

/** Optional string that also accepts empty values from forms. */
const optional = () => z.string().optional();
const optionalUrl = () => z.string().url().optional().or(z.literal(''));
const optionalEmail = () => z.string().email().optional().or(z.literal(''));

/** URL segment: Latin/Persian letters, digits and single dashes. */
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9\u0600-\u06FF]+(?:-[a-z0-9\u0600-\u06FF]+)*$/, 'Slug may contain letters, digits and dashes');

/** Tags/technologies: trimmed, de-duplicated, bounded. */
const tagList = () => z.array(z.string().trim().min(1).max(32)).max(12);

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  description: optional(),
  summary: optional(),
  avatarUrl: optionalUrl(),
  tel: optional(),
  email: optionalEmail(),
});

export const projectLinkSchema = z.object({
  type: z.string().min(1),
  href: z.string().url(),
  icon: z.string().min(1),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema.optional().or(z.literal('')),
  href: optionalUrl(),
  dates: optional(),
  active: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  details: optional(),
  technologies: tagList(),
  links: z.array(projectLinkSchema),
  image: optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const socialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string(),
});

export const workSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  href: optionalUrl(),
  location: optional(),
  title: optional(),
  logoUrl: optionalUrl(),
  start: optional(),
  end: optional(),
  description: optional(),
});

export const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  href: optionalUrl(),
  degree: optional(),
  logoUrl: optionalUrl(),
  start: optional(),
  end: optional(),
});

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema,
  summary: optional(),
  content: optional(),
  image: optionalUrl(),
  tags: tagList().optional(),
  published: z.boolean().optional(),
});

/** Wrap any create schema into an update schema keyed by `_id`. */
export function forUpdate<S extends z.ZodRawShape>(schema: z.ZodObject<S>) {
  return z.object({ _id: objectIdSchema }).merge(schema.partial());
}

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SocialInput = z.infer<typeof socialSchema>;
export type WorkInput = z.infer<typeof workSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
