import { workModel } from "@/models/work";

export const seedWorkData = async () => {
  // Seed work data
  const workData = [
    {
      company: "Atomic Finance",
      href: "https://atomic.finance",
      badges: [],
      location: "Remote",
      title: "Bitcoin Protocol Engineer",
      logoUrl: "/atomic.png",
      start: "May 2021",
      end: "Oct 2022",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
      lang: "en",
    },
    {
      company: "اتومیک فاینانس",
      href: "https://atomic.finance",
      badges: [],
      location: "دورکاری",
      title: "مهندس پروتکل بیت‌کوین",
      logoUrl: "/atomic.png",
      start: "مه 2021",
      end: "اکتبر 2022",
      description:
        "پیاده‌سازی مشخصات پروتکل قراردادهای گسسته بیت‌کوین (DLC) به عنوان یک SDK متن‌باز تایپ‌اسکریپت. داکرایز کردن تمام میکروسرویس‌ها و راه‌اندازی خوشه Kubernetes برای تولید. معماری یک دریاچه داده با استفاده از AWS S3 و Athena برای بازبینی تاریخی استراتژی‌های معاملاتی بیت‌کوین. ساخت اپلیکیشن موبایل با استفاده از React Native و تایپ‌اسکریپت.",
      lang: "fa",
    },
  ];
  await workModel.create(workData);
};
