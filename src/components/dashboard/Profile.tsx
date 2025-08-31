"use client";
import useProfile from "@/hooks/dashboard/useProfile";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";

const Profile = () => {
  const t = useTranslations("dashboard");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty, defaultValues },
    btnLoading,
    pageLoading,
    onsubmit,
    reset,
    resetField,
    profile,
    uploadAvatar,
    profileImageShowImageFromUrlLoading,
    setProfileImageShowImageFromUrlLoading,
    refetchGetProfile,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-full flex flex-row items-center gap-3">
              <div className="relative w-32 h-32 border-2 dark:border-white p-1 rounded-full overflow-hidden  flex items-center justify-center bg-background">
                {profile.avatarUrl ? (
                  <>
                    {profileImageShowImageFromUrlLoading ||
                      (uploadAvatar.isPending && (
                        <Loading
                          className="absolute inset-0 flex items-center justify-center bg-background/75"
                          size="sm"
                        />
                      ))}
                    <img
                      src={profile.avatarUrl}
                      alt="avatar"
                      className="object-cover w-full h-full rounded-full"
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
                    No Image
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-col">
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
                    {uploadAvatar.isPending ? (
                      <Loading size="sm" />
                    ) : (
                      t("uploadImage")
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
                      const formData = new FormData();
                      formData.append("image", file);
                      uploadAvatar.mutate(formData);
                    }}
                    disabled={uploadAvatar.isPending}
                  />
                  <p className="text-red-600 text-xs mt-1">
                    {errors.avatarUrl?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Input
            className="text-sm"
            type="text"
            {...register("name")}
            placeholder={t("name")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.name?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("fullName")}
            placeholder={t("fullName")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.fullName?.message}</p>

          <Input
            className="text-sm"
            type="email"
            {...register("email")}
            placeholder={t("email")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.email?.message}</p>

          <Input
            className="text-sm"
            type="text"
            placeholder={t("phoneNumber")}
            {...register("tel")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.tel?.message}</p>
          <Input
            type="text"
            className="text-sm"
            {...register("summary")}
            placeholder={t("summary")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.summary?.message}</p>

          <Textarea
            className="text-sm"
            {...register("description")}
            placeholder={t("about")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.description?.message}</p>
        </div>

        <div className="flex gap-2 max-sm:flex-col mb-24">
          <Button
            disabled={!isDirty || btnLoading}
            type="submit"
            variant="secondary"
            size="sm"
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
