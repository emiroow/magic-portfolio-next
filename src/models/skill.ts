import { ISkill } from "@/interface/ISkills";
import mongoose, { Schema } from "mongoose";

export const skill = new Schema<ISkill>({
  name: { type: String },
  lang: { type: String },
});

export const skillModel =
  mongoose.models.skill || mongoose.model<ISkill>("skill", skill);
