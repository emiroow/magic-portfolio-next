import { skillModel } from "@/models/skill";

export const seedSkillsData = async () => {
  const data = [[]];
  await skillModel.create(data);
};
