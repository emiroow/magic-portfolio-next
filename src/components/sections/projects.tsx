import { ProjectCard } from '@/components/project-card';
import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import type { IProject } from '@/types';

interface ProjectsProps {
  label: string;
  title: string;
  description: string;
  projects: IProject[];
  delay?: number;
}

/** Grid of active portfolio projects. */
export function Projects({ label, title, description, projects, delay = 0 }: ProjectsProps) {
  const active = projects.filter(project => project.active);
  if (!active.length) return null;

  return (
    <section id="projects">
      <SectionHeader label={label} title={title} description={description} delay={delay} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {active.map((project, id) => (
          <BlurFade key={project._id ?? `${project.title}-${id}`} delay={delay + 0.06 + id * 0.05} inView>
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              links={project.links}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
