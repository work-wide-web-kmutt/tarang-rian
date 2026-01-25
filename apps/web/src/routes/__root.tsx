import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "../index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// biome-ignore lint/suspicious/noEmptyInterface: TanStack Start genereted
export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Tarang Rian",
      },
      {
        name: "description",
        content: "Tarang Rian - Course management and planning platform",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Tarang Rian",
      },
      {
        property: "og:title",
        content: "Tarang Rian",
      },
      {
        property: "og:description",
        content: "Tarang Rian - Course management and planning platform",
      },
      {
        property: "og:image",
        content: "https://tarang-rian.dekcpe.link/static/og-image.png",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Tarang Rian",
      },
      {
        name: "twitter:description",
        content: "Tarang Rian - Course management and planning platform",
      },
      {
        name: "twitter:image",
        content: "https://tarang-rian.dekcpe.link/static/og-image.png",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/static/favicon/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/static/favicon/favicon.svg",
      },
      {
        rel: "shortcut icon",
        href: "/static/favicon/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/static/favicon/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/static/favicon/site.webmanifest",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="vite-ui-theme"
        >
          <div className="flex flex-col">
            <main className="flex-1">
              <div className="min-h-screen">
                <Outlet />
                <Toaster />
              </div>
            </main>
          </div>
        </ThemeProvider>
      </NuqsAdapter>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-left" />}
      {import.meta.env.DEV && <BreakpointIndicator />}
    </QueryClientProvider>
  );
}
