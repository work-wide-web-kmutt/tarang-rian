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
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

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
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
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
            <Header />
            <main className="flex-1">
              <div className="min-h-screen">
                <Outlet />
              </div>
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </NuqsAdapter>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-left" />}
      {import.meta.env.DEV && <BreakpointIndicator />}
    </>
  );
}
