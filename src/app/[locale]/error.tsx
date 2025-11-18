"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations?.("ErrorPage") || ((k: string) => k);
  const router = useRouter();
  const params = useParams();
  const locale = (params as any)?.locale || "en";

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-lg border bg-background/80 p-6 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          {t("title") || "Something went wrong"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("description") || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => router.push(`/${locale}`)}>
            {t("goHome") || "Home"}
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            {t("tryAgain") || "Try again"}
          </Button>
        </div>
      </div>
    </main>
  );
}
