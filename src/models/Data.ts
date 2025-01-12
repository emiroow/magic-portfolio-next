import { Schema, model, models } from "mongoose";

export interface IData {
  name: string;
  initials?: string;
  url?: string;
  location?: string;
  locationLink?: string;
  description?: string;
  summary?: string;
  avatarUrl?: string;
  skills: string[];
  navbar: { href: string; icon: string; label: string }[];
  contact: {
    email?: string;
    tel?: string;
    social: Record<
      "GitHub" | "LinkedIn" | "X" | "Youtube" | "email",
      {
        name?: string;
        url?: string;
        icon?: string;
        navbar?: boolean;
      }
    >;
  };
  work: {
    company: string;
    href?: string;
    badges: string[];
    location?: string;
    title?: string;
    logoUrl?: string;
    start?: string;
    end?: string;
    description?: string;
  }[];
  education: {
    school: string;
    href?: string;
    degree?: string;
    logoUrl?: string;
    start?: string;
    end?: string;
  }[];
  projects: {
    title: string;
    href?: string;
    dates?: string;
    active?: boolean;
    description?: string;
    technologies: string[];
    links: { type: string; href: string; icon: string }[];
    image?: string;
    video?: string;
  }[];
}

const dataSchema = new Schema<IData>({
  name: { type: String, required: true },
  initials: { type: String },
  url: { type: String },
  location: { type: String },
  locationLink: { type: String },
  description: { type: String },
  summary: { type: String },
  avatarUrl: { type: String },
  skills: [String],
  navbar: [
    {
      href: { type: String },
      icon: { type: String },
      label: { type: String },
    },
  ],
  contact: {
    email: { type: String },
    tel: { type: String },
    social: {
      GitHub: {
        name: { type: String },
        url: { type: String },
        icon: { type: String },
        navbar: { type: Boolean },
      },
      LinkedIn: {
        name: { type: String },
        url: { type: String },
        icon: { type: String },
        navbar: { type: Boolean },
      },
      X: {
        name: { type: String },
        url: { type: String },
        icon: { type: String },
        navbar: { type: Boolean },
      },
      Youtube: {
        name: { type: String },
        url: { type: String },
        icon: { type: String },
        navbar: { type: Boolean },
      },
      email: {
        name: { type: String },
        url: { type: String },
        icon: { type: String },
        navbar: { type: Boolean },
      },
    },
  },
  work: [
    {
      company: { type: String },
      href: { type: String },
      badges: [String],
      location: { type: String },
      title: { type: String },
      logoUrl: { type: String },
      start: { type: String },
      end: { type: String },
      description: { type: String },
    },
  ],
  education: [
    {
      school: { type: String },
      href: { type: String },
      degree: { type: String },
      logoUrl: { type: String },
      start: { type: String },
      end: { type: String },
    },
  ],
  projects: [
    {
      title: { type: String },
      href: { type: String },
      dates: { type: String },
      active: { type: Boolean },
      description: { type: String },
      technologies: [String],
      links: [
        {
          type: { type: String },
          href: { type: String },
          icon: { type: String },
        },
      ],
      image: { type: String },
      video: { type: String },
    },
  ],
});

export default models.Data || model<IData>("Data", dataSchema);
