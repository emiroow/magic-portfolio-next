import { userModel } from "@/models/user";

export const seedUserData = async () => {
  const userData = [
    {
      name: "Amir",
      fullName: "Amir esmaeelzadeh",
      initials: "DV",
      url: "https://dillion.io",
      location: "San Francisco, CA",
      locationLink: "https://www.google.com/maps/place/sanfrancisco",
      description:
        "Software Engineer turned Entrepreneur. I love building things and helping people. Very active on Twitter.",
      summary: "Summary of Dillion Verma",
      avatarUrl: "https://avatars.githubusercontent.com/u/86824829?v=4",
      tel: "123-456-7890",
      email: "dillion@example.com",
      lang: "en",
    },
    {
      name: "امیر",
      fullName: "امیر اسماعیل زاده",
      initials: "DV",
      url: "https://dillion.io",
      location: "سانفرانسیسکو، کالیفرنیا",
      locationLink: "https://www.google.com/maps/place/sanfrancisco",
      description:
        "مهندس نرم‌افزار که به کارآفرین تبدیل شده است. من عاشق ساختن چیزها و کمک به مردم هستم. بسیار فعال در توییتر.",
      summary: "خلاصه‌ای از دیلیون ورما",
      avatarUrl: "https://avatars.githubusercontent.com/u/86824829?v=4",
      tel: "123-456-7890",
      email: "dillion@example.com",
      lang: "fa",
    },
  ];
  await userModel.create(userData);
};
