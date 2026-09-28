/**
 * Public site layout: constrains content width and applies the shared page
 * rhythm (`.site-shell`), including clearance for the floating navbar.
 * Locale validation and providers come from `[locale]/layout.tsx`.
 */
export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell max-w-4xl">{children}</div>;
}
