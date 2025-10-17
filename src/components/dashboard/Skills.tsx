"use client";
import useSkills from "@/hooks/dashboard/useSkills";
import { useTranslations } from "next-intl";
import { useState } from "react";
import BlurFade from "../magicui/blur-fade";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { Input } from "../ui/input";
import Loading from "../ui/loading";

const Skills = () => {
  const t = useTranslations("dashboard.skill");
  const tDash = useTranslations("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
        className="w-full mt-5 sm:flex sm:items-end sm:gap-2"
      >
        <div className="flex-1 space-y-1">
          <label
            htmlFor="skill-name"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("inputPlaceholder")}
          </label>
          <Input
            id="skill-name"
            className="text-center"
            type="text"
            placeholder={t("inputPlaceholder")}
            {...register("name")}
            autoComplete="off"
          />
        </div>
        <Button
          disabled={!isDirty || deleteSkillIsLoading || addSkillIsLoading}
          type="submit"
          className="w-full sm:w-auto mt-2 sm:mt-0"
        >
          {addSkillIsLoading ? <Loading size="sm" /> : t("add")}
        </Button>
      </form>
      {/* List */}
      <h3 className="font-bold text-2xl mt-8 mb-5">{t("title")}</h3>
      {getSkillsIsLoading ? (
        <Loading size="lg" className="h-96" />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {getSkills?.map((skill, id) => (
              <BlurFade key={id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge
                  onDelete={() => {
                    setSelectedId(skill._id);
                    setConfirmOpen(true);
                  }}
                  key={id}
                >
                  {skill.name}
                </Badge>
              </BlurFade>
            ))}
          </div>

          {(!getSkills || getSkills.length === 0) && (
            <div className="text-center py-8 mt-24">
              <p className="text-muted-foreground">{t("noSkills")}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  const el = document.getElementById("skill-name");
                  // @ts-ignore
                  el?.focus?.();
                }}
              >
                {t("createFirstSkill")}
              </Button>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={tDash("confirmTitle")}
        confirmText={tDash("delete")}
        cancelText={tDash("cancel")}
        danger
        dir={locale === "fa" ? "rtl" : "ltr"}
        locale={locale}
        itemName={getSkills?.find((s) => s._id === selectedId)?.name}
        onConfirm={() => {
          if (selectedId) deleteSkillMutate({ id: selectedId });
          setConfirmOpen(false);
          setSelectedId(null);
        }}
      />
    </section>
  );
};

export default Skills;
