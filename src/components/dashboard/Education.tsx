"use client";
import useEducation from "@/hooks/dashboard/useEducation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { Controller } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import DatePicker, { DateObject } from "react-multi-date-picker";
import BlurFade from "../magicui/blur-fade";
import { ResumeCard } from "../resume-card";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import ImageCropperDialog from "../ui/image-cropper";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const EducationExperience = () => {
  const t = useTranslations("dashboard.education");
  const tcrop = useTranslations("dashboard.crop");
  const tDash = useTranslations("dashboard");
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tBase = useTranslations("");

  const {
    fileInputRef,
    getEducations,
    isEdit,
    isLoading,
    refetchGetEducations,
    setIsEdit,
    BLUR_FADE_DELAY,
    control,
    formState: { errors, isDirty },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    locale,
    theme,
    btnLoading,
    isPostingEducation,
    onsubmit,
    postEducation,
    deleteEducation,
    deleteUploadedEducationImage,
    isDeletingEducation,
    uploadEducationImage,
  } = useEducation();

  const { id: IsEditItem, logoUrl, school } = getValues();

  if (isLoading) return <Loading className="h-[50vh]" />;
  return (
    <section className="flex flex-col mb-20">
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
                {IsEditItem ? t("editTitle") : t("createEducation")}
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      reset({
                        degree: "",
                        end: "",
                        href: "",
                        id: "",
                        logoUrl: "",
                        school: "",
                        start: "",
                      });
                      setIsEdit(false);
                    }}
                    variant={"secondary"}
                    size={"icon"}
                    className="size-8"
                  >
                    {deleteUploadedEducationImage.isPending ? (
                      <Loading size="sm" />
                    ) : (
                      <IoMdClose className="text-red-700 text-lg" />
                    )}
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
                  degree: "",
                  end: "",
                  href: "",
                  id: "",
                  logoUrl: "",
                  school: "",
                  start: "",
                });
              }}
              className="flex flex-col gap-1 mb-2 mt-5"
            >
              {/* Image Upload Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("logoImage")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-full sm:w-auto">
                    <div className="w-full h-48 sm:w-32 sm:h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={school || "Education logo"}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-muted-foreground text-2xl mb-1">
                            📷
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {t("noImage")}
                          </span>
                        </div>
                      )}
                    </div>
                    {logoUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => deleteUploadedEducationImage.mutate()}
                        disabled={deleteUploadedEducationImage.isPending}
                      >
                        <IoMdClose className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {!logoUrl && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadEducationImage.isPending}
                          className="w-full sm:w-auto"
                        >
                          {uploadEducationImage.isPending ? (
                            <>
                              <Loading size="sm" className="mr-2" />
                              {t("uploading")}
                            </>
                          ) : (
                            <>📷 {t("uploadImage")}</>
                          )}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            setCropSrc(url);
                            setCropOpen(true);
                          }}
                          disabled={uploadEducationImage.isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                          {t("uploadImageHint")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cropper Dialog */}
              <ImageCropperDialog
                open={cropOpen}
                onOpenChange={(v) => {
                  setCropOpen(v);
                  if (!v && cropSrc) {
                    URL.revokeObjectURL(cropSrc);
                    setCropSrc(null);
                    if (fileInputRef.current) {
                      // @ts-ignore
                      fileInputRef.current.value = "";
                    }
                  }
                }}
                src={cropSrc}
                aspect={1}
                labels={{
                  title: tcrop("title"),
                  apply: tcrop("apply"),
                  cancel: t("cancel"),
                  zoom: tcrop("zoom"),
                  move: tcrop("move"),
                }}
                dir={locale === "fa" ? "rtl" : "ltr"}
                isDark={theme === "dark"}
                outputSize={512}
                onCropped={(file) => {
                  const formData = new FormData();
                  formData.append("image", file);
                  uploadEducationImage.mutate(formData);
                }}
              />

              <label
                htmlFor="education-school"
                className="text-sm font-medium text-muted-foreground"
              >
                {t("school")}
              </label>
              <Input
                id="education-school"
                type="text"
                className="text-sm"
                {...register("school")}
                placeholder={t("schoolPlaceholder")}
              />
              <p className="text-red-600 text-xs">{errors.school?.message}</p>

              <label
                htmlFor="education-href"
                className="text-sm font-medium text-muted-foreground"
              >
                {t("href")}
              </label>
              <Input
                id="education-href"
                type="text"
                className="text-sm"
                {...register("href")}
                placeholder={t("hrefPlaceholder")}
              />
              <p className="text-red-600 text-xs">{errors.href?.message}</p>

              <label
                htmlFor="education-degree"
                className="text-sm font-medium text-muted-foreground"
              >
                {t("degree")}
              </label>
              <Input
                id="education-degree"
                type="text"
                className="text-sm"
                {...register("degree")}
                placeholder={t("degreePlaceholder")}
              />
              <p className="text-red-600 text-xs">{errors.degree?.message}</p>

              {/* year Picker */}
              <div className="w-full flex flex-row gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="education-start"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {t("start")}
                  </label>
                  <Controller
                    control={control}
                    name="start"
                    render={({ field: { ref, value, onChange, ...field } }) => (
                      <DatePicker
                        id="education-start"
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

                <div className="flex-1">
                  <label
                    htmlFor="education-end"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {t("end")}
                  </label>
                  <Controller
                    control={control}
                    name="end"
                    render={({ field: { ref, value, onChange, ...field } }) => (
                      <DatePicker
                        id="education-end"
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

              <div className="flex gap-2 max-sm:flex-col mt-4 mb-24">
                <Button
                  disabled={IsEditItem ? !isDirty || btnLoading : btnLoading}
                  type="submit"
                  className="w-full sm:w-auto"
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
              <h3 className="text-xl font-bold mt-3">{t("title")}</h3>
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
                  <p>{t("createEducation")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* List */}
            <Fragment>
              {getEducations?.length ? (
                getEducations?.map((item, index) => (
                  <BlurFade
                    key={index}
                    delay={BLUR_FADE_DELAY * 8 + (index + index++) * 0.05}
                  >
                    {/* Confirm Delete Dialog per-item */}
                    {/* Using local state per item key is heavier; instead open with selected id */}
                    <ResumeCard
                      key={item.school}
                      href={item.href}
                      logoUrl={item.logoUrl}
                      altText={item.school}
                      title={item.school}
                      subtitle={item.degree}
                      period={`${item.start} - ${item.end}`}
                      onEdit={() => {
                        setValue("id", item._id || "");
                        setValue("degree", item.degree || "");
                        setValue("end", item.end || "");
                        setValue("start", item.start || "");
                        setValue("href", item.href || "");
                        setValue("logoUrl", item.logoUrl || "");
                        setValue("school", item.school || "");
                        setIsEdit(true);
                      }}
                      onDelete={() => {
                        setSelectedId(item._id);
                        setConfirmOpen(true);
                      }}
                    />
                  </BlurFade>
                ))
              ) : (
                // empty state
                <div className="text-center py-8 mt-24">
                  <p className="text-muted-foreground">{t("noEducations")}</p>
                  <Button
                    onClick={() => setIsEdit(true)}
                    variant="outline"
                    className="mt-2"
                  >
                    {t("createFirstEducation")}
                  </Button>
                </div>
              )}
            </Fragment>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title={tDash("confirmTitle")}
              confirmText={tDash("delete")}
              cancelText={t("cancel")}
              danger
              dir={locale === "fa" ? "rtl" : "ltr"}
              locale={locale}
              itemName={
                getEducations?.find((e) => e._id === selectedId)?.school
              }
              onConfirm={() => {
                if (selectedId) deleteEducation(selectedId);
                setConfirmOpen(false);
                setSelectedId(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EducationExperience;
