import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import DashboardProvider from "@/providers/dashboardProvider";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: `${t("dashboard.title")} | ${t("personalWebsite")}`,
  };
}

export default function DashboardLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === "fa" ? "rtl" : "ltr";

  if (!routing.locales.includes(locale as any)) {
    notFound();
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
      <DashboardProvider>{children}</DashboardProvider>
    </div>
  );
}
