import { ISkill } from "@/interface/ISkills";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale } from "next-intl";

const useSkills = () => {
  const locale = useLocale();
  const BLUR_FADE_DELAY = 0.04;

  const { data: getSkills } = useQuery({
    queryKey: ["getSkills"],
    queryFn: async () => {
      const res = await axios.get<ISkill[]>(`/api/${locale}/admin/skill`);
      return res.data;
    },
  });
  return { getSkills, locale, BLUR_FADE_DELAY };
};

export default useSkills;
