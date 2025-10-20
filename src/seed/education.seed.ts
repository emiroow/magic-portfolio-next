import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";

export const seedEducationData = async () => {
  await connectDB();

  // Seed education data

  const educationDataEn = [{}];

  const educationDataFa = [{}];

  await educationModel.create(educationDataEn);
  await educationModel.create(educationDataFa);
};
