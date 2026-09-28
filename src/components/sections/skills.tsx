import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import { Badge } from '@/components/ui/badge';
import type { ISkill } from '@/types';

interface SkillsProps {
  title: string;
  skills: ISkill[];
  delay?: number;
}

/** Flat list of skill badges. */
export function Skills({ title, skills, delay = 0 }: SkillsProps) {
  if (!skills.length) return null;

  return (
    <section id="skills" className="flex min-h-0 flex-col gap-y-3">
      <SectionHeader title={title} delay={delay} />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, id) => (
          <BlurFade key={skill._id ?? `${skill.name}-${id}`} delay={delay + 0.06 + id * 0.03}>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {skill.name}
            </Badge>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
