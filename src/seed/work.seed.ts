import { workModel } from '@/models/work';

/** Demo work experience entries for both locales. */
export const seedWorkData = async () => {
  const workData = [
    {
      company: 'Acme Studio',
      title: 'Senior Frontend Developer',
      location: 'Tehran, Iran',
      href: 'https://example.com',
      logoUrl: '',
      start: '2023/01',
      end: '',
      description: 'Leading the frontend architecture of a SaaS analytics platform: design system, performance budgets and developer experience.',
      lang: 'en',
    },
    {
      company: 'Nimbus Labs',
      title: 'Full Stack Developer',
      location: 'Remote',
      href: 'https://example.com',
      logoUrl: '',
      start: '2021/03',
      end: '2022/12',
      description: 'Built and shipped customer-facing features with React, Node.js and MongoDB; migrated legacy pages to Next.js App Router.',
      lang: 'en',
    },
    {
      company: 'آکمی استودیو',
      title: 'توسعه‌دهنده ارشد فرانت‌اند',
      location: 'تهران، ایران',
      href: 'https://example.com',
      logoUrl: '',
      start: '1401/10',
      end: '',
      description: 'مسئول معماری فرانت‌اند یک پلتفرم تحلیلی SaaS: سیستم طراحی، بودجه عملکرد و تجربه توسعه‌دهنده.',
      lang: 'fa',
    },
    {
      company: 'نیمبس لبز',
      title: 'توسعه‌دهنده فول استک',
      location: 'دورکاری',
      href: 'https://example.com',
      logoUrl: '',
      start: '1400/01',
      end: '1401/09',
      description: 'ساخت و انتشار قابلیت‌های سمت کاربر با React، Node.js و MongoDB؛ مهاجرت صفحات قدیمی به Next.js App Router.',
      lang: 'fa',
    },
  ];

  await workModel.create(workData);
};
