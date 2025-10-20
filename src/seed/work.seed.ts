import { workModel } from "@/models/work";

export const seedWorkData = async () => {
  // Seed work data
  const workData = [{}];
  await workModel.create(workData);
};
