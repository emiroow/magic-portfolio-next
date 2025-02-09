import mongoose, { Schema } from "mongoose";

export const skill = new Schema<{ name: string }>({
  name: { type: String },
});

export const skillModel =
  mongoose.models.skill || mongoose.model<{ name: string }>("skill", skill);
