"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const BLUR_FADE_DELAY = 0.04;

export default function ResetPasswordPage() {
  const t = useTranslations("auth.reset");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!email) return setIsLoading(false);
    try {
      await fetch(`/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setMessage(t("emailSent"));
    } catch (e) {
      setMessage(t("emailSent"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative flex min-h-screen items-center justify-center">
      <BlurFade
        className="w-full flex justify-center items-center"
        delay={BLUR_FADE_DELAY}
      >
        <Card className="w-[80%] max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-background/70 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left visual panel (desktop only) */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-muted/10 border-r border-border/50">
              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold">
                  {t("title")}
                </CardTitle>
                <CardDescription className="text-sm max-w-sm mx-auto">
                  {t("subtitle")}
                </CardDescription>
              </div>
            </div>

            {/* Right form panel */}
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <div className="md:hidden mb-4 text-center space-y-1.5">
                <CardTitle className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
                  {t("title")}
                </CardTitle>
                <CardDescription className="mx-auto max-w-xs text-xs sm:text-sm text-muted-foreground">
                  {t("subtitle")}
                </CardDescription>
              </div>

              <BlurFade delay={BLUR_FADE_DELAY * 4}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="h-11 rounded-lg"
                      aria-label={t("email")}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg py-3"
                    size="lg"
                  >
                    {isLoading ? t("sending") : t("sendLink")}
                  </Button>

                  {message && (
                    <div className="text-center space-y-1 pt-1">
                      <p className="text-sm font-medium">{t("successTitle")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("successDesc")}
                      </p>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <Link
                      href={`/${locale}/auth`}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      {t("backToLogin")}
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {t("demoNote")}
                  </p>
                </form>
              </BlurFade>
            </div>
          </div>
        </Card>
      </BlurFade>
    </div>
  );
}
