import { projectModel } from "@/models/project";

export const seedProductData = async () => {
  const projectData = [
    {
      title: "Chat Collect",
      href: "https://chatcollect.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "With the release of the OpenAI GPT Store, I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://chatcollect.com",
          icon: "globe",
        },
      ],
      image:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      video:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      lang: "en",
    },
    {
      title: "چت کالکت",
      href: "https://chatcollect.com",
      dates: "ژانویه 2024 - فوریه 2024",
      active: true,
      description:
        "با انتشار فروشگاه GPT اوپن‌ای‌آی، تصمیم گرفتم یک سرویس SaaS بسازم که به کاربران امکان می‌دهد آدرس‌های ایمیل کاربران GPT خود را جمع‌آوری کنند. این یک روش عالی برای ایجاد مخاطب و کسب درآمد از API GPT است.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "وب‌سایت",
          href: "https://chatcollect.com",
          icon: "globe",
        },
      ],
      image:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      video:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      lang: "fa",
    },
  ];
  await projectModel.create(projectData);
};
