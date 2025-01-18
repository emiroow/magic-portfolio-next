import { Schema } from "mongoose";

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
});
