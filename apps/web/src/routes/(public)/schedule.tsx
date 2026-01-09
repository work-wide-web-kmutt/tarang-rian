import { createFileRoute, Link } from "@tanstack/react-router";
import { Schedule } from "@/components/schedule";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useSelectedGenElectives } from "@/stores/selected";

export const Route = createFileRoute("/(public)/schedule")({
  component: SelectedCoursesPage,
});

function SelectedCoursesPage() {
  const selected = useSelectedGenElectives();

  return (
    <div className="container mx-auto min-w-0 max-w-7xl px-4 py-4">
      <div className="mb-4 flex justify-between">
        <Link to="..">
          <Button className="mb-2" variant="outline">
            Go Back
          </Button>
        </Link>
        <ThemeSwitcher />
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="w-fit min-w-0 overflow-x-auto">
          <Schedule sessions={selected} />
        </div>
      </div>
    </div>
  );
}
