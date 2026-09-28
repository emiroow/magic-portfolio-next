import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader, type SectionHeadingProps } from '@/components/sections/section-header';
import { ProjectCard } from '@/components/project-card';
import { cn } from '@/lib/utils';
import type { IProject } from '@/types';

interface ProjectsProps extends SectionHeadingProps {
  projects: IProject[];
  delay?: number;
}

/** Grid of the active portfolio projects. */
export function Projects({ index, label, title, description, meta, projects, delay = 0 }: ProjectsProps) {
  const active = projects.filter(project => project.active);
  if (!active.length) return null;

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
      <div className={cn('grid grid-cols-1 gap-4 sm:gap-5', active.length > 1 && 'sm:grid-cols-2')}>
        {active.map((project, id) => (
          <BlurFade key={project._id ?? `${project.title}-${id}`} delay={delay + 0.06 + id * 0.05} inView className="h-full">
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              links={project.links}
              className="h-full"
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
