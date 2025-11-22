import mongoose, { Schema } from 'mongoose';

const seedStatusSchema = new Schema({
  seededStatus: { type: Boolean, default: false },
});

export const SeedStatusModel = mongoose.models.seedStatus || mongoose.model('seedStatus', seedStatusSchema);
