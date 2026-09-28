import { iconDecider } from '@/components/icons';
import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import type { IProfile, ISocial } from '@/types';

interface ContactProps {
  title: string;
  description: string;
  emailLabel: string;
  profile: IProfile;
  socials: ISocial[];
  delay?: number;
}

/** Call-to-action block: primary email button plus social shortcuts. */
export function Contact({ title, description, emailLabel, profile, socials, delay = 0 }: ContactProps) {
  const contacts = socials.filter(social => Boolean(social.url)).slice(0, 6);

  return (
    <section id="contact" className="pb-24">
      <SectionHeader label={title} title={title} description={description} delay={delay} />
      <BlurFade delay={delay + 0.08} inView>
        <div className="flex flex-wrap items-center gap-3">
          {profile.email && (
            <Button asChild size="lg" className="rounded-full">
              <a href={`mailto:${profile.email}`} aria-label={`${emailLabel}: ${profile.email}`}>
                <Mail className="me-2 h-4 w-4" />
                {emailLabel}
              </a>
            </Button>
          )}
          {contacts.map(social => (
            <Button key={social._id ?? social.name} asChild variant="outline" size="lg" className="rounded-full">
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                {iconDecider(social.icon, 'me-2 h-4 w-4')}
                {social.name}
              </a>
            </Button>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
