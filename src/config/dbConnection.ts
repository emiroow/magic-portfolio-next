import { SeedStatusModel } from '@/models/seedData';
import { seedData } from '@/seed/seedData';
import mongoose from 'mongoose';

let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('❌ MONGODB_URI is missing!');

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;

  // --- AUTO SEED ONE TIME ---
  const seedFlag = await SeedStatusModel.findOne();

  if (!seedFlag) {
    console.log('⏳ Seeding database first time...');
    await seedData();
    await SeedStatusModel.create({ seededStatus: true });
    console.log('🎉 Seeding completed.');
  } else {
    console.log('✅ Database already have seed data.');
  }

  return cached.conn;
}
