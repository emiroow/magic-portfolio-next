"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";

const Profile = () => {
  const lang = useLocale();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    try {
      const res = await axios.get(`/api/${lang}/admin/profile`);
      return res.data;
    } catch (err: any) {
      setError("Failed to load profile");
      return null;
    }
  };

  const putProfile = async (data: formType) => {
    console.log(data);
    setBtnLoading(true);
    try {
      const res = await axios.put(`/api/${lang}/admin/profile`, data);
      setBtnLoading(false);
      return res.data;
    } catch (err: any) {
      setBtnLoading(false);
      setError("Failed to update profile");
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      const data = await getProfile();
      setProfile(data);
      setPageLoading(false);
      setValue("name", data.name);
      setValue("fullName", data.fullName);
      setValue("email", data.email);
      setValue("tel", data.tel);
      setValue("summary", data.summary);
      setValue("avatarUrl", data.avatarUrl);
      setValue("description", data.description);
    };
    fetchData();
  }, [lang]);

  type formType = {
    name: string;
    fullName: string;
    email: string;
    tel: string;
    summary: string;
    avatarUrl: string;
    description: string;
  };

  const FormSchema = yup.object().shape({
    name: yup.string().required("فیلد اجباری"),
    fullName: yup.string().required("فیلد اجباری"),
    email: yup.string().required("فیلد اجباری"),
    tel: yup
      .string()
      .required("فیلد اجباری")
      .matches(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
    summary: yup.string().required("فیلد اجباری"),
    avatarUrl: yup.string().required("فیلد اجباری"),
    description: yup.string().required("فیلد اجباری"),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty },
  } = useForm<formType>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      name: "",
      fullName: "",
      email: "",
      tel: "",
      summary: "",
      avatarUrl: "",
      description: "",
    },
  });

  const onsubmit = (data: formType) => putProfile(data);

  if (pageLoading) return <Loading className="h-[50vh]" />;
  if (error) return <section>{error}</section>;
  return (
    <section>
      {/* title */}
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className=" flex flex-col gap-2 mb-2 ">
          <Input
            className="text-sm"
            type="text"
            {...register("name")}
            placeholder="نام"
          />
          <p className="text-red-600 text-xs">{errors.name?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("fullName")}
            placeholder="نام و نام خانوادگی"
          />
          <p className="text-red-600 text-xs">{errors.fullName?.message}</p>

          <Input
            className="text-sm"
            type="email"
            {...register("email")}
            placeholder="ایمیل"
          />
          <p className="text-red-600 text-xs">{errors.email?.message}</p>

          <Input
            className="text-sm"
            type="text"
            placeholder="تلفن"
            {...register("tel")}
          />
          <p className="text-red-600 text-xs">{errors.tel?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("summary")}
            placeholder="خلاصه ای از خود"
          />
          <p className="text-red-600 text-xs">{errors.summary?.message}</p>

          <Input
            type="text"
            className="text-sm"
            {...register("avatarUrl")}
            placeholder="لینک عکس پروفایل"
          />
          <p className="text-red-600 text-xs">{errors.avatarUrl?.message}</p>

          <Textarea
            className="text-sm"
            {...register("description")}
            placeholder="درباره من"
          />
          <p className="text-red-600 text-xs">{errors.description?.message}</p>
        </div>
        <Button disabled={!isDirty} type="submit" variant="secondary" size="sm">
          ذخیره
        </Button>
      </form>
    </section>
  );
};

export default Profile;
