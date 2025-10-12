"use client";
import useSkills from "@/hooks/dashboard/useSkills";
import { useTranslations } from "next-intl";
import BlurFade from "../magicui/blur-fade";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Skills = () => {
  const t = useTranslations("dashboard.skill");
  const { getSkills, locale, BLUR_FADE_DELAY } = useSkills();

  return (
    <section>
      {/* Add Skill Form */}
      <div className="w-full flex gap-2">
        <Input type="text" />
        <Button
          // disabled={!isDirty || btnLoading}
          type="submit"
          variant="secondary"
          size="sm"
        ></Button>
      </div>
      {/* List */}
      <h3 className="font-bold text-2xl text-center my-5">{t("title")}</h3>
      <div className="flex flex-wrap justify-center gap-1">
        {getSkills?.map((skill, id) => (
          <BlurFade key={id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
            <Badge key={id}>{skill.name}</Badge>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default Skills;
