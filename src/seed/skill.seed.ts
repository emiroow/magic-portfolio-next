import { skillModel } from "@/models/skill";

export const seedSkillsData = async () => {
  const data = [{ name: "Html" }, { name: "Css" }, { name: "JavaScript" }];
  await skillModel.create(data);
};
