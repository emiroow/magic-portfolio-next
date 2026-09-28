/** Blog layout: constrains content width for list and post pages. */
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto min-h-screen w-full max-w-3xl px-5 py-6 sm:px-6 sm:py-12">{children}</div>;
}
