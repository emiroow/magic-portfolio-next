import { IBlog } from "@/interface/IBlog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const useBlog = () => {
  const locale = useLocale();
  const t = useTranslations();
  const tDashboard = useTranslations("dashboard");
  const tBlog = useTranslations("dashboard.blog");
  const [isEdit, setIsEdit] = useState(false);

  type FormType = {
    _id?: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    lang: "fa" | "en";
  };

  const Schema = yup.object({
    _id: yup.string().notRequired(),
    title: yup.string().required(t("requiredField")),
    slug: yup.string().required(t("requiredField")),
    summary: yup.string().default(""),
    content: yup.string().default(""),
    lang: yup.mixed<"fa" | "en">().oneOf(["fa", "en"]).required(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm<FormType>({
    resolver: yupResolver(Schema) as any,
    defaultValues: {
      _id: undefined,
      title: "",
      slug: "",
      summary: "",
      content: "",
      lang: (locale as "fa" | "en") || "fa",
    },
  });

  const {
    data: blogs,
    isLoading,
    refetch,
  } = useQuery({
    enabled: !!locale,
    queryKey: ["blogs", locale],
    queryFn: async () => {
      const res = await axios.get<IBlog[]>(`/api/${locale}/admin/blog`);
      return res.data;
    },
  });

  const {
    mutate: saveBlog,
    isPending: isSaving,
    reset: resetSaveMutation,
  } = useMutation({
    mutationFn: async (data: FormType) => {
      if (data._id) {
        const res = await axios.put(`/api/${locale}/admin/blog`, data);
        return res.data;
      }
      const res = await axios.post(`/api/${locale}/admin/blog`, data);
      return res.data;
    },
    onSuccess: () => {
      toast(tDashboard("successMessage"));
      reset();
      setIsEdit(false);
      refetch();
    },
    onError: () => toast.error(tDashboard("errorMessage")),
  });

  const { mutate: deleteBlog, isPending: isDeleting } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await axios.delete(`/api/${locale}/admin/blog`, {
        data: { _id },
      });
      return res.data;
    },
    onSuccess: () => {
      toast(tDashboard("successMessage"));
      refetch();
    },
    onError: () => toast.error(tDashboard("errorMessage")),
  });

  const editBlog = (b: IBlog) => {
    setValue("_id", b._id);
    setValue("title", b.title);
    setValue("slug", b.slug);
    setValue("summary", b.summary || "");
    setValue("content", b.content || "");
    setIsEdit(true);
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    getValues,
    errors,
    isDirty,
    blogs,
    isLoading,
    refetch,
    saveBlog,
    isSaving,
    deleteBlog,
    isDeleting,
    editBlog,
    isEdit,
    setIsEdit,
    resetSaveMutation,
  };
};

export default useBlog;
