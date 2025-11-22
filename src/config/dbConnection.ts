import { SeedStatusModel } from '@/models/seedData';
import { seedData } from '@/seed/seedData';
import mongoose from 'mongoose';
const uri = process.env.DB_CONNECTION || 'mongodb://localhost:27017/Magic';

export let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(uri);
    if (conn.connection.readyState === 1) {
      isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // ---- AUTO SEED ----
      const seedFlag = await SeedStatusModel.find();
      console.warn(seedFlag);
      if (!seedFlag) {
        console.log('⏳ Seeding database for the first time...');

        await seedData();

        await SeedStatusModel.create({ seededStatus: true });

        console.log('🎉 Database has been seeded automatically.');
      } else {
        console.log('✔ Seed already completed, skipping.');
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};
