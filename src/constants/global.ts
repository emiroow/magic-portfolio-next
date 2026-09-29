import { FolderGit2, Home, NotebookText } from 'lucide-react';

/**
 * Primary dock navigation. Hrefs are locale-relative; the localized
 * `Link` wrapper prepends the active locale automatically. `label` is a key
 * under `navbar`.
 */
export const NavbarRoutes = () =>
  [
    { href: '/', icon: Home, label: 'home' },
    { href: '/projects', icon: FolderGit2, label: 'projects' },
    { href: '/blog', icon: NotebookText, label: 'blog' },
  ] as const;
