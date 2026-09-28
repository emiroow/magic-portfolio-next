'use client';

import { iconDecider } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import Loading from '@/components/ui/loading';
import type { IProject } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-3 sm:p-4">
        <div className="min-w-0 space-y-0.5">
          <h4 className="truncate text-base font-semibold">{project.title}</h4>
          {project.dates && <p className="text-xs text-muted-foreground">{project.dates}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon" variant="ghost" className="size-8" onClick={() => onEdit(project)} aria-label={t('edit')}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="size-8" onClick={() => setConfirmOpen(true)} disabled={isDeleting} aria-label={t('delete')}>
            {isDeleting ? <Loading size="sm" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
        <div className="flex flex-col gap-3 sm:flex-row">
          {project.image && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border">
              <Image src={project.image} alt={project.title} fill sizes="128px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={project.active ? 'default' : 'outline'}>{project.active ? t('active') : t('disabled')}</Badge>

              {project.links?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs transition-colors hover:bg-muted/70"
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
