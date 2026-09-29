import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader, type SectionHeadingProps } from '@/components/sections/section-header';
import { ProjectCard } from '@/components/project-card';
import { buttonVariants } from '@/components/ui/button';
import { cn, projectKey } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { IProject } from '@/types';

/**
 * Projects shown before the archive link. Three fills the home section
 * without turning it into the archive itself; the fourth and beyond move
 * to `/projects`, and the link below carries the remainder.
 */
const PREVIEW_COUNT = 3;

interface ProjectsProps extends SectionHeadingProps {
  projects: IProject[];
  /** Active locale, used to build the localized project-page links. */
  locale: string;
  /** Label for the external-visit chip on each card. */
  liveLabel: string;
  /** Label for the archive link. */
  viewAllLabel: string;
  delay?: number;
}

/** Grid of the active portfolio projects, capped to a preview set. */
export function Projects({
  index,
  label,
  title,
  description,
  meta,
  projects,
  locale,
  liveLabel,
  viewAllLabel,
  delay = 0,
}: ProjectsProps) {
  const active = projects.filter(project => project.active);
  if (!active.length) return null;

  const preview = active.slice(0, PREVIEW_COUNT);

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <SectionHeader
        index={index}
        label={label}
        title={title}
        description={description}
        meta={meta}
        id="projects-heading"
        delay={delay}
      />
      {/* A lone project spans the full measure instead of leaving a dead half. */}
      <div className={cn('grid grid-cols-1 gap-4 sm:gap-5', preview.length > 1 && 'sm:grid-cols-2')}>
        {preview.map((project, id) => (
          <BlurFade key={project._id ?? `${project.title}-${id}`} delay={delay + 0.06 + id * 0.05} inView className="h-full">
            <ProjectCard
              href={project.href}
              detailHref={projectKey(project) ? `/${locale}/projects/${projectKey(project)}` : undefined}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              links={project.links}
              liveLabel={liveLabel}
              priority={id === 0}
              sizes="(max-width: 640px) 100vw, 414px"
              className="h-full"
            />
          </BlurFade>
        ))}
      </div>

      {active.length > PREVIEW_COUNT && (
        <BlurFade delay={delay + 0.1} inView>
          <div className="mt-6 flex justify-center">
            <Link href={`/${locale}/projects`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-full')}>
              {viewAllLabel}
              <ArrowRight className="ms-2 size-3.5 rtl:-scale-x-100" aria-hidden />
            </Link>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
