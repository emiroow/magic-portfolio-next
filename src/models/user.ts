import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  initials: { type: String },
  url: { type: String },
  location: { type: String },
  locationLink: { type: String },
  description: { type: String },
  summary: { type: String },
  avatarUrl: { type: String },
  tel: { type: String },
  email: { type: String },
  lang: { type: String },
});

export const userModel =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);
