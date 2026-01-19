import { createFileRoute } from "@tanstack/react-router";
import { Schedule } from "@/components/schedule";
import { ScheduleExportDialog } from "@/components/schedule/export/export-dialog";
import { ScheduleImportDialog } from "@/components/schedule/export/import-dialog";
import { useSelectedGenElectives } from "@/stores/selected";

export const Route = createFileRoute("/(public)/schedule")({
  component: SelectedCoursesPage,
});

function SelectedCoursesPage() {
  const selected = useSelectedGenElectives();

  return (
    <div className="container mx-auto min-w-0 max-w-7xl space-y-4 px-4 py-4">
      <div className="flex w-full justify-end gap-2">
        <ScheduleImportDialog />
        <ScheduleExportDialog />
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="w-fit min-w-0 overflow-x-auto">
          <Schedule sessions={selected} />
        </div>
      </div>
    </div>
  );
}
