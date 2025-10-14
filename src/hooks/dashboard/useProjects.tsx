import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const useProjects = () => {
  const locale = useLocale();
  const t = useTranslations();
  const tDashboard = useTranslations("dashboard");
  const tProjects = useTranslations("dashboard.projects");
  const lang = useLocale();
  const [isEdit, setIsEdit] = useState(false);
  const [imageShowFromUrlLoading, setImageShowFromUrlLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type formType = {
    _id?: string;
    title: string;
    href: string;
    dates: string;
    active: boolean;
    description: string;
    technologies: string[];
    links: { type: string; href: string; icon: string }[];
    image: string;
  };

  const Schema = yup.object().shape({
    title: yup.string().required(t("requiredField")),
    href: yup.string().url("Must be a valid URL").required(t("requiredField")),
    dates: yup.string().required(t("requiredField")),
    active: yup.boolean().default(false),
    description: yup.string().required(t("requiredField")),
    technologies: yup.array().of(yup.string().required()).default([]),
    links: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required(),
          href: yup.string().url().required(),
          icon: yup.string().required(),
        })
      )
      .default([]),
    image: yup.string().default(""),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<formType>({
    resolver: yupResolver(Schema),
    defaultValues: {
      title: "",
      href: "",
      dates: "",
      active: false,
      description: "",
      technologies: [],
      links: [],
      image: "",
    },
  });

  const {
    data: projects,
    isLoading,
    error,
    refetch: refetchGetProjects,
  } = useQuery({
    enabled: !!lang,
    queryKey: ["projects", lang],
    queryFn: async () => {
      const res = await axios.get(`/api/${lang}/admin/project`);
      return res.data;
    },
  });

  const {
    mutate: postProject,
    isPending: isPostingProject,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async (data: formType) => {
      if (data._id) {
        // Update existing project
        const res = await axios.put(`/api/${lang}/admin/project`, data);
        return res.data;
      } else {
        // Create new project
        const res = await axios.post(`/api/${lang}/admin/project`, data);
        return res.data;
      }
    },
    onSuccess: (data) => {
      toast(tDashboard("successMessage"));
      reset();
      setIsEdit(false);
      refetchGetProjects();
    },
    onError: (error) => {
      toast.error(tDashboard("errorMessage"));
    },
  });

  const { mutate: deleteProject, isPending: isDeletingProject } = useMutation({
    mutationFn: async (_id: string) => {
      const res = await axios.delete(`/api/${lang}/admin/project`, {
        data: { _id },
      });
      return res.data;
    },
    onSuccess: () => {
      toast(tProjects("deleteSuccessMessage"));
      refetchGetProjects();
    },
    onError: () => {
      toast.error(tDashboard("errorMessage"));
    },
  });

  const uploadProjectImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(`/api/${lang}/admin/upload`, formData, {
        params: { lang, type: "project" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      const imageUrl = data.fileUrl ? `${data.fileUrl}?cb=${Date.now()}` : "";
      setValue("image", imageUrl);
    },
    onError: () => {
      toast.error(tDashboard("errorMessage"));
    },
  });

  const deleteUploadedProjectImage = useMutation({
    mutationFn: async () => {
      setValue("image", "");
      return true;
    },
    onSuccess: () => {
      setValue("image", "");
    },
  });

  const btnLoading = isPostingProject;

  const onsubmit = (data: formType) => {
    postProject(data);
  };

  const editProject = (project: any) => {
    setValue("_id", project._id);
    setValue("title", project.title);
    setValue("href", project.href);
    setValue("dates", project.dates);
    setValue("active", project.active);
    setValue("description", project.description);
    setValue("technologies", project.technologies || []);
    setValue("links", project.links || []);
    setValue("image", project.image);
    setIsEdit(true);
  };

  return {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isDirty, dirtyFields },
    onsubmit,
    btnLoading,
    isLoading,
    error,
    projects,
    refetchGetProjects,
    isEdit,
    setIsEdit,
    postProject,
    deleteProject,
    isDeletingProject,
    isPostingProject,
    editProject,
    uploadProjectImage,
    deleteUploadedProjectImage,
    imageShowFromUrlLoading,
    setImageShowFromUrlLoading,
    fileInputRef,
    resetMutation,
  };
};

export default useProjects;
