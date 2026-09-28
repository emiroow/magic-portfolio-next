/** Blog layout: narrower measure for long-form reading, same page rhythm. */
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell max-w-3xl">{children}</div>;
}
