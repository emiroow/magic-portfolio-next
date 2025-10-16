import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import ClientProvider from "@/providers/clientProvider";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function ClientLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === "fa" ? "rtl" : "ltr";
  // Load messages to ensure client translations are available
  await getMessages();
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div
      dir={direction}
      className={cn(
        `min-h-screen bg-background antialiased max-w-2xl mx-auto py-12 sm:py-12 px-6 ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      <ClientProvider locale={locale}>{children}</ClientProvider>
    </div>
  );
}
