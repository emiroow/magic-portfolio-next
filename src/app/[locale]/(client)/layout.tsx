/**
 * Public site layout: constrains content width.
 * Locale validation and providers come from `[locale]/layout.tsx`.
 */
export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto min-h-screen w-full max-w-3xl px-5 py-6 sm:px-6 sm:py-12">{children}</div>;
}
