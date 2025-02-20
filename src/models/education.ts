import { IEducation } from "@/interface/IEducation";
import mongoose, { Schema } from "mongoose";

export const educationSchema = new Schema<IEducation>({
  school: { type: String },
  href: { type: String },
  degree: { type: String },
  logoUrl: { type: String },
  start: { type: String },
  end: { type: String },
  lang: { type: String },
});

export const educationModel =
  mongoose.models.education ||
  mongoose.model<IEducation>("education", educationSchema);
