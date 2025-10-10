import { IEducation } from "@/interface/IEducation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
const useEducation = () => {
  const [isEdit, setIsEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  const BLUR_FADE_DELAY = 0.04;
  const t = useTranslations();
  const { theme } = useTheme();
  const lang = useLocale();

  type formType = {
    id?: string;
    school: string;
    href?: string;
    degree: string;
    logoUrl?: string;
    start: string;
    end: string;
  };

  const FormSchema = yup.object().shape({
    school: yup.string().required(t("requiredField")),
    href: yup.string().optional(),
    degree: yup.string().required(t("requiredField")),
    logoUrl: yup.string().optional(),
    start: yup.string().required(t("requiredField")),
    end: yup.string().required(t("requiredField")),
    id: yup.string().optional(),
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
      degree: "",
      end: "",
      href: "",
      id: "",
      logoUrl: "",
      school: "",
      start: "",
    },
  });

  const { id: IsEditItem } = getValues();

  const {
    data: getEducations,
    isLoading,
    refetch: refetchGetEducations,
  } = useQuery({
    queryKey: ["getEducations", locale],
    queryFn: async () => {
      const res = await axios.get<IEducation[]>(
        `/api/${locale}/admin/education`
      );
      return res.data;
    },
  });

  const { mutate: postEducation, isPending: isPostingEducation } = useMutation({
    mutationFn: async (data: formType) => {
      delete data.id;
      const res = await axios.post(`/api/${lang}/admin/education`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"));
      reset();
      setIsEdit(false);
      refetchGetEducations();
    },
    onError: (data) => {
      toast(data.message);
    },
  });

  const { mutate: putEducation, status: mutationStatus } = useMutation({
    mutationFn: async (data: formType) => {
      const res = await axios.put(`/api/${lang}/admin/education`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(t("dashboard.successMessage"));
      reset();
      setIsEdit(false);
      refetchGetEducations();
    },
    onError: (data) => {
      toast(data.message);
    },
  });

  const { mutate: deleteEducation, isPending: isDeletingEducation } =
    useMutation({
      mutationFn: async (id?: string) => {
        const res = await axios.delete(`/api/${lang}/admin/education`, {
          data: { id },
        });
        return res.data;
      },
      onSuccess: () => {
        toast(t("dashboard.successMessage"));
        reset();
        setIsEdit(false);
        refetchGetEducations();
      },
      onError: (data) => {
        toast(data.message);
      },
    });

  const uploadEducationImage = useMutation({
    mutationFn: async (formData: any) => {
      const res = await axios.post(`/api/${lang}/admin/upload`, formData, {
        params: { lang, type: "education" },
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

  const deleteUploadedEducationImage = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/${lang}/admin/upload`, {
        params: {
          lang,
          type: "education",
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
    IsEditItem ? putEducation(data) : postEducation(data);

  return {
    getEducations,
    isLoading,
    refetchGetEducations,
    isEdit,
    setIsEdit,
    fileInputRef,
    BLUR_FADE_DELAY,
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    formState: { errors, isDirty },
    getValues,
    locale,
    theme,
    postEducation,
    isPostingEducation,
    btnLoading,
    onsubmit,
    IsEditItem,
    deleteEducation,
    isDeletingEducation,
    uploadEducationImage,
    deleteUploadedEducationImage,
  };
};

export default useEducation;
