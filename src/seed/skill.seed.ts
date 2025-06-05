import { skillModel } from "@/models/skill";

export const seedSkillsData = async () => {
  const data = [
    { name: "html", lang: "fa", test: "test" },
    { name: "Css", lang: "fa" },
    { name: "JavaScript", lang: "fa" },
    { name: "Html", lang: "en", test: "test" },
    { name: "Css", lang: "en" },
    { name: "JavaScript", lang: "en" },
  ];
  await skillModel.create(data);
};
