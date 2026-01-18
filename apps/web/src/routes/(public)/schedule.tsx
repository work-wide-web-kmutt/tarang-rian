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
    <div className="container mx-auto px-12 pb-20">
      <div className="relative flex w-full justify-end gap-2 border-dashed pb-4 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <ScheduleImportDialog />
        <ScheduleExportDialog />
      </div>
      <div className="relative flex w-full items-center justify-center px-2 pb-0.5 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <div className="min-w-0 overflow-x-auto">
          <Schedule
            sessions={selected}
            size="md"
            styles={{
              borderTop: "border-t-0",
              borderBottom: "border-b-0",
            }}
          />
        </div>
      </div>
    </div>
  );
}
