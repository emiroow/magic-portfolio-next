'use client';

import { EmptyState, ErrorState, LoadingRows, SectionShell } from '@/components/dashboard/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import useSkills from '@/hooks/dashboard/useSkills';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/** Skills section: add skills one by one, delete with confirmation. */
const Skills = () => {
  const t = useTranslations('dashboard.skill');
  const { skills, isPending, isError, error, addSkill, adding, deleteSkill, refetchSkills } = useSkills();

  const [name, setName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value || adding) return;
    addSkill(value);
    setName('');
  };

  return (
    <SectionShell title={t('title')}>
      <form onSubmit={submit} className="flex gap-2">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('inputPlaceholder')} aria-label={t('inputPlaceholder')} className="max-w-sm" />
        <Button type="submit" disabled={!name.trim() || adding} className="shrink-0">
          <Plus className="me-1 h-4 w-4" />
          {t('add')}
        </Button>
      </form>

      <div className="mt-6">
        {isPending ? (
          <LoadingRows rows={1} />
        ) : isError ? (
          <ErrorState message={error?.message} onRetry={() => refetchSkills()} />
        ) : skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge
                key={skill._id}
                variant="outline"
                className="px-3 py-1 text-sm"
                onDelete={() => skill._id && setPendingDelete(skill._id)}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        ) : (
          <EmptyState text={t('noSkills')} />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={open => !open && setPendingDelete(null)}
        itemName={skills?.find(s => s._id === pendingDelete)?.name}
        onConfirm={() => {
          if (pendingDelete) deleteSkill(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </SectionShell>
  );
};

export default Skills;
