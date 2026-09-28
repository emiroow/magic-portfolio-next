import { projectModel } from '@/models/project';

/** Demo projects for both locales. Images stay empty until you upload your own. */
export const seedProductData = async () => {
  const projectData = [
    {
      title: 'DevBoard',
      href: 'https://example.com/devboard',
      dates: 'January 2024 - May 2024',
      active: true,
      description: 'A self-hosted kanban board for developer teams with realtime collaboration and keyboard-first UX.',
      technologies: ['Next.js', 'TypeScript', 'MongoDB', 'WebSockets'],
      links: [
        { type: 'Demo', href: 'https://example.com/devboard', icon: 'demo' },
        { type: 'Source', href: 'https://github.com/example/devboard', icon: 'github' },
      ],
      image: '',
      lang: 'en',
    },
    {
      title: 'Persian Date Kit',
      href: 'https://example.com/persian-date-kit',
      dates: 'June 2023 - September 2023',
      active: true,
      description: 'A zero-dependency Jalaali date utility library with full Intl-based formatting and RTL-safe React components.',
      technologies: ['TypeScript', 'React', 'Intl API'],
      links: [{ type: 'Source', href: 'https://github.com/example/persian-date-kit', icon: 'github' }],
      image: '',
      lang: 'en',
    },
    {
      title: 'دِو‌بورد',
      href: 'https://example.com/devboard',
      dates: '1402/10 - 1403/02',
      active: true,
      description: 'بورد کانبن خودمیزبان برای تیم‌های توسعه با همکاری بلادرنگ و رابط کاربری مبتنی بر صفحه‌کلید.',
      technologies: ['Next.js', 'TypeScript', 'MongoDB', 'WebSockets'],
      links: [
        { type: 'دمو', href: 'https://example.com/devboard', icon: 'demo' },
        { type: 'سورس', href: 'https://github.com/example/devboard', icon: 'github' },
      ],
      image: '',
      lang: 'fa',
    },
    {
      title: 'کیت تاریخ جلالی',
      href: 'https://example.com/persian-date-kit',
      dates: '1402/03 - 1402/07',
      active: true,
      description: 'یک کتابخانه ابزار تاریخ جلالی بدون وابستگی، با قالب‌سازی کامل بر پایه Intl و کامپوننت‌های React سازگار با RTL.',
      technologies: ['TypeScript', 'React', 'Intl API'],
      links: [{ type: 'سورس', href: 'https://github.com/example/persian-date-kit', icon: 'github' }],
      image: '',
      lang: 'fa',
    },
  ];

  await projectModel.create(projectData);
};
