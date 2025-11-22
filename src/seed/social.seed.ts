import { socialModel } from '@/models/social';

export const seedSocialData = async () => {
  const socialData = [{}];
  await socialModel.create(socialData);
};
