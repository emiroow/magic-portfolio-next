'use client';

import { QueryClient } from '@tanstack/react-query';

/** Shared react-query client (module singleton so it survives re-renders). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
