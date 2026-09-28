import { IProject } from '@/types';
import mongoose, { Schema } from 'mongoose';

export const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    href: { type: String },
    dates: { type: String },
    active: { type: Boolean, default: true },
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
    lang: { type: String, required: true },
  },
  { timestamps: true }
);

export const projectModel = mongoose.models.project || mongoose.model<IProject>('project', projectSchema);
