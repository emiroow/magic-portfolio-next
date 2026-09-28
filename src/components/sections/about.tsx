import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import Markdown from 'react-markdown';

interface AboutProps {
  title: string;
  description?: string;
  delay?: number;
}

/** Long-form bio rendered from Markdown. */
export function About({ title, description, delay = 0 }: AboutProps) {
  if (!description) return null;

  return (
    <section id="about" aria-labelledby="about-heading">
      <SectionHeader title={title} delay={delay} />
      <BlurFade delay={delay + 0.08}>
        <Markdown className="prose max-w-full text-pretty text-sm text-muted-foreground dark:prose-invert prose-p:leading-relaxed">
          {description}
        </Markdown>
      </BlurFade>
    </section>
  );
}
