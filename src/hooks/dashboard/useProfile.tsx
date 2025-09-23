"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const useProfile = () => {
  const locale = useLocale();
  const t = useTranslations();
  const lang = useLocale();
  const { theme } = useTheme();
  const [
    profileImageShowImageFromUrlLoading,
    setProfileImageShowImageFromUrlLoading,
  ] = useState(false);

  type formType = {
    name: string;
    fullName: string;
    email: string;
    tel: string;
    summary: string;
    avatarUrl?: string;
    description: string;
  };

  const FormSchema = yup.object().shape({
    name: yup.string().required(t("requiredField")),
    fullName: yup.string().required(t("requiredField")),
    email: yup.string().required(t("requiredField")),
    tel: yup
      .string()
      .required(t("requiredField"))
      .matches(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
    summary: yup.string().required(t("requiredField")),
    description: yup.string().required(t("requiredField")),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    resetField,
    formState: { errors, isDirty, defaultValues },
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
    enabled: !!lang,
    queryKey: ["profile", lang],
    queryFn: async () => {
      const res = await axios.get<IProfile>(`/api/${lang}/admin/profile`);
      // Add cache-busting param to avatarUrl
      const avatarUrl = res.data.avatarUrl
        ? `${res.data.avatarUrl}?cb=${Date.now()}`
        : "";
      setValue("name", res.data.name || "");
      setValue("fullName", res.data.fullName || "");
      setValue("email", res.data.email || "");
      setValue("tel", res.data.tel || "");
      setValue("summary", res.data.summary || "");
      setValue("avatarUrl", avatarUrl);
      setValue("description", res.data.description || "");
      return { ...res.data, avatarUrl };
    },
  });

  const { mutate: putProfile, status: mutationStatus } = useMutation({
    mutationFn: async (data: formType) => {
      const res = await axios.put(`/api/${lang}/admin/profile`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"));
      reset();
      refetchGetProfile();
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: async (formData: any) => {
      const res = await axios.post(`/api/${lang}/admin/upload`, formData, {
        params: { lang },
      });
      return res.data;
    },
    onSuccess: (data) => {
      reset();
      // Add cache-busting param to avatarUrl
      const avatarUrl = data.avatarUrl
        ? `${data.avatarUrl}?cb=${Date.now()}`
        : "";
      setValue("avatarUrl", avatarUrl);
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
    resetField,
    formState: { errors, isDirty, defaultValues },
    onsubmit,
    btnLoading,
    pageLoading,
    error,
    profile,
    uploadAvatar,
    profileImageShowImageFromUrlLoading,
    setProfileImageShowImageFromUrlLoading,
    refetchGetProfile,
  };
};

export default useProfile;
