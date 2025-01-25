import { socialModel } from "@/models/social";

export const seedSocialData = async () => {
  const socialData = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/dillion",
      icon: "linkedin",
    },
    {
      name: "GitHub",
      url: "https://github.com/dillion",
      icon: "github",
    },
  ];
  await socialModel.create(socialData);
};
