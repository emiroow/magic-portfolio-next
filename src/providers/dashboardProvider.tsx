// Update the import path to the correct location of get-query-client
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes"; // Add this import if you use next-themes
import React, { Fragment } from "react";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}
const DashboardProvider = ({ children }: Props) => {
  const queryClient = new QueryClient();
  const locale = useLocale();
  const { theme } = useTheme(); // Get the current theme
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <main>{children}</main>
        <Toaster theme={theme as "light" | "dark" | "system" | undefined} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Fragment>
  );
};

export default DashboardProvider;
