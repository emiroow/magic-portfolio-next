import { blogModel } from '@/models/blog';

/** Two demo posts (English + Persian) with Markdown content. */
export const seedBlogData = async () => {
  const samples = [
    {
      title: 'Hello, World — Building This Portfolio',
      slug: 'hello-world',
      summary: 'How this portfolio was built with Next.js, MongoDB and a minimal monochrome design system.',
      tags: ['next.js', 'mongodb', 'design-system'],
      published: true,
      lang: 'en',
      content: [
        '## Why a minimal portfolio?',
        '',
        'A portfolio should sell the work, not the decoration. This site uses a strict black & white palette, one typeface per language and a handful of quiet animations.',
        '',
        '### The stack',
        '',
        '- **Next.js** App Router with React Server Components',
        '- **MongoDB + Mongoose** for content',
        '- **Tailwind CSS + shadcn/ui** for the design system',
        '- **next-intl** for English / Persian with full RTL support',
        '',
        '```ts',
        "const greet = (name: string) => `Hello, ${name}!`;",
        '```',
        '',
        'Manage everything from the built-in `/dashboard`.',
      ].join('\n'),
    },
    {
      title: 'سلام، دنیا — ساخت این نمونه‌کار',
      slug: 'hello-world',
      summary: 'این وب‌سایت با Next.js، MongoDB و یک سیستم‌طراحی مینیمال سیاه‌وسفید ساخته شده است.',
      tags: ['next.js', 'mongodb', 'design-system'],
      published: true,
      lang: 'fa',
      content: [
        '## چرا یک نمونه‌کار مینیمال؟',
        '',
        'وب‌سایت نمونه‌کار باید خودش را نشان ندهد، بلکه کار شما را نشان دهد. این سایت از پالت کاملاً سیاه‌وسفید، یک فونت برای هر زبان و انیمیشن‌های ملایم استفاده می‌کند.',
        '',
        '### پشته فناوری',
        '',
        '- **Next.js** App Router با React Server Components',
        '- **MongoDB + Mongoose** برای مدیریت محتوا',
        '- **Tailwind CSS + shadcn/ui** برای سیستم طراحی',
        '- **next-intl** برای دوزبانه‌سازی (فارسی/انگلیسی) با پشتیبانی کامل RTL',
        '',
        'همه‌چیز را می‌توانید از داشبورد `/dashboard` مدیریت کنید.',
      ].join('\n'),
    },
  ];

  await blogModel.insertMany(samples);
};
