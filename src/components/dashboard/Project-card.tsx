'use client';

import { iconDecider } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import Loading from '@/components/ui/loading';
import type { IProject } from '@/types';
import { cn, projectKey } from '@/lib/utils';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ProjectItemProps {
  project: IProject;
  onEdit: (project: IProject) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

/** Dashboard list item for a single project. */
const ProjectCard = ({ project, onEdit, onDelete, isDeleting }: ProjectItemProps) => {
  const t = useTranslations('dashboard.projects');
  const locale = useLocale();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const key = projectKey(project);

  return (
    <Card className="transition-colors hover:border-foreground/30">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-4 sm:p-5">
        <div className="min-w-0 space-y-0.5">
          <h3 className="truncate text-sm font-semibold sm:text-base">{project.title}</h3>
          {project.dates && <p className="text-[11px] tabular-nums text-muted-foreground">{project.dates}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          {project.active && key && (
            <Link
              href={`/${locale}/projects/${key}`}
              target="_blank"
              aria-label={t('viewProject')}
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-8')}
            >
              <ExternalLink className="size-4" aria-hidden />
            </Link>
          )}
          <Button size="icon" variant="ghost" className="size-8" onClick={() => onEdit(project)} aria-label={t('edit')}>
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            aria-label={t('delete')}
          >
            {isDeleting ? <Loading size="sm" /> : <Trash2 className="size-4" aria-hidden />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="flex flex-col gap-4 sm:flex-row">
          {project.image && (
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg border sm:h-20 sm:w-32 sm:aspect-auto">
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 640px) 100vw, 128px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-3">
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{project.description}</p>

            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-0 text-[10px] font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={project.active ? 'default' : 'outline'} className="text-[10px]">
                {project.active ? t('active') : t('disabled')}
              </Badge>

              {project.links?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors hover:bg-foreground hover:text-background"
                      title={link.type}
                    >
                      {iconDecider(link.icon, 'size-3')}
                      {link.type}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        itemName={project.title}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(project._id!);
        }}
      />
    </Card>
  );
};

export default ProjectCard;
