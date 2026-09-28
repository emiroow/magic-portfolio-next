'use client';

import { api } from '@/lib/client-api';
import { blogSchema } from '@/lib/validations';
import type { IBlog } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToastMessages } from './useToastMessages';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Same schema as the API plus the optional document id for edits.
const formSchema = blogSchema.extend({ _id: z.string().optional() });
type BlogForm = z.infer<typeof formSchema>;

const EMPTY: BlogForm = { title: '', slug: '', summary: '', content: '' };

/** Slug from a title: ASCII transliteration-free, keeps letters/digits/dash. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

/** Blog post list + CRUD for the dashboard editor. */
const useBlog = () => {
  const locale = useLocale();
  const { ok, fail } = useToastMessages();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
    mode: 'onTouched',
  });

  const {
    data: posts,
    isPending,
    isError,
    error,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['blog-posts', locale],
    queryFn: () => api.get<IBlog[]>(`/api/${locale}/admin/blog`),
  });

  const save = useMutation({
    mutationFn: (data: BlogForm) =>
      data._id ? api.put<IBlog>(`/api/${locale}/admin/blog`, data) : api.post<IBlog>(`/api/${locale}/admin/blog`, data),
    onSuccess: () => {
      ok();
      reset();
      refetchPosts();
    },
    onError: () => fail(),
  });

  const { mutate: deletePost, isPending: deleting } = useMutation({
    mutationFn: (id: string) => api.del(`/api/${locale}/admin/blog?id=${encodeURIComponent(id)}`),
    onSuccess: () => {
      ok();
      refetchPosts();
    },
    onError: () => fail(),
  });

  const startEdit = (post: IBlog) => reset({ ...EMPTY, ...post, _id: post._id });

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    posts,
    isPending,
    isError,
    error,
    refetchPosts,
    save,
    deletePost,
    deleting,
    startEdit,
    onSubmit: (data: BlogForm) => save.mutate(data),
  };
};

export default useBlog;
