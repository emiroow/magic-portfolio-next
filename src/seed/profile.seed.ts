import { profileModel } from '@/models/profile';

/** Demo owner profile for both locales. */
export const seedUserData = async () => {
  const profileData = [
    {
      name: 'Alex',
      fullName: 'Alex Carter',
      jobTitle: 'Full Stack Developer',
      summary: 'Full stack developer focused on React, Next.js and clean, accessible user interfaces.',
      description:
        'Web developer with years of experience building production applications. I care about clean code, thoughtful UX and shipping fast without cutting corners. Currently focused on React/Next.js ecosystems, TypeScript and design systems.',
      avatarUrl: '',
      tel: '',
      email: 'hello@example.com',
      lang: 'en',
    },
    {
      name: 'الکس',
      fullName: 'الکس کارتر',
      jobTitle: 'توسعه‌دهنده فول استک',
      summary: 'توسعه‌دهنده فول استک با تمرکز بر React، Next.js و رابط‌های کاربری تمیز و در دسترس.',
      description:
        'توسعه‌دهنده وب با چند سال تجربه ساخت اپلیکیشن‌های واقعی. کد تمیز، تجربه کاربری منطقی و انتشار سریع بدون کوتاه‌آمدن از کیفیت، اولویت‌های من است. در حال حاضر روی اکوسیستم React/Next.js، TypeScript و سیستم‌های طراحی تمرکز دارم.',
      avatarUrl: '',
      tel: '',
      email: 'hello@example.com',
      lang: 'fa',
    },
  ];

  await profileModel.create(profileData);
};
