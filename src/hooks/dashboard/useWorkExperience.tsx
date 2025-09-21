import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
const useWorkExperience = () => {
  const locale = useLocale();
  const t = useTranslations();
  const lang = useLocale();
  const [isEdit, setIsEdit] = useState(false);
  const { theme } = useTheme();

  type formType = {
    id?: string;
    company: string;
    href?: string;
    location: string;
    title: string;
    logoUrl?: string;
    start: string;
    end: string;
    description: string;
  };

  const FormSchema = yup.object().shape({
    company: yup.string().required(t("requiredField")),
    location: yup.string().required(t("requiredField")),
    title: yup.string().required(t("requiredField")),
    start: yup.string().required(t("requiredField")),
    end: yup.string().required(t("requiredField")),
    description: yup.string().required(t("requiredField")),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    formState: { errors, isDirty },
    getValues,
  } = useForm<formType>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      id: "",
      company: "",
      href: "",
      location: "",
      title: "",
      logoUrl: "",
      start: "",
      end: "",
      description: "",
    },
  });

  const { id: IsEditItem } = getValues();

  const {
    data: workExperienceData,
    isLoading,
    refetch: refetchGetWorkExperience,
  } = useQuery({
    queryKey: ["getWorkExperience", locale],
    queryFn: async () => {
      const res = await axios.get<IWork[]>(`/api/${locale}/admin/work`);
      return res.data;
    },
  });

  const { mutate: putWorkExperience, status: mutationStatus } = useMutation({
    mutationFn: async (data: formType) => {
      console.log(data);
      const res = await axios.put(`/api/${lang}/admin/work`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"), {
        style: {
          direction: locale === "fa" ? "rtl" : "ltr",
          backgroundColor: theme === "dark" ? "white" : "black",
          color: theme === "dark" ? "black" : "white",
        },
        position: "top-center",
      });
      reset();
      setIsEdit(false);
      refetchGetWorkExperience();
    },
  });

  const { mutate: deleteWorkExperience, isPending: isDeletingWorkExperience } =
    useMutation({
      mutationFn: async (id?: string) => {
        const res = await axios.delete(`/api/${lang}/admin/work`, {
          data: { id },
        });
        return res.data;
      },
      onSuccess: () => {
        toast(t("dashboard.successMessage"), {
          style: {
            direction: locale === "fa" ? "rtl" : "ltr",
            backgroundColor: theme === "dark" ? "white" : "black",
            color: theme === "dark" ? "black" : "white",
          },
          position: "top-center",
        });
        reset();
        setIsEdit(false);
        refetchGetWorkExperience();
      },
    });

  const { mutate: postWorkExperience, isPending: isPostingWorkExperience } =
    useMutation({
      mutationFn: async (data: formType) => {
        const res = await axios.post(`/api/${lang}/admin/work`, data);
        return res.data;
      },
      onSuccess: () => {
        toast(t("dashboard.successMessage"), {
          style: {
            direction: locale === "fa" ? "rtl" : "ltr",
            backgroundColor: theme === "dark" ? "white" : "black",
            color: theme === "dark" ? "black" : "white",
          },
          position: "top-center",
        });
        reset();
        setIsEdit(false);
        refetchGetWorkExperience();
      },
    });

  const btnLoading = mutationStatus === "pending";

  const onsubmit = (data: formType) =>
    IsEditItem ? putWorkExperience(data) : postWorkExperience(data);

  return {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
    workExperienceData,
    isLoading,
    refetchGetWorkExperience,
    onsubmit,
    control,
    putWorkExperience,
    btnLoading,
    getValues,
    isEdit,
    setIsEdit,
    isDeletingWorkExperience,
    deleteWorkExperience,
    mutate: postWorkExperience,
    isPending: isPostingWorkExperience,
  };
};

export default useWorkExperience;
