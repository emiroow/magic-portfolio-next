import mongoose, { Schema } from "mongoose";

export const product = new Schema<IProduct>({
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

export const productModel =
  mongoose.models.product || mongoose.model<IProduct>("product", product);
