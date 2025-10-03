"use client";
import useWorkExperience from "@/hooks/dashboard/useWorkExperience";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Fragment } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { Controller } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import DatePicker, { DateObject } from "react-multi-date-picker";
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import BlurFade from "../magicui/blur-fade";
import { ResumeCard } from "../resume-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const WorkExperience = () => {
  const {
    workExperienceData,
    isLoading,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    onsubmit,
    control,
    btnLoading,
    getValues,
    setValue,
    isEdit,
    setIsEdit,
    deleteWorkExperience,
    uploadWorkExperienceImage,
    fileInputRef,
    deleteUploadedWorkExperienceImage,
    expandedIndex,
    setExpandedIndex,
  } = useWorkExperience();

  const { id: IsEditItem, logoUrl, title } = getValues();
  const t = useTranslations("dashboard.workExperience");
  const tBase = useTranslations("");
  const { theme } = useTheme();
  const locale = useLocale();
  const BLUR_FADE_DELAY = 0.04;

  if (isLoading) return <Loading className="h-[50vh]" />;
  return (
    <section className="flex flex-col">
      <AnimatePresence mode="wait">
        {isEdit ? (
          // Edit & create
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: -15, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, scale: 0.97, filter: "blur(6px)" }}
            transition={{
              duration: 0.1,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
          >
            {/* create */}
            <div className="flex flex-row justify-between items-center ">
              <h3 className="text-xl font-bold mt-3">
                {IsEditItem ? t("editWork") : t("createWork")}
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      reset({
                        company: "",
                        description: "",
                        end: "",
                        href: "",
                        location: "",
                        logoUrl: "",
                        start: "",
                        title: "",
                      });
                      setIsEdit(false);
                    }}
                    variant={"secondary"}
                    size={"icon"}
                    className="size-8"
                  >
                    <IoMdClose className="text-red-700 text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("cancel")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* form */}
            <form
              onSubmit={handleSubmit(onsubmit)}
              onReset={() => {
                reset({
                  company: "",
                  description: "",
                  end: "",
                  href: "",
                  location: "",
                  logoUrl: "",
                  start: "",
                  title: "",
                });
              }}
              className="flex flex-col gap-1 mb-2 mt-3"
            >
              <div className="w-full flex flex-row items-center gap-3">
                <div className="relative w-32 h-32 border-2 mb-3 dark:border-white p-1 rounded-full overflow-hidden  flex items-center justify-center bg-background">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={title}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {t("noImage")}
                    </span>
                  )}
                </div>
                <div className="w-max flex items-center">
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => deleteUploadedWorkExperienceImage.mutate()}
                    >
                      <IoMdClose className="text-red-700 text-lg" />
                    </Button>
                  )}
                  {!logoUrl && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mb-1"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadWorkExperienceImage.isPending}
                      >
                        {t("uploadImage")}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("image", file);
                          uploadWorkExperienceImage.mutate(formData);
                        }}
                        disabled={uploadWorkExperienceImage.isPending}
                      />
                      <p className="text-red-600 text-xs mt-1">
                        {errors.logoUrl?.message}{" "}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Input
                type="text"
                className="text-sm"
                {...register("title")}
                placeholder={t("title")}
              />
              <p className="text-red-600 text-xs">{errors.title?.message}</p>

              <Input
                type="text"
                className="text-sm"
                {...register("company")}
                placeholder={t("company")}
              />
              <p className="text-red-600 text-xs">{errors.company?.message}</p>

              <Input
                type="text"
                className="text-sm"
                {...register("href")}
                placeholder={t("href")}
              />
              <p className="text-red-600 text-xs">{errors.href?.message}</p>

              <Input
                type="text"
                className="text-sm"
                {...register("location")}
                placeholder={t("location")}
              />
              <p className="text-red-600 text-xs">{errors.location?.message}</p>

              <Textarea
                className="text-sm"
                {...register("description")}
                placeholder={t("description")}
              />
              <p className="text-red-600 text-xs">
                {errors.description?.message}
              </p>

              {/* year Picker */}
              <div className="w-full flex flex-row gap-2">
                <div>
                  <Controller
                    control={control}
                    name="start"
                    render={({ field: { ref, value, onChange, ...field } }) => (
                      <DatePicker
                        {...field}
                        value={
                          value
                            ? new DateObject({
                                date: `${value}/01/01`,
                                calendar: locale === "fa" ? persian : gregorian,
                                locale:
                                  locale === "fa" ? persian_fa : gregorian_en,
                                format: "YYYY/MM/DD",
                              })
                            : ""
                        }
                        onChange={(dateObj) => {
                          onChange(dateObj ? String(dateObj.year) : "");
                        }}
                        onlyYearPicker
                        format="YYYY"
                        calendar={locale === "fa" ? persian : gregorian}
                        locale={locale === "fa" ? persian_fa : gregorian_en}
                        className={
                          theme === "dark"
                            ? "bg-dark text-white black"
                            : "bg-white"
                        }
                        render={(value, openCalendar) => (
                          <Input
                            type="text"
                            readOnly
                            value={value}
                            onClick={openCalendar}
                            className="w-full text-sm text-center"
                            placeholder={t("start")}
                          />
                        )}
                      />
                    )}
                  />
                  <p className="text-red-600 text-xs">
                    {errors.start?.message}
                  </p>
                </div>

                <div>
                  <Controller
                    control={control}
                    name="end"
                    render={({ field: { ref, value, onChange, ...field } }) => (
                      <DatePicker
                        {...field}
                        value={
                          value
                            ? new DateObject({
                                date: `${value}/01/01`,
                                calendar: locale === "fa" ? persian : gregorian,
                                locale:
                                  locale === "fa" ? persian_fa : gregorian_en,
                                format: "YYYY/MM/DD",
                              })
                            : ""
                        }
                        onChange={(dateObj) => {
                          onChange(dateObj ? String(dateObj.year) : "");
                        }}
                        onlyYearPicker
                        format="YYYY"
                        calendar={locale === "fa" ? persian : gregorian}
                        locale={locale === "fa" ? persian_fa : gregorian_en}
                        className={
                          theme === "dark"
                            ? "bg-dark text-white black"
                            : "bg-white"
                        }
                        render={(value, openCalendar) => (
                          <Input
                            type="text"
                            readOnly
                            value={value}
                            onClick={openCalendar}
                            className="w-full text-sm text-center"
                            placeholder={t("end")}
                          />
                        )}
                      />
                    )}
                  />
                  <p className="text-red-600 text-xs">{errors.end?.message}</p>
                </div>
              </div>

              <div className="flex gap-2 max-sm:flex-col mb-24">
                <Button
                  disabled={IsEditItem ? !isDirty || btnLoading : btnLoading}
                  type="submit"
                  variant="secondary"
                  size="sm"
                >
                  {btnLoading ? <Loading size="sm" /> : t("save")}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          // List
          <motion.div
            key="experience-list"
            initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            transition={{
              duration: 0.25,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="flex flex-col gap-5"
          >
            {/* Title & create btn */}
            <div className="flex flex-row justify-between items-center mb-3">
              <h3 className="text-xl font-bold mt-3">{t("experience")}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsEdit(true)}
                    variant={"secondary"}
                    size={"icon"}
                    className="size-8"
                  >
                    <GoPlus className="text-xl text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("createWork")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* List */}
            <Fragment>
              {workExperienceData?.length ? (
                workExperienceData?.map((item, index) => (
                  <BlurFade
                    key={index}
                    delay={BLUR_FADE_DELAY * 8 + (index + index++) * 0.05}
                  >
                    <ResumeCard
                      key={index}
                      logoUrl={item.logoUrl}
                      altText={item.company}
                      title={item.company}
                      subtitle={item.title}
                      href={item.href}
                      period={`${item.start} - ${item.end}`}
                      description={item.description}
                      isExpanded={expandedIndex === index}
                      onToggle={() => {
                        setExpandedIndex(
                          expandedIndex === index ? null : index
                        );
                      }}
                      onCancel={() => console.log("cancel")}
                      onEdit={() => {
                        setValue("id", item._id || "");
                        setValue("company", item.company || "");
                        setValue("description", item.description || "");
                        setValue("end", item.end || "");
                        setValue("href", item.href || "");
                        setValue("location", item.location || "");
                        setValue("start", item.start || "");
                        setValue("logoUrl", item.logoUrl || "");
                        setValue("title", item.title || "");
                        setIsEdit(true);
                      }}
                      onDelete={() => deleteWorkExperience(item._id)}
                    />
                  </BlurFade>
                ))
              ) : (
                // not found
                <BlurFade delay={BLUR_FADE_DELAY * 8}>
                  <div className="bg-muted/30 shadow-red-500 rounded-xl p-5 w-full flex justify-center items-center h-[50vh]">
                    {tBase("notFound")}
                  </div>
                </BlurFade>
              )}
            </Fragment>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkExperience;
