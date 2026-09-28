'use client';

/**
 * Thin fetch wrapper for dashboard API calls.
 *
 * - Unwraps the server's `{ data } | { error }` envelope.
 * - Sends JSON by default; pass a `FormData` body to upload files.
 * - On 401 it redirects to the locale-aware sign-in page.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;

  const res = await fetch(path, {
    ...init,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...init.headers,
    },
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    const locale = window.location.pathname.split('/')[1] === 'fa' ? 'fa' : 'en';
    window.location.href = `/${locale}/auth?callbackUrl=${encodeURIComponent(window.location.href)}`;
    throw new Error('Unauthorized');
  }

  const payload = (await res.json().catch(() => ({}))) as { data?: T; error?: string };

  if (!res.ok) {
    throw new Error(payload.error || `Request failed with status ${res.status}`);
  }

  return payload.data as T;
}

/** Convenience helpers. */
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) => apiFetch<T>(path, { method: 'POST', body: formData }),
};
