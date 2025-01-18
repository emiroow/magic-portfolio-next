import { ISocial } from "@/interface/ISocial";
import { Schema } from "mongoose";

export const socialSchema = new Schema<ISocial>({
  name: { type: String },
  url: { type: String },
  icon: { type: String },
});
