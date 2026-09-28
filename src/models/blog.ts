import { IBlog } from '@/types';
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String, default: '' },
    slug: { type: String, required: true, index: true },
    lang: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const blogModel = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
