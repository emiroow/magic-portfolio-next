/** Projects layout: archive and project pages share the site rhythm. */
export default function ProjectsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell max-w-4xl">{children}</div>;
}
