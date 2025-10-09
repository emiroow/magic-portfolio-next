import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
const useWorkExperience = () => {
  const locale = useLocale();
  const t = useTranslations();
  const lang = useLocale();
  const [isEdit, setIsEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
    id: yup.string().optional(),
    href: yup.string().optional(),
    logoUrl: yup.string().optional(),
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
    resolver: yupResolver(FormSchema) as any,
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
      const res = await axios.put(`/api/${lang}/admin/work`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"));
      reset();
      setIsEdit(false);
      refetchGetWorkExperience();
    },
    onError: (data) => {
      toast(data.message);
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
        toast(t("dashboard.successMessage"));
        reset();
        setIsEdit(false);
        refetchGetWorkExperience();
      },
      onError: (data) => {
        toast(data.message);
      },
    });

  const { mutate: postWorkExperience, isPending: isPostingWorkExperience } =
    useMutation({
      mutationFn: async (data: formType) => {
        const res = await axios.post(`/api/${lang}/admin/work`, data);
        return res.data;
      },
      onSuccess: () => {
        toast(t("dashboard.successMessage"));
        reset();
        setIsEdit(false);
        refetchGetWorkExperience();
      },
      onError: (data) => {
        toast(data.message);
      },
    });

  const uploadWorkExperienceImage = useMutation({
    mutationFn: async (formData: any) => {
      const res = await axios.post(`/api/${lang}/admin/upload`, formData, {
        params: { lang, type: "experience" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Add cache-busting param to avatarUrl
      const Url = data.fileUrl ? `${data.fileUrl}?cb=${Date.now()}` : "";
      setValue("logoUrl", Url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    onError: (data) => {
      toast(data.message);
    },
  });

  const deleteUploadedWorkExperienceImage = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/${lang}/admin/upload`, {
        params: {
          lang,
          type: "experience",
          fileName: getValues("logoUrl")?.split("/").pop()?.split("?")[0],
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"));
      setValue("logoUrl", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    onError: (data) => {
      toast(data.message);
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
    fileInputRef,
    uploadWorkExperienceImage,
    deleteUploadedWorkExperienceImage,
    expandedIndex,
    setExpandedIndex,
  };
};

export default useWorkExperience;
