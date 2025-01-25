import { userModel } from "@/models/user";

export const seedUserData = async () => {
  const userData = {
    name: "Dillion Verma",
    initials: "DV",
    url: "https://dillion.io",
    location: "San Francisco, CA",
    locationLink: "https://www.google.com/maps/place/sanfrancisco",
    description:
      "Software Engineer turned Entrepreneur. I love building things and helping people. Very active on Twitter.",
    summary: "Summary of Dillion Verma",
    avatarUrl: "https://example.com/avatar.jpg",
    tel: "123-456-7890",
    email: "dillion@example.com",
  };
  await userModel.create(userData);
};
