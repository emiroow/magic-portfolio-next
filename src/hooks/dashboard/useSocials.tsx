import { ISocial } from "@/interface/ISocial";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SocialForm = {
  _id?: string;
  name: string;
  url: string;
  icon: string;
};

const useSocials = () => {
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const tSocial = useTranslations("dashboard.social");
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<SocialForm>({
    defaultValues: { name: "", url: "", icon: "" },
  });

  const {
    data: socials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["socials", locale],
    queryFn: async () => {
      const res = await axios.get<ISocial[]>(`/api/${locale}/admin/social`);
      return res.data;
    },
  });

  const { mutateAsync: createSocial, isPending: creating } = useMutation({
    mutationFn: async (data: SocialForm) => {
      const res = await axios.post(`/api/${locale}/admin/social`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("successMessage"));
      refetch();
      reset();
      setIsEdit(false);
    },
    onError: () => toast.error(t("errorMessage")),
  });

  const { mutateAsync: updateSocial, isPending: updating } = useMutation({
    mutationFn: async (data: SocialForm) => {
      const res = await axios.put(`/api/${locale}/admin/social`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("successMessage"));
      refetch();
      reset();
      setIsEdit(false);
    },
    onError: () => toast.error(t("errorMessage")),
  });

  const { mutate: deleteSocial, isPending: deleting } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await axios.delete(`/api/${locale}/admin/social`, {
        data: { _id },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(t("successMessage"));
      refetch();
    },
    onError: () => toast.error(t("errorMessage")),
  });

  const onsubmit = async (data: SocialForm) => {
    if (!data.name || !data.url || !data.icon) {
      toast.error(t("errorMessage"));
      return;
    }
    // Max 4 socials
    if (!data._id && (socials?.length || 0) >= 4) {
      toast.error(tSocial("maxReached"));
      return;
    }
    if (data._id) await updateSocial(data);
    else await createSocial(data);
  };

  const edit = (s: ISocial) => {
    setValue("_id", s._id);
    setValue("name", s.name);
    setValue("url", s.url);
    setValue("icon", s.icon);
    setIsEdit(true);
  };

  return {
    socials,
    isLoading,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
    onsubmit,
    isEdit,
    setIsEdit,
    deleteSocial,
    deleting,
    creating,
    updating,
  };
};

export default useSocials;
