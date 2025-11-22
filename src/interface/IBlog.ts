export interface IBlog {
  _id?: string;
  title: string;
  summary?: string;
  content?: string; // HTML or Markdown
  slug: string;
  lang: 'fa' | 'en';
  createdAt?: string;
  updatedAt?: string;
}
