"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./header/theme-provider";
import { SidebarProvider } from "../ui/sidebar";

const AllProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider
          defaultOpen={false}
          style={
            {
              "--sidebar-width": "30rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }>
          {children}
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AllProviders;
