import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function BlogLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
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
        `min-h-screen bg-background antialiased max-w-2xl mx-auto py-5 sm:py-12 px-6 ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
