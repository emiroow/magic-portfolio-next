import { ISkill } from "@/interface/ISkills";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useSkills = () => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const BLUR_FADE_DELAY = 0.04;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<{ name: string }>({ defaultValues: { name: "" } });

  const {
    data: getSkills,
    isLoading: getSkillsIsLoading,
    refetch: refetchGetSkills,
  } = useQuery({
    queryKey: ["getSkills"],
    queryFn: async () => {
      const res = await axios.get<ISkill[]>(`/api/${locale}/admin/skill`);
      return res.data;
    },
  });

  const { mutate: addSkillMutate, isPending: addSkillIsLoading } = useMutation({
    mutationFn: async (body: { name: string }) => {
      const res = await axios.post(`/api/${locale}/admin/skill`, body);
      return res.data;
    },
    onSuccess: () => {
      toast(t("successMessage"));
      refetchGetSkills();
      setValue("name", "");
    },
    onError: () => {
      toast(t("errorMessage"));
    },
  });

  const { mutate: deleteSkillMutate, isPending: deleteSkillIsLoading } =
    useMutation({
      mutationFn: async (body: { id: string }) => {
        const res = await axios.delete(`/api/${locale}/admin/skill`, {
          data: body,
        });
        return res.data;
      },
      onSuccess: () => {
        toast(t("successMessage"));
        refetchGetSkills();
      },
      onError: () => {
        toast(t("errorMessage"));
      },
    });

  const onSubmit = (data: { name: string }) => addSkillMutate(data);

  return {
    getSkills,
    locale,
    BLUR_FADE_DELAY,
    getSkillsIsLoading,
    formState: { isDirty, dirtyFields },
    register,
    setValue,
    handleSubmit,
    onSubmit,
    addSkillMutate,
    addSkillIsLoading,
    deleteSkillMutate,
    deleteSkillIsLoading,
  };
};

export default useSkills;
