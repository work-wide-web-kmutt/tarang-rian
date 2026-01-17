import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Route = createFileRoute("/(public)")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="relative min-h-dvh">
      <div className="absolute inset-x-0 top-0 bottom-0 z-0">
        <div className="container mx-auto h-full max-w-8xl bg-background px-12">
          <div className="h-full w-full border-border border-x-2 border-dashed" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="w-full">
          <div className="container mx-auto flex h-fit w-full max-w-8xl items-center justify-between px-16 py-3">
            <Logo size="sm" />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="w-full border-border border-t-2 border-dashed">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
