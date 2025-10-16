"use client";
import useProfile from "@/hooks/dashboard/useProfile";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import ImageCropperDialog from "../ui/image-cropper";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";

const Profile = () => {
  const t = useTranslations("dashboard.profile");
  const tcrop = useTranslations("dashboard.crop");
  const locale = useLocale();
  const { theme } = useTheme();

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, defaultValues },
    btnLoading,
    pageLoading,
    onsubmit,
    reset,
    profile,
    uploadAvatar,
    profileImageShowImageFromUrlLoading,
    setProfileImageShowImageFromUrlLoading,
    refetchGetProfile,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  if (pageLoading) return <Loading className="h-[50vh]" />;
  return (
    <section>
      <form
        onSubmit={handleSubmit(onsubmit)}
        onReset={() => {
          reset();
          refetchGetProfile();
        }}
      >
        {/* inputs */}
        <div className="flex flex-col gap-1 mb-2 mt-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-full flex flex-row items-center gap-3">
              <div className="border-2 dark:border-white border-black rounded-full">
                {profile?.avatarUrl ? (
                  <>
                    {profileImageShowImageFromUrlLoading ||
                      (uploadAvatar.isPending && (
                        <Loading
                          className="absolute inset-0 flex items-center justify-center bg-background/75"
                          size="sm"
                        />
                      ))}
                    <Image
                      src={profile?.avatarUrl}
                      alt={profile?.fullName}
                      width={150}
                      height={150}
                      className="object-cover rounded-full"
                      onLoad={() => {
                        setProfileImageShowImageFromUrlLoading(false);
                      }}
                      onLoadStart={() => {
                        setProfileImageShowImageFromUrlLoading(false);
                      }}
                      onError={() => {
                        setProfileImageShowImageFromUrlLoading(true);
                      }}
                    />
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    {t("noImage")}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-col">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("profileImage")}
                </label>
                <span className="font-bold text-2xl">{profile?.fullName}</span>
                <div className="w-max">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mb-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatar.isPending}
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
                      const url = URL.createObjectURL(file);
                      setCropSrc(url);
                      setCropOpen(true);
                    }}
                    disabled={uploadAvatar.isPending}
                  />
                  <p className="text-red-600 text-xs mt-1">
                    {errors.avatarUrl?.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("uploadImage")}
                  </p>
                </div>
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
              cancel: t("cancelForm"),
              zoom: tcrop("zoom"),
              move: tcrop("move"),
            }}
            dir={locale === "fa" ? "rtl" : "ltr"}
            isDark={theme === "dark"}
            outputSize={512}
            onCropped={(file) => {
              const formData = new FormData();
              formData.append("image", file);
              uploadAvatar.mutate(formData);
            }}
          />
          <label
            htmlFor="profile-name"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("name")}
          </label>
          <Input
            id="profile-name"
            className="text-sm"
            type="text"
            {...register("name")}
            placeholder={t("name")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.name?.message}</p>

          <label
            htmlFor="profile-fullName"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("fullName")}
          </label>
          <Input
            id="profile-fullName"
            type="text"
            className="text-sm"
            {...register("fullName")}
            placeholder={t("fullName")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.fullName?.message}</p>

          <label
            htmlFor="profile-email"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("email")}
          </label>
          <Input
            id="profile-email"
            className="text-sm"
            type="email"
            {...register("email")}
            placeholder={t("email")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.email?.message}</p>

          <label
            htmlFor="profile-tel"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("phoneNumber")}
          </label>
          <Input
            id="profile-tel"
            className="text-sm"
            type="text"
            placeholder={t("phoneNumber")}
            {...register("tel")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.tel?.message}</p>
          <label
            htmlFor="profile-summary"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("summary")}
          </label>
          <Input
            id="profile-summary"
            type="text"
            className="text-sm"
            {...register("summary")}
            placeholder={t("summary")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.summary?.message}</p>

          <label
            htmlFor="profile-about"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("about")}
          </label>
          <Textarea
            id="profile-about"
            className="text-sm"
            {...register("description")}
            placeholder={t("about")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.description?.message}</p>
        </div>

        <div className="flex gap-2 max-sm:flex-col mt-4 mb-24">
          <Button
            disabled={!isDirty || btnLoading}
            type="submit"
            className="w-full sm:w-auto"
          >
            {btnLoading ? <Loading size="sm" /> : t("save")}
          </Button>

          <AnimatePresence>
            {isDirty && (
              <motion.div
                key="cancel-btn"
                layout
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <Button
                  type="reset"
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  {t("cancelForm")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </section>
  );
};

export default Profile;
