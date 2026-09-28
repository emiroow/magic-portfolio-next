'use client';

import { EmptyState, ErrorState, Field, FormPanel, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import MarkdownEditor from '@/components/ui/markdown-editor';
import useBlog, { slugify } from '@/hooks/dashboard/useBlog';
import type { IBlog } from '@/types';
import { formatYearMonthLocal } from '@/lib/utils';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

/** Blog section: markdown post editor with search, edit and delete. */
const Blog = () => {
  const t = useTranslations('dashboard.blog');
  const tDash = useTranslations('dashboard');
  const locale = useLocale();
  const lang = locale === 'fa' ? 'fa' : 'en';

  const { register, handleSubmit, setValue, watch, reset, errors, posts, isPending, isError, error, save, deletePost, deleting, startEdit, onSubmit, refetchPosts } =
    useBlog();

  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const title = watch('title');
  const content = watch('content');
  const editingId = watch('_id');

  const closeForm = () => {
    setFormOpen(false);
    reset();
  };

  const beginCreate = () => {
    reset();
    setFormOpen(true);
  };

  const beginEdit = (post: IBlog) => {
    startEdit(post);
    setFormOpen(true);
  };

  // Auto-derive the slug from the title while creating (never overwrites a
  // manually edited slug once the field has been touched with a value).
  const slug = watch('slug');
  const autoSlug = !editingId && title ? slugify(title) : slug;

  const filtered = (posts ?? []).filter(
    post => !query.trim() || post.title.toLowerCase().includes(query.toLowerCase()) || post.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SectionShell
      title={t('title')}
      action={
        !formOpen && (
          <Button size="icon" variant="outline" className="size-8" onClick={beginCreate} aria-label={t('createBlog')}>
            <Plus className="h-4 w-4" />
          </Button>
        )
      }
    >
      <FormPanel open={formOpen} title={editingId ? t('edit') : t('createBlog')} onClose={closeForm}>
        <form
          onSubmit={handleSubmit(data => onSubmit({ ...data, slug: autoSlug }))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('titlePlaceholder')} error={errors.title?.message}>
              <Input {...register('title')} placeholder={t('titlePlaceholder')} />
            </Field>
            <Field label={t('slugPlaceholder')} error={errors.slug?.message}>
              <Input value={autoSlug} onChange={e => setValue('slug', e.target.value)} placeholder={t('slugPlaceholder')} dir="ltr" />
            </Field>
          </div>

          <Field label={t('summaryPlaceholder')} error={errors.summary?.message}>
            <Input {...register('summary')} placeholder={t('summaryPlaceholder')} />
          </Field>

          <Field label={t('contentPlaceholder')} error={errors.content?.message}>
            {/* The editor is uncontrolled from RHF's perspective; sync via setValue. */}
            <input type="hidden" {...register('content')} />
            <MarkdownEditor value={content ?? ''} onChange={value => setValue('content', value, { shouldValidate: true, shouldDirty: true })} height={360} />
          </Field>

          <div className="flex gap-2 max-sm:flex-col">
            <Button type="submit" disabled={save.isPending} className="w-full sm:w-auto">
              {save.isPending ? <Loading size="sm" className="me-2" /> : null}
              {t('save')}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm} className="w-full sm:w-auto">
              {tDash('cancel')}
            </Button>
          </div>
        </form>
      </FormPanel>

      {isPending ? (
        <LoadingRows />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetchPosts()} />
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} className="mb-1 max-w-sm" />
          {filtered.map(post => (
            <div key={post._id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 sm:p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{post.title}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  /{post.slug} · {formatYearMonthLocal(post.createdAt, lang)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/${locale}/blog/${post.slug}`} target="_blank">
                  <Button size="icon" variant="ghost" className="size-8" aria-label={t('openPost')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => beginEdit(post)} aria-label={t('edit')}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => post._id && setPendingDelete(post._id)} disabled={deleting} aria-label={tDash('delete')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <EmptyState text={t('noBlogs')} />}
        </div>
      ) : (
        !formOpen && <EmptyState text={t('noBlogs')} actionText={t('createBlog')} onAction={beginCreate} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={open => !open && setPendingDelete(null)}
        itemName={posts?.find(p => p._id === pendingDelete)?.title}
        onConfirm={() => {
          if (pendingDelete) deletePost(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </SectionShell>
  );
};

export default Blog;
