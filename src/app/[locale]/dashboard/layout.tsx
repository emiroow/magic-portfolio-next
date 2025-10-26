import { getServerAuthSession } from "@/auth";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import DashboardProvider from "@/providers/dashboardProvider";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: `${t("dashboard.title")} | ${t("personalWebsite")}`,
  };
}

export default async function DashboardLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === "fa" ? "rtl" : "ltr";
  const messages: any = await getMessages();

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Require authentication
  const session = await getServerAuthSession();
  if (!session) {
    const callback = encodeURIComponent(`/${locale}/dashboard`);
    redirect(`/${locale}/auth?callbackUrl=${callback}`);
  }

  return (
    <div
      dir={direction}
      className={cn(
        `min-h-screen bg-background antialiased max-w-2xl mx-auto sm:py-12 px-6 ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      <DashboardProvider locale={locale} messages={messages}>
        {children}
      </DashboardProvider>
    </div>
  );
}
