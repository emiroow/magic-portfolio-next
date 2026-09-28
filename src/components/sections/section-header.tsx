import BlurFade from '@/components/magicui/blur-fade';

interface SectionHeaderProps {
  /** Small uppercase eyebrow line above the title. */
  label?: string;
  /** Main section title. */
  title: string;
  /** Optional supporting description. */
  description?: string;
  /** Stagger offset for the entrance animation. */
  delay?: number;
}

/**
 * Consistent monochrome section header used by every home-page section:
 * an uppercase eyebrow, a bold title and an optional description.
 */
export function SectionHeader({ label, title, description, delay = 0 }: SectionHeaderProps) {
  return (
    <BlurFade delay={delay}>
      <header className="mb-6 space-y-2">
        {label && (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        )}
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">{title}</h2>
        {description && <p className="max-w-[600px] text-sm text-muted-foreground md:text-base">{description}</p>}
      </header>
    </BlurFade>
  );
}
