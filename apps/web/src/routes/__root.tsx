import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { ThemeProvider } from "@/components/theme-provider";

import "../index.css";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";

// biome-ignore lint/suspicious/noEmptyInterface: TanStack Start genereted
export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "tarang-rian",
      },
      {
        name: "description",
        content: "tarang-rian is a web application",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Tarang Rian",
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
    <>
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
              </div>
            </main>
          </div>
        </ThemeProvider>
      </NuqsAdapter>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-left" />}
      {import.meta.env.DEV && <BreakpointIndicator />}
    </>
  );
}
