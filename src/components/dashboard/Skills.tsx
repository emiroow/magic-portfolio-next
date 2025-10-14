"use client";
import useSkills from "@/hooks/dashboard/useSkills";
import { useTranslations } from "next-intl";
import BlurFade from "../magicui/blur-fade";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";

const Skills = () => {
  const t = useTranslations("dashboard.skill");
  const {
    getSkills,
    locale,
    BLUR_FADE_DELAY,
    getSkillsIsLoading,
    formState: { dirtyFields, isDirty },
    register,
    setValue,
    handleSubmit,
    onSubmit,
    addSkillIsLoading,
    addSkillMutate,
    deleteSkillIsLoading,
    deleteSkillMutate,
  } = useSkills();

  return (
    <section>
      {/* Add Skill Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex gap-2 items-center mt-5"
      >
        <Input
          className="text-center"
          type="text"
          placeholder={t("inputPlaceholder")}
          {...register("name")}
          autoComplete="off"
        />
        <Button
          disabled={!isDirty || deleteSkillIsLoading || addSkillIsLoading}
          type="submit"
          variant="secondary"
          size="sm"
        >
          {addSkillIsLoading ? <Loading size="sm" /> : t("add")}
        </Button>
      </form>
      {/* List */}
      <h3 className="font-bold text-2xl mt-8 mb-5">{t("title")}</h3>
      {getSkillsIsLoading ? (
        <Loading size="lg" className="h-96" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {getSkills?.map((skill, id) => (
            <BlurFade key={id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
              <Badge
                onDelete={() => {
                  deleteSkillMutate({ id: skill._id });
                }}
                key={id}
              >
                {skill.name}
              </Badge>
            </BlurFade>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;
