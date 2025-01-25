import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";

export const seedEducationData = async () => {
  await connectDB();

  // Seed education data
  const educationData = [
    {
      school: "Buildspace",
      href: "https://buildspace.so",
      degree: "s3, s4, sf1, s5",
      logoUrl: "/buildspace.jpg",
      start: "2023",
      end: "2024",
    },
  ];
  await educationModel.create(educationData);
};
