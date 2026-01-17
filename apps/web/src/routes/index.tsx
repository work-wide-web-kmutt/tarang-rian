import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundSrc =
    mounted && resolvedTheme === "dark"
      ? "/static/backgrounds/home-dark-mode.webp"
      : "/static/backgrounds/home-light-mode.webp";

  return (
    <div className="relative min-h-dvh">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="w-full border-border border-t-2 border-dashed">
          <div className="container mx-auto max-w-8xl px-12">
            {mounted && (
              <div className="overflow-hidden rounded-lg border-2 border-border border-dashed">
                {/* biome-ignore lint/correctness/useImageSize: responsive background image */}
                <img
                  alt=""
                  className="max-h-80 w-full object-cover object-center"
                  src={backgroundSrc}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full border-border border-t-2 border-dashed py-6">
          <div className="container mx-auto max-w-8xl px-18">
            <Logo size="2xl" />
          </div>
        </div>
        <div className="w-full border-border border-y-2 border-dashed py-6">
          <div className="container mx-auto max-w-8xl px-18">
            <div className="text-4xl">LET'S PLAN BEFORE</div>
            <div className="font-bold text-4xl">THE RACE START.</div>
          </div>
        </div>
        <div className="w-full">
          <div className="container mx-auto flex max-w-8xl gap-2 px-18 py-6">
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
