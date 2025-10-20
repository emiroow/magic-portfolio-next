import { projectModel } from "@/models/project";

export const seedProductData = async () => {
  const projectData = [{}, {}];
  await projectModel.create(projectData);
};
