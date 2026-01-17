import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div
      className={cn(
        "relative min-h-dvh bg-center bg-cover bg-no-repeat",
        // "bg-[url('/static/backgrounds/home-light-mode.webp')]",
        // "dark:bg-[url('/static/backgrounds/home-dark-mode.webp')]",
        "before:absolute before:inset-0 before:bg-background/85"
      )}
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="w-full border-border border-t-2 border-dashed py-4">
          <div className="container mx-auto max-w-8xl px-16">
            <Logo size="2xl" />
          </div>
        </div>
        <div className="w-full border-border border-y-2 border-dashed py-4">
          <div className="container mx-auto max-w-8xl px-16">
            <div className="text-4xl">LET'S PLAN BEFORE</div>
            <div className="font-bold text-4xl">THE RACE START.</div>
          </div>
        </div>
        <div className="w-full">
          <div className="container mx-auto flex max-w-8xl gap-2 px-16 py-4">
            <Link to="/courses">
              <Button size="lg">Checkout the courses.</Button>
            </Link>
            <Link to="/schedule">
              <Button size="lg" variant="secondary">
                Plan the schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container relative z-0 mx-auto h-dvh max-w-8xl bg-background px-12">
        <div className="h-full w-full border-2 border-border border-dashed" />
      </div>
    </div>
  );
}
