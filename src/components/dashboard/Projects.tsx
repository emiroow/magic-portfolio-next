'use client';

import { EmptyState, ErrorState, Field, FormPanel, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import ImageCropperDialog from '@/components/ui/image-cropper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import useProjects from '@/hooks/dashboard/useProjects';
import ProjectRow from './Project-card';
import type { IProject } from '@/types';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

const LINK_TYPES = [
  { value: 'github', label: 'GitHub' },
  { value: 'demo', label: 'Demo' },
  { value: 'website', label: 'Website' },
  { value: 'figma', label: 'Figma' },
  { value: 'docs', label: 'Documentation' },
  { value: 'video', label: 'Video' },
  { value: 'download', label: 'Download' },
];

/** Projects section: CRUD form (image, technologies, links) + card list. */
const Projects = () => {
  const t = useTranslations('dashboard.projects');
  const tcrop = useTranslations('dashboard.crop');
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    errors,
    projects,
    isPending,
    isError,
    error,
    save,
    deleteProject,
    deleting,
    uploadImage,
    deleteImage,
    addTechnology,
    removeTechnology,
    addLink,
    removeLink,
    startEdit,
    onSubmit,
    refetchProjects,
  } = useProjects();

  const [formOpen, setFormOpen] = useState(false);
  const [tech, setTech] = useState('');
  const [link, setLink] = useState({ type: '', href: '', icon: '' });
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeForm = () => {
    setFormOpen(false);
    reset();
  };

  const beginCreate = () => {
    reset();
    setFormOpen(true);
  };

  const beginEdit = (project: IProject) => {
    startEdit(project);
    setFormOpen(true);
  };

  const image = getValues('image');
  const technologies = getValues('technologies') ?? [];
  const links = getValues('links') ?? [];

  return (
    <SectionShell
      title={t('title')}
      action={
        !formOpen && (
          <Button size="icon" variant="outline" className="size-8" onClick={beginCreate} aria-label={t('addProject')}>
            <Plus className="h-4 w-4" />
          </Button>
        )
      }
    >
      <FormPanel open={formOpen} title={getValues('_id') ? t('editProject') : t('createProject')} onClose={closeForm}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image */}
          <Field label={t('projectImage')} error={errors.image?.message}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20 sm:w-56">
                {image ? (
                  <>
                    <Image src={image} alt={t('projectImage')} fill sizes="224px" className="object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute end-2 top-2 size-6 rounded-full"
                      onClick={() => deleteImage.mutate()}
                      disabled={deleteImage.isPending}
                      aria-label={t('removeImage')}
                    >
                      <Loading size="sm" />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">{t('noImage')}</span>
                )}
              </div>
              <div className="space-y-1">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadImage.isPending}>
                  {uploadImage.isPending ? <Loading size="sm" className="me-2" /> : null}
                  {t('uploadImage')}
                </Button>
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
                <p className="text-xs text-muted-foreground">{t('uploadImageHint')}</p>
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
            labels={{ title: tcrop('title'), apply: tcrop('apply'), cancel: t('cancel'), zoom: tcrop('zoom'), move: tcrop('move') }}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            onCropped={file => {
              const formData = new FormData();
              formData.append('image', file);
              uploadImage.mutate(formData);
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('projectTitle')} error={errors.title?.message}>
              <Input {...register('title')} placeholder={t('projectTitlePlaceholder')} />
            </Field>
            <Field label={t('projectUrl')} error={errors.href?.message}>
              <Input {...register('href')} placeholder={t('projectUrlPlaceholder')} type="url" />
            </Field>
            <Field label={t('projectDates')} error={errors.dates?.message}>
              <Input {...register('dates')} placeholder={t('projectDatesPlaceholder')} />
            </Field>
            <Field label={t('active')} className="flex-row items-center gap-2 self-end pt-6">
              <input id="project-active" type="checkbox" {...register('active')} className="size-4 rounded border-input accent-primary" />
            </Field>
          </div>

          <Field label={t('projectDescription')} error={errors.description?.message}>
            <Textarea rows={3} {...register('description')} placeholder={t('projectDescriptionPlaceholder')} />
          </Field>

          {/* Technologies */}
          <Field label={t('technologies')} error={errors.technologies?.message}>
            <div className="flex gap-2">
              <Input
                value={tech}
                onChange={e => setTech(e.target.value)}
                placeholder={t('technologyPlaceholder')}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology(tech);
                    setTech('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  addTechnology(tech);
                  setTech('');
                }}
              >
                {t('add')}
              </Button>
            </div>
            {technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {technologies.map((item, index) => (
                  <Badge key={index} variant="secondary" onDelete={() => removeTechnology(index)}>
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </Field>

          {/* Links */}
          <Field label={t('projectLinks')} error={errors.links?.message}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={link.type}
                onChange={e => setLink({ ...link, type: e.target.value, icon: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:max-w-48"
              >
                <option value="">{t('selectLinkType')}</option>
                {LINK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <Input
                value={link.href}
                onChange={e => setLink({ ...link, href: e.target.value })}
                placeholder={t('linkUrlPlaceholder')}
                type="url"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={!link.type || !link.href}
                onClick={() => {
                  addLink(link);
                  setLink({ type: '', href: '', icon: '' });
                }}
              >
                {t('add')}
              </Button>
            </div>
            {links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {links.map((item, index) => (
                  <Badge key={index} variant="secondary" onDelete={() => removeLink(index)}>
                    {item.type}
                  </Badge>
                ))}
              </div>
            )}
          </Field>

          <div className="flex gap-2 max-sm:flex-col">
            <Button type="submit" disabled={save.isPending} className="w-full sm:w-auto">
              {save.isPending ? <Loading size="sm" className="me-2" /> : null}
              {getValues('_id') ? t('update') : t('create')}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm} className="w-full sm:w-auto">
              {t('cancel')}
            </Button>
          </div>
        </form>
      </FormPanel>

      {isPending ? (
        <LoadingRows />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetchProjects()} />
      ) : projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map(project => (
            <ProjectRow key={project._id} project={project} onEdit={beginEdit} onDelete={id => deleteProject(id)} isDeleting={deleting} />
          ))}
        </div>
      ) : (
        !formOpen && <EmptyState text={t('noProjects')} actionText={t('createFirstProject')} onAction={beginCreate} />
      )}
    </SectionShell>
  );
};

export default Projects;
