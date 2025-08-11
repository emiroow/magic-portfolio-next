"use client";
import useProfile from "@/hooks/dashboard/useProfile";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";
const Profile = () => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
    btnLoading,
    pageLoading,
    error,
    profile,
    onsubmit,
  } = useProfile();

  if (pageLoading) return <Loading className="h-[50vh]" />;
  return (
    <section>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="flex flex-col gap-1 mb-2">
          <Input
            className="text-sm"
            type="text"
            {...register("name")}
            placeholder="نام"
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.name?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("fullName")}
            placeholder="نام و نام خانوادگی"
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.fullName?.message}</p>

          <Input
            className="text-sm"
            type="email"
            {...register("email")}
            placeholder="ایمیل"
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.email?.message}</p>

          <Input
            className="text-sm"
            type="text"
            placeholder="تلفن"
            {...register("tel")}
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.tel?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("summary")}
            placeholder="خلاصه ای از خود"
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
            placeholder="درباره من"
            disabled={btnLoading}
          />
          <p className="text-red-600 text-xs">{errors.description?.message}</p>
        </div>
        <Button
          disabled={!isDirty || btnLoading}
          type="submit"
          className="flex gap-2 max-sm:w-full"
          variant="secondary"
          size="sm"
        >
          {btnLoading ? <Loading size="sm" /> : "ذخیره"}
        </Button>
      </form>
    </section>
  );
};

export default Profile;
