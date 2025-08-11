// Update the import path to the correct location of get-query-client
"use client";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { Fragment } from "react";

interface Props {
  children: React.ReactNode;
}
const DashboardProvider = ({ children }: Props) => {
  const queryClient = new QueryClient();

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Fragment>
  );
};

export default DashboardProvider;
