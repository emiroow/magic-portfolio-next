import { socialModel } from "@/models/social";

export const seedSocialData = async () => {
  const socialData = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/aemiroow",
      icon: "linkedin",
    },
    {
      name: "GitHub",
      url: "https://github.com/emiroow",
      icon: "github",
    },
    {
      name: "whatsapp",
      url: "",
      icon: "whatsapp",
    },
    {
      name: "youtube",
      url: "",
      icon: "youtube",
    },
    {
      name: "telegram",
      url: "",
      icon: "telegram",
    },
    {
      name: "instagram",
      url: "",
      icon: "instagram",
    },
  ];
  await socialModel.create(socialData);
};
