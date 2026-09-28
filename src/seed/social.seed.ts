import { socialModel } from '@/models/social';

/** Demo social links (replace the example URLs with your own). */
export const seedSocialData = async () => {
  const socialData = [
    { name: 'GitHub', url: 'https://github.com/example', icon: 'github', lang: 'en' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/example', icon: 'linkedin', lang: 'en' },
    { name: 'X', url: 'https://x.com/example', icon: 'x', lang: 'en' },
    { name: 'گیت‌هاب', url: 'https://github.com/example', icon: 'github', lang: 'fa' },
    { name: 'لینکدین', url: 'https://www.linkedin.com/in/example', icon: 'linkedin', lang: 'fa' },
    { name: 'ایکس', url: 'https://x.com/example', icon: 'x', lang: 'fa' },
  ];

  await socialModel.create(socialData);
};
