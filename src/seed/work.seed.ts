import { workModel } from "@/models/work";

export const seedWorkData = async () => {
  // Seed work data
  const workData = [
    {
      company: "Atomic Finance",
      href: "https://atomic.finance",
      location: "Remote",
      title: "Bitcoin Protocol Engineer",
      logoUrl:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      start: "2021",
      end: "2022",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
      lang: "en",
    },
    {
      company: "اتومیک فاینانس",
      href: "https://atomic.finance",
      location: "دورکاری",
      title: "مهندس پروتکل بیت‌کوین",
      logoUrl:
        "https://api.emiroow.ir/Files/Public/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_ae02ad62-41da-485d-8428-460bc1b95aa1.webp",
      start: "1402",
      end: "1403",
      description:
        "پیاده‌سازی مشخصات پروتکل قراردادهای گسسته بیت‌کوین (DLC) به عنوان یک SDK متن‌باز تایپ‌اسکریپت. داکرایز کردن تمام میکروسرویس‌ها و راه‌اندازی خوشه Kubernetes برای تولید. معماری یک دریاچه داده با استفاده از AWS S3 و Athena برای بازبینی تاریخی استراتژی‌های معاملاتی بیت‌کوین. ساخت اپلیکیشن موبایل با استفاده از React Native و تایپ‌اسکریپت.",
      lang: "fa",
    },
  ];
  await workModel.create(workData);
};
