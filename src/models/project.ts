import mongoose, { Schema } from "mongoose";

export const project = new Schema<IProject>({
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
  lang: { type: String },
});

export const projectModel =
  mongoose.models.project || mongoose.model<IProject>("project", project);
