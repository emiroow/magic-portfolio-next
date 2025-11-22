import { connectDB } from '@/config/dbConnection';
import { blogModel } from '@/models/blog';
import { educationModel } from '@/models/education';
import { profileModel } from '@/models/profile';
import { projectModel } from '@/models/project';
import { skillModel } from '@/models/skill';
import { socialModel } from '@/models/social';
import { workModel } from '@/models/work';
import mongoose from 'mongoose';
import { seedBlogData } from './blog.seed';
import { seedEducationData } from './education.seed';
import { seedUserData } from './profile.seed';
import { seedProductData } from './project.seed';
import { seedSkillsData } from './skill.seed';
import { seedSocialData } from './social.seed';
import { seedWorkData } from './work.seed';

const seedData = async () => {
  try {
    await connectDB();

    // drop data base
    if (process.env.FORCE_SEED === 'true') {
      await mongoose.connection.dropDatabase();
      console.log('Database dropped (FORCE_SEED)');
    }

    const counts = await Promise.all([
      educationModel.countDocuments(),
      projectModel.countDocuments(),
      socialModel.countDocuments(),
      profileModel.countDocuments(),
      workModel.countDocuments(),
      skillModel.countDocuments(),
      blogModel.countDocuments(),
    ]);

    if (counts.some(count => count > 0)) {
      console.log('Database is not empty. Skipping seeding.');
      return;
    }

    await Promise.all([seedEducationData(), seedProductData(), seedSocialData(), seedWorkData(), seedUserData(), seedSkillsData(), seedBlogData()]);

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run the script only when executed directly
seedData().then(() => process.exit());
