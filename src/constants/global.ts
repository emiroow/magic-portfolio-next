import { Home, NotebookText } from 'lucide-react';

/**
 * Primary dock navigation. Hrefs are locale-relative; the localized
 * `Link` wrapper prepends the active locale automatically.
 */
export const NavbarRoutes = () => [{ href: '/', icon: Home }, { href: '/blog', icon: NotebookText }] as const;
