import mongoose, { Schema } from 'mongoose';

const seedStatusSchema = new Schema({
  seededStatus: { type: Boolean, default: false },
});

export const SeedStatusModel = mongoose.models.SeedStatus || mongoose.model('seedStatus', seedStatusSchema);
