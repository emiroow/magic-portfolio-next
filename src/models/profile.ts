import mongoose, { Schema } from "mongoose";

export const profileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String },
  summary: { type: String },
  avatarUrl: { type: String },
  tel: { type: String },
  email: { type: String },
  lang: { type: String },
});

export const profileModel =
  mongoose.models.profile || mongoose.model<IProfile>("profile", profileSchema);
