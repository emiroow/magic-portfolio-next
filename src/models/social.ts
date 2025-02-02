import { ISocial } from "@/interface/ISocial";
import mongoose, { Schema } from "mongoose";

export const socialSchema = new Schema<ISocial>({
  name: { type: String },
  url: { type: String },
  icon: { type: String },
  lang: { type: String },
});

export const socialModel =
  mongoose.models.social || mongoose.model<ISocial>("social", socialSchema);
