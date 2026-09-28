'use client';

import { iconDecider } from '@/components/icons';
import { EmptyState, ErrorState, Field, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import useSocials from '@/hooks/dashboard/useSocials';
import { Pencil, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const AVAILABLE_ICONS = ['github', 'linkedin', 'x', 'instagram', 'telegram', 'whatsapp', 'youtube', 'website', 'email'];

/** Social links section: inline create/edit form plus a badge list. */
const Socials = () => {
  const t = useTranslations('dashboard.social');
  const tDash = useTranslations('dashboard');
  const { socials, isPending, isError, error, register, handleSubmit, reset, watch, errors, onsubmit, save, deleteSocial, edit } =
    useSocials();

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const selectedIcon = watch('icon');
  const editingId = watch('_id');

  const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <SectionShell title={t('title')}>
      {/* Create / edit form */}
      <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
        <Field label={t('name')} error={errors.name?.message} className="md:col-span-3">
          <Input {...register('name')} placeholder={t('namePlaceholder')} autoComplete="off" />
        </Field>

        <Field label={t('url')} error={errors.url?.message} className="md:col-span-4">
          <Input {...register('url')} placeholder={t('urlPlaceholder')} type="url" />
        </Field>

        <Field label={t('icon')} error={errors.icon?.message} className="md:col-span-3">
          <select className={selectClass} {...register('icon')}>
            <option value="">{t('selectIcon')}</option>
            {AVAILABLE_ICONS.map(icon => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={save.isPending} className="w-full md:w-auto">
            {save.isPending ? <Loading size="sm" className="me-2" /> : null}
            {t('save')}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={reset} className="w-full md:w-auto">
              {tDash('cancel')}
            </Button>
          )}
        </div>
      </form>

      {/* Selected icon preview + list */}
      <div className="mt-8">
        {isPending ? (
          <LoadingRows rows={1} />
        ) : isError ? (
          <ErrorState message={error?.message} />
        ) : (
          <>
            {selectedIcon && (
              <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex size-6 items-center justify-center rounded bg-muted">{iconDecider(selectedIcon, 'size-4')}</span>
                {t('icon')}: {selectedIcon}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {socials?.map(social => (
                <Badge key={social._id} variant="outline" className="gap-2 px-3 py-1 text-sm">
                  {iconDecider(social.icon, 'size-4')}
                  {social.name}
                  <button
                    type="button"
                    aria-label={tDash('edit')}
                    className="rounded-sm opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => edit(social)}
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={tDash('delete')}
                    className="rounded-sm opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => social._id && setPendingDelete(social._id)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {(!socials || socials.length === 0) && <EmptyState text={t('noSocials')} />}
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={open => !open && setPendingDelete(null)}
        itemName={socials?.find(s => s._id === pendingDelete)?.name}
        onConfirm={() => {
          if (pendingDelete) deleteSocial(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </SectionShell>
  );
};

export default Socials;
