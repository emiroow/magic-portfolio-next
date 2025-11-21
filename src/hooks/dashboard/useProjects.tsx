import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const useProjects = () => {
  const locale = useLocale();
  const t = useTranslations();
  const tDashboard = useTranslations('dashboard');
  const tProjects = useTranslations('dashboard.projects');
  const lang = useLocale();
  const [isEdit, setIsEdit] = useState(false);
  const [imageShowFromUrlLoading, setImageShowFromUrlLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTech, setNewTech] = useState('');
  const [newLink, setNewLink] = useState({ type: '', href: '', icon: '' });

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
    title: yup.string().required(t('requiredField')),
    href: yup.string().url('Must be a valid URL').required(t('requiredField')),
    dates: yup.string().required(t('requiredField')),
    active: yup.boolean().default(false),
    description: yup.string().required(t('requiredField')),
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
    image: yup.string().default(''),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    trigger, // اضافه شد
    formState: { errors, isDirty, dirtyFields },
  } = useForm<formType>({
    resolver: yupResolver(Schema),
    defaultValues: {
      title: '',
      href: '',
      dates: '',
      active: false,
      description: '',
      technologies: [],
      links: [],
      image: '',
    },
  });

  const {
    data: projects,
    isLoading,
    error,
    refetch: refetchGetProjects,
  } = useQuery({
    enabled: !!lang,
    queryKey: ['projects', lang],
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
    onSuccess: data => {
      toast(tDashboard('successMessage'));
      reset();
      setIsEdit(false);
      refetchGetProjects();
    },
    onError: error => {
      toast.error(tDashboard('errorMessage'));
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
      toast(tProjects('deleteSuccessMessage'));
      refetchGetProjects();
    },
    onError: () => {
      toast.error(tDashboard('errorMessage'));
    },
  });

  const uploadProjectImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(`/api/${lang}/admin/upload`, formData, {
        params: { lang, type: 'project' },
      });
      return res.data;
    },
    onSuccess: data => {
      const imageUrl = data.fileUrl ? `${data.fileUrl}?cb=${Date.now()}` : '';
      console.log(imageUrl);
      setValue('image', imageUrl);
    },
    onError: () => {
      toast.error(tDashboard('errorMessage'));
    },
  });

  const deleteUploadedProjectImage = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/${lang}/admin/upload`, {
        params: {
          lang,
          type: 'project',
          fileName: getValues('image')?.split('/').pop()?.split('?')[0],
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast(t('dashboard.successMessage'));
      setValue('image', '');
      trigger('image');
    },
    onError: data => {
      toast(data.message);
    },
  });

  const btnLoading = isPostingProject;

  const onsubmit = (data: formType) => {
    postProject(data);
  };

  const editProject = (project: any) => {
    setValue('_id', project._id);
    setValue('title', project.title);
    setValue('href', project.href);
    setValue('dates', project.dates);
    setValue('active', project.active);
    setValue('description', project.description);
    setValue('technologies', project.technologies || []);
    setValue('links', project.links || []);
    setValue('image', project.image);
    setIsEdit(true);
  };

  const addTechnology = () => {
    if (newTech.trim()) {
      const currentTech = getValues('technologies') || [];
      setValue('technologies', [...currentTech, newTech.trim()]);
      setNewTech('');
      trigger('technologies');
    }
  };

  const removeTechnology = (index: number) => {
    const currentTech = getValues('technologies') || [];
    setValue(
      'technologies',
      currentTech.filter((_, i) => i !== index)
    );
    trigger('technologies');
  };

  const addLink = () => {
    if (newLink.type.trim() && newLink.href.trim() && newLink.icon.trim()) {
      const currentLinks = getValues('links') || [];
      setValue('links', [...currentLinks, { ...newLink }]);
      setNewLink({ type: '', href: '', icon: '' });
      trigger('links');
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = getValues('links') || [];
    setValue(
      'links',
      currentLinks.filter((_, i) => i !== index)
    );
    trigger('links');
  };

  return {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    trigger,
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
    newTech,
    setNewTech,
    newLink,
    setNewLink,
    addTechnology,
    removeTechnology,
    addLink,
    removeLink,
  };
};

export default useProjects;
