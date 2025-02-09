import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";
import { projectModel } from "@/models/project";
import { skillModel } from "@/models/skill";
import { socialModel } from "@/models/social";
import { userModel } from "@/models/user";
import { workModel } from "@/models/work";
import { seedEducationData } from "./education.seed";
import { seedProductData } from "./project.seed";
import { seedSkillsData } from "./skill.seed";
import { seedSocialData } from "./social.seed";
import { seedUserData } from "./user.seed";
import { seedWorkData } from "./work.seed";

const seedData = async () => {
  try {
    await connectDB();

    const counts = await Promise.all([
      educationModel.countDocuments(),
      projectModel.countDocuments(),
      socialModel.countDocuments(),
      userModel.countDocuments(),
      workModel.countDocuments(),
      skillModel.countDocuments(),
    ]);

    if (counts.some((count) => count > 0)) {
      console.log("Database is not empty. Skipping seeding.");
      return;
    }

    await Promise.all([
      seedEducationData(),
      seedProductData(),
      seedSocialData(),
      seedWorkData(),
      seedUserData(),
      seedSkillsData(),
    ]);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

// Run the script only when executed directly
seedData().then(() => process.exit());
