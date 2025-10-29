import { getServerAuthSession } from "@/config/auth";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/authProvider";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: `${t("dashboard.title")} | ${t("personalWebsite")}`,
  };
}

export default async function AuthLayout({
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
  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div
      dir={direction}
      className={cn(
        `bg-background antialiased ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      <AuthProvider locale={locale} messages={messages}>
        {children}
      </AuthProvider>
    </div>
  );
}
