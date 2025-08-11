"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
const useProfile = () => {
  const lang = useLocale();

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
    reset,
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

  const {
    data: profile,
    isLoading: pageLoading,
    error,
    refetch: refetchGetProfile,
  } = useQuery({
    queryKey: ["profile", lang],
    queryFn: async () => {
      const res = await axios.get(`/api/${lang}/admin/profile`);
      setValue("name", res.data.name || "");
      setValue("fullName", res.data.fullName || "");
      setValue("email", res.data.email || "");
      setValue("tel", res.data.tel || "");
      setValue("summary", res.data.summary || "");
      setValue("avatarUrl", res.data.avatarUrl || "");
      setValue("description", res.data.description || "");
      return res.data;
    },
  });

  const { mutate: putProfile, status: mutationStatus } = useMutation({
    mutationFn: async (data: formType) => {
      console.log(data);
      const res = await axios.put(`/api/${lang}/admin/profile`, data);
      return res.data;
    },
    onSuccess: () => {
      refetchGetProfile();
    },
  });

  const btnLoading = mutationStatus === "pending";

  const onsubmit = (data: formType) => putProfile(data);

  return {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
    onsubmit,
    btnLoading,
    pageLoading,
    error,
    profile,
  };
};

export default useProfile;
