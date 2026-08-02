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

import "@/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type -- TanStack Start generated
export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    links: [
      {
        href: "/static/favicon/favicon-96x96.png",
        rel: "icon",
        sizes: "96x96",
        type: "image/png",
      },
      {
        href: "/static/favicon/favicon.svg",
        rel: "icon",
        type: "image/svg+xml",
      },
      {
        href: "/static/favicon/favicon.ico",
        rel: "shortcut icon",
      },
      {
        href: "/static/favicon/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      {
        href: "/static/favicon/site.webmanifest",
        rel: "manifest",
      },
    ],
    meta: [
      {
        title: "Tarang Rian",
      },
      {
        content: "Tarang Rian - Course management and planning platform",
        name: "description",
      },
      {
        content: "Tarang Rian",
        name: "apple-mobile-web-app-title",
      },
      {
        content: "Tarang Rian",
        property: "og:title",
      },
      {
        content: "Tarang Rian - Course management and planning platform",
        property: "og:description",
      },
      {
        content: "https://tarang-rian.dekcpe.link/static/og-image.png",
        property: "og:image",
      },
      {
        content: "website",
        property: "og:type",
      },
      {
        content: "summary_large_image",
        name: "twitter:card",
      },
      {
        content: "Tarang Rian",
        name: "twitter:title",
      },
      {
        content: "Tarang Rian - Course management and planning platform",
        name: "twitter:description",
      },
      {
        content: "https://tarang-rian.dekcpe.link/static/og-image.png",
        name: "twitter:image",
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
