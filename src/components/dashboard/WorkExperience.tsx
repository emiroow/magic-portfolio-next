'use client';

import { EmptyState, ErrorState, Field, FormPanel, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import { ResumeCard } from '@/components/resume-card';
import ImageCropperDialog from '@/components/ui/image-cropper';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import useWorkExperience from '@/hooks/dashboard/useWorkExperience';
import type { IWork } from '@/types';
import { formatYearMonthLocal } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

/** Work experience section: timeline entries with logo and date range. */
const WorkExperience = () => {
  const t = useTranslations('dashboard.workExperience');
  const tRoot = useTranslations();
  const tcrop = useTranslations('dashboard.crop');
  const locale = useLocale();
  const lang = locale === 'fa' ? 'fa' : 'en';

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    errors,
    works,
    isPending,
    isError,
    error,
    save,
    deleteWork,
    uploadLogo,
    deleteLogo,
    startEdit,
    onSubmit,
    fileInputRef,
    refetchWorks,
  } = useWorkExperience();

  const [formOpen, setFormOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const closeForm = () => {
    setFormOpen(false);
    reset();
  };

  const beginCreate = () => {
    reset();
    setFormOpen(true);
  };

  const beginEdit = (work: IWork) => {
    startEdit(work);
    setFormOpen(true);
  };

  const logoUrl = getValues('logoUrl');

  return (
    <SectionShell
      title={t('experience')}
      action={
        !formOpen && (
          <Button size="icon" variant="outline" className="size-8" onClick={beginCreate} aria-label={t('createWork')}>
            <Plus className="h-4 w-4" />
          </Button>
        )
      }
    >
      <FormPanel open={formOpen} title={getValues('_id') ? t('editWork') : t('createWork')} onClose={closeForm}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Logo */}
          <Field label={t('logoImage')}>
            <div className="flex items-center gap-3">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={t('logoImage')} className="size-full object-contain p-1" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">{t('noImage')}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadLogo.isPending}>
                  {uploadLogo.isPending ? <Loading size="sm" className="me-2" /> : null}
                  {t('uploadImage')}
                </Button>
                {logoUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteLogo.mutate()} disabled={deleteLogo.isPending}>
                    {t('noImage')}
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
            aspect={1}
            labels={{ title: tcrop('title'), apply: tcrop('apply'), cancel: t('cancel'), zoom: tcrop('zoom'), move: tcrop('move') }}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            outputSize={256}
            onCropped={file => {
              const formData = new FormData();
              formData.append('image', file);
              uploadLogo.mutate(formData);
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('company')} error={errors.company?.message}>
              <Input {...register('company')} placeholder={t('companyPlaceholder')} />
            </Field>
            <Field label={t('title')} error={errors.title?.message}>
              <Input {...register('title')} placeholder={t('titlePlaceholder')} />
            </Field>
            <Field label={t('href')} error={errors.href?.message}>
              <Input {...register('href')} placeholder={t('hrefPlaceholder')} type="url" />
            </Field>
            <Field label={t('location')} error={errors.location?.message}>
              <Input {...register('location')} placeholder={t('locationPlaceholder')} />
            </Field>
          </div>

          <DateRangePicker
            startValue={getValues('start')}
            endValue={getValues('end')}
            onStartChange={value => setValue('start', value, { shouldValidate: true, shouldDirty: true })}
            onEndChange={value => setValue('end', value, { shouldValidate: true, shouldDirty: true })}
            startLabel={t('start')}
            endLabel={t('end')}
            locale={lang}
            error={{ start: errors.start?.message, end: errors.end?.message }}
          />

          <Field label={t('description')} error={errors.description?.message}>
            <Textarea rows={3} {...register('description')} placeholder={t('descriptionPlaceholder')} />
          </Field>

          <div className="flex gap-2 max-sm:flex-col">
            <Button type="submit" disabled={save.isPending} className="w-full sm:w-auto">
              {save.isPending ? <Loading size="sm" className="me-2" /> : null}
              {t('save')}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm} className="w-full sm:w-auto">
              {t('cancelForm')}
            </Button>
          </div>
        </form>
      </FormPanel>

      {isPending ? (
        <LoadingRows />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetchWorks()} />
      ) : works && works.length > 0 ? (
        <div className="space-y-3">
          {works.map(work => (
            <ResumeCard
              key={work._id}
              logoUrl={work.logoUrl}
              altText={work.company}
              title={work.company}
              subtitle={work.title}
              href={work.href}
              description={work.description}
              period={`${formatYearMonthLocal(work.start, lang)}${work.start && work.end ? ' – ' : ''}${
                work.end ? formatYearMonthLocal(work.end, lang) : work.start ? tRoot('present') : ''
              }`}
              isExpanded={expanded === work._id}
              onToggle={() => setExpanded(expanded === work._id ? null : (work._id ?? null))}
              onEdit={() => beginEdit(work)}
              onDelete={() => work._id && setPendingDelete(work._id)}
            />
          ))}
        </div>
      ) : (
        !formOpen && <EmptyState text={t('noWorkExperiences')} actionText={t('createFirstWorkExperience')} onAction={beginCreate} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={open => !open && setPendingDelete(null)}
        itemName={works?.find(w => w._id === pendingDelete)?.company}
        onConfirm={() => {
          if (pendingDelete) deleteWork(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </SectionShell>
  );
};

export default WorkExperience;
