"use client";
import useProfile from "@/hooks/dashboard/useProfile";
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
    formState: { errors, isDirty },
    btnLoading,
    pageLoading,
    onsubmit,
    reset,
    profile,
    uploadAvatar,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (pageLoading) return <Loading className="h-[50vh]" />;
  return (
    <section>
      <form onSubmit={handleSubmit(onsubmit)} onReset={() => reset()}>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-32 h-32 border-2 border-white p-1 rounded-full overflow-hidden border-muted flex items-center justify-center bg-background">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="text-muted-foreground text-xs">No Image</span>
              )}
            </div>
            <div>
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

          <Input
            type="text"
            className="text-sm"
            {...register("avatarUrl")}
            placeholder="لینک عکس پروفایل"
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.avatarUrl?.message}</p>

          <Textarea
            className="text-sm"
            {...register("description")}
            placeholder={t("about")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.description?.message}</p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!isDirty || btnLoading}
            type="submit"
            className="flex gap-2 max-sm:w-full"
            variant="secondary"
            size="sm"
          >
            {btnLoading ? <Loading size="sm" /> : t("save")}
          </Button>
          {isDirty && (
            <Button
              type="reset"
              className="flex gap-2 max-sm:w-full"
              variant="outline"
              size="sm"
            >
              cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default Profile;
