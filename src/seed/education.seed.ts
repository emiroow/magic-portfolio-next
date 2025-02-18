import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";

export const seedEducationData = async () => {
  await connectDB();

  // Seed education data

  const educationDataEn = [
    {
      school: "Buildspace",
      href: "https://buildspace.so",
      degree: "s3, s4, sf1, s5",
      logoUrl:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      start: "2023",
      end: "2024",
      lang: "en",
    },
  ];

  const educationDataFa = [
    {
      school: "بیلداسپیس",
      href: "https://buildspace.so",
      degree: "s3, s4, sf1, s5",
      logoUrl:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      start: "1402",
      end: "1403",
      lang: "fa",
    },
  ];

  await educationModel.create(educationDataEn);
  await educationModel.create(educationDataFa);
};
