'use client';

import { Dock, DockIcon } from '@/components/magicui/dock';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NavbarRoutes } from '@/constants/global';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { ModeToggle } from '../mode-toggle';
import ThemeToggle from '../theme-toggle';

/** Floating dashboard dock: navigation, logout, language and theme. */
const Footer = () => {
  const t = useTranslations('navbar');
  const td = useTranslations('dashboard');
  const locale = useLocale();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-30 mx-auto flex h-full max-h-14 origin-bottom justify-center pb-1">
      <div className="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent [-webkit-mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-lg" />
      <Dock
        magnification={110}
        distance={40}
        className="pointer-events-auto relative z-50 flex min-h-full items-center gap-1 rounded-2xl border bg-background px-2 shadow-lg"
      >
        {NavbarRoutes().map(item => {
          const { href, icon: Icon } = item;
          const label = href === '/' ? t('home') : t('blog');
          return (
            <DockIcon key={href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={href} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} aria-label={label}>
                    <Icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}

        <Separator orientation="vertical" className="!my-2 !h-auto" />

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={async () => {
                  // Stay on the current origin: NextAuth would otherwise
                  // honor NEXTAUTH_URL for the post-signout redirect.
                  await signOut({ redirect: false });
                  window.location.href = `/${locale}`;
                }}
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
                aria-label={td('logout')}
              >
                <LogOut className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{td('logout')}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>

        <Separator orientation="vertical" className="!my-2 !h-auto" />

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('language')}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('theme')}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
};

export default Footer;
