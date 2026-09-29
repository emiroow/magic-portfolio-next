'use client';

import { CheckboxField, EmptyState, ErrorState, Field, FormPanel, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import { Badge } from '@/components/ui/badge';
import { Stack } from '@/components/sections/stack';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import ImageCropperDialog from '@/components/ui/image-cropper';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import MarkdownEditor from '@/components/ui/markdown-editor';
import useBlog from '@/hooks/dashboard/useBlog';
import { cn, formatYearMonthLocal, isOptimizableImage, localizedCount, readingTime, slugify } from '@/lib/utils';
import type { IBlog } from '@/types';
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef, useState } from 'react';

/** Listing filter. */
const STATUSES = ['all', 'published', 'draft'] as const;
type Status = (typeof STATUSES)[number];

const isDraft = (post: IBlog) => post.published === false;

/** Blog section: markdown editor with cover, tags, drafts and search. */
const Blog = () => {
  const t = useTranslations('dashboard.blog');
  const tDash = useTranslations('dashboard');
  const tcrop = useTranslations('dashboard.crop');
  const locale = useLocale();
  const lang = locale === 'fa' ? 'fa' : 'en';

  const {
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
    save,
    deletePost,
    deleting,
    togglePublished,
    uploadCover,
    deleteCover,
    startEdit,
    addTag,
    removeTag,
    onSubmit,
    refetchPosts,
  } = useBlog();

  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [tagInput, setTagInput] = useState('');
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = watch('title');
  const content = watch('content');
  const tags = watch('tags') ?? [];
  const image = watch('image');
  const editingId = watch('_id');

  // Auto-derive the slug from the title while creating; a touched slug wins.
  const autoSlug = !editingId && title ? slugify(title) : watch('slug');

  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;

  const closeForm = () => {
    setFormOpen(false);
    reset();
    setTagInput('');
  };

  const beginCreate = () => {
    reset();
    setFormOpen(true);
  };

  const beginEdit = (post: IBlog) => {
    startEdit(post);
    setFormOpen(true);
  };

  const commitTag = () => {
    addTag(tagInput);
    setTagInput('');
  };

  const filtered = (posts ?? []).filter(post => {
    if (status === 'published' && isDraft(post)) return false;
    if (status === 'draft' && !isDraft(post)) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      post.title.toLowerCase().includes(needle) ||
      post.slug.toLowerCase().includes(needle) ||
      (post.tags ?? []).some(tag => tag.toLowerCase().includes(needle))
    );
  });

  const drafts = (posts ?? []).filter(isDraft).length;

  return (
    <SectionShell
      title={t('title')}
      action={
        !formOpen && (
          <Button size="icon" variant="outline" className="size-8" onClick={beginCreate} aria-label={t('createBlog')}>
            <Plus className="size-4" aria-hidden />
          </Button>
        )
      }
    >
      <FormPanel open={formOpen} title={editingId ? t('edit') : t('createBlog')} onClose={closeForm}>
        <form onSubmit={handleSubmit(data => onSubmit({ ...data, slug: autoSlug }))} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('titleLabel')} id="blog-title" error={errors.title?.message}>
              <Input id="blog-title" {...register('title')} placeholder={t('titlePlaceholder')} />
            </Field>
            <Field label={t('slugLabel')} id="blog-slug" error={errors.slug?.message} hint={t('slugHint')}>
              <Input
                id="blog-slug"
                value={autoSlug}
                onChange={e => setValue('slug', e.target.value, { shouldValidate: true, shouldDirty: true })}
                placeholder={t('slugPlaceholder')}
                dir="ltr"
              />
            </Field>
          </div>

          <Field label={t('summaryLabel')} id="blog-summary" error={errors.summary?.message} hint={t('summaryHint')}>
            <Input id="blog-summary" {...register('summary')} placeholder={t('summaryPlaceholder')} />
          </Field>

          {/* Cover */}
          <Field label={t('coverImage')} error={errors.image?.message} hint={t('uploadImageHint')}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20">
                {image &&
                  (isOptimizableImage(image) ? (
                    <Image src={image} alt={t('coverImage')} fill sizes="128px" className="object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={t('coverImage')} className="size-full object-cover" />
                  ))}
              </div>
              <div className="flex flex-col items-start gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadCover.isPending}
                >
                  {uploadCover.isPending ? <Loading size="sm" className="me-2" /> : null}
                  {t('uploadImage')}
                </Button>
                {image && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteCover.mutate()} disabled={deleteCover.isPending}>
                    {t('removeImage')}
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCropSrc(URL.createObjectURL(file));
                    setCropOpen(true);
                  }}
                />
              </div>
            </div>
          </Field>

          <ImageCropperDialog
            open={cropOpen}
            onOpenChange={v => {
              setCropOpen(v);
              if (!v && cropSrc) {
                URL.revokeObjectURL(cropSrc);
                setCropSrc(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }
            }}
            src={cropSrc}
            aspect={16 / 9}
            labels={{ title: tcrop('title'), apply: tcrop('apply'), cancel: tDash('cancel'), zoom: tcrop('zoom'), move: tcrop('move') }}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            outputSize={1200}
            onCropped={file => {
              const formData = new FormData();
              formData.append('image', file);
              uploadCover.mutate(formData);
            }}
          />

          {/* Tags */}
          <Field label={t('tagsLabel')} error={errors.tags?.message} hint={t('tagsHint')}>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    commitTag();
                  }
                }}
                placeholder={t('tagsPlaceholder')}
                aria-label={t('tagsPlaceholder')}
              />
              <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={commitTag}>
                {tDash('add')}
              </Button>
            </div>
            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag, index) => (
                  <li key={`${tag}-${index}`}>
                    <Badge variant="secondary" onDelete={() => removeTag(index)}>
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CheckboxField id="blog-published" label={t('published')} {...register('published')} />
            <p className="flex items-center text-xs text-muted-foreground sm:justify-end">
              {t('wordCount', { count: localizedCount(words, lang) })}
            </p>
          </div>

          <Field label={t('contentLabel')} error={errors.content?.message}>
            {/* The editor is uncontrolled from RHF's perspective; sync via setValue. */}
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
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="sm:max-w-xs"
            />
            <div className="flex gap-1.5" role="group" aria-label={t('statusFilter')}>
              {STATUSES.map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  aria-pressed={status === value}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    status === value
                      ? 'border-foreground bg-foreground text-background'
                      : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  {t(value)}
                  {value === 'draft' && drafts > 0 && <span className="tabular-nums">({localizedCount(drafts, lang)})</span>}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <Stack>
              {filtered.map(post => {
                const cover = post.image;
                // The admin endpoint returns full documents, so the estimate
                // is derived here rather than stored.
                const minutes = readingTime(post.content);

                return (
                  <div key={post._id} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted/30 sm:size-14">
                      {cover && isOptimizableImage(cover) ? (
                        <Image src={cover} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <span aria-hidden className="flex size-full items-center justify-center text-sm font-bold text-muted-foreground/50">
                          {(post.title || '?').charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate text-sm font-medium">{post.title}</p>
                        <Badge variant={isDraft(post) ? 'outline' : 'secondary'} className="shrink-0 px-2 py-0 text-[10px] font-normal">
                          {isDraft(post) ? t('draft') : t('published')}
                        </Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        <bdi dir="ltr">/{post.slug}</bdi> · {formatYearMonthLocal(post.createdAt, lang)}
                        {minutes > 0 && ` · ${t('readingTime', { minutes: localizedCount(minutes, lang) })}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      {!isDraft(post) && (
                        <Link
                          href={`/${locale}/blog/${post.slug}`}
                          target="_blank"
                          aria-label={t('openPost')}
                          className={cn(buttonIcon, 'hidden sm:inline-flex')}
                        >
                          <ExternalLink className="size-4" aria-hidden />
                        </Link>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={buttonIcon}
                        onClick={() => post._id && togglePublished.mutate(post)}
                        disabled={togglePublished.isPending}
                        aria-label={isDraft(post) ? t('publish') : t('unpublish')}
                        title={isDraft(post) ? t('publish') : t('unpublish')}
                      >
                        {isDraft(post) ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
                      </Button>
                      <Button size="icon" variant="ghost" className={buttonIcon} onClick={() => beginEdit(post)} aria-label={t('edit')}>
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(buttonIcon, 'hover:text-destructive')}
                        onClick={() => post._id && setPendingDelete(post._id)}
                        disabled={deleting}
                        aria-label={tDash('delete')}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </Stack>
          ) : (
            <EmptyState text={t('noResults')} />
          )}
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

const buttonIcon = 'size-8';

export default Blog;
