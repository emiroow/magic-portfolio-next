import { seedEducationData } from "./education.seed";
import { seedProductData } from "./project.seed";
import { seedSocialData } from "./social.seed";
import { seedUserData } from "./user.seed";
import { seedWorkData } from "./work.seed";

const seedData = async () => {
  await seedEducationData();
  await seedProductData();
  await seedSocialData();
  await seedWorkData();
  await seedUserData();
  console.log("Seed data inserted successfully");
  process.exit();
};

try {
  seedData().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
  });
} catch (error) {
  console.log(error);
}
