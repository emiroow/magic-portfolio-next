import { profileModel } from "@/models/profile";

export const seedUserData = async () => {
  const profileData = [
    {
      name: "Amir",
      fullName: "Amir esmaeelzadeh",
      summary: "Summary of Amir esmaeelzadeh",
      description:
        "Web developer with 2 years of relevant work experience in the field of programming, adhering to the principles of web programming and Clean Code, as well as in UI design, website development and web applications.",
      avatarUrl: "",
      tel: "09142369599",
      email: "dillion@example.com",
      lang: "en",
    },
    {
      name: "امیر",
      fullName: "امیر اسماعیل زاده",
      summary: "خلاصه‌ای از دیلیون ورما",
      description:
        "توسعه دهنده وب با سابقه 4 سال کار مرتبط در زمینه برنامه نویسی، پایبند به اصول برنامه نوسی تحت وب و Clean Code و همچنین در طراحی UI ، توسعه وبسایت و وب اپلیکیشن‌ ها",
      avatarUrl: "",
      tel: "09142369599",
      email: "dillion@example.com",
      lang: "fa",
    },
  ];
  await profileModel.create(profileData);
};
