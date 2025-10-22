"use client";

import { Icons } from "@/components/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { ModeToggle } from "@/components/mode-toggle";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const BLUR_FADE_DELAY = 0.04;

const AuthPage = () => {
  const t = useTranslations("auth.login");
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement authentication logic
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="w-full relative flex min-h-screen items-center justify-center">
      {/* Theme and Language Toggle - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ModeToggle />
        <ThemeToggle />
      </div>

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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="h-11 rounded-lg"
                      aria-label={t("email")}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm">
                        {t("password")}
                      </Label>
                      <Link
                        href={`/${locale}/reset-password`}
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("passwordPlaceholder")}
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                        className={`h-11 rounded-lg ${
                          locale === "fa" ? "pl-12" : "pr-12"
                        }`}
                        aria-label={t("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={`absolute inset-y-0 ${
                          locale === "fa" ? "left-2" : "right-2"
                        } my-auto inline-flex h-8 items-center rounded-md px-2 text-xs text-muted-foreground hover:text-foreground`}
                        aria-label={
                          showPassword ? t("hidePassword") : t("showPassword")
                        }
                        tabIndex={-1}
                      >
                        {showPassword ? t("hide") : t("show")}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="remember"
                      className="flex cursor-pointer select-none items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disabled={isLoading}
                      />
                      <span className="font-normal">{t("rememberMe")}</span>
                    </label>
                    <span className="text-xs text-muted-foreground" aria-hidden>
                      {/* reserved for notices */}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-lg py-3"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                        <span>{t("loggingIn")}</span>
                      </span>
                    ) : (
                      t("loginButton")
                    )}
                  </Button>
                </form>
              </BlurFade>
            </div>
          </div>
        </Card>
      </BlurFade>
    </div>
  );
};

export default AuthPage;
