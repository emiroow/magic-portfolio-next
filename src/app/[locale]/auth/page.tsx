'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/** Sign-in page for the single-admin dashboard. */
const AuthPage = () => {
  const t = useTranslations('auth.login');
  const { handleSubmit, register, onSubmit, errors, isPending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="w-full max-w-sm">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">{t('title')}</CardTitle>
          <CardDescription className="text-sm">{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {errors.root?.message && (
              <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {errors.root.message}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                placeholder={t('emailPlaceholder')}
                disabled={isPending}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  dir="ltr"
                  placeholder={t('passwordPlaceholder')}
                  disabled={isPending}
                  aria-invalid={Boolean(errors.password)}
                  className="pe-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 end-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="me-2 size-4 animate-spin" />
                  {t('loggingIn')}
                </>
              ) : (
                t('loginButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthPage;
