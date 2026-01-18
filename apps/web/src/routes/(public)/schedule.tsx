import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Schedule } from "@/components/schedule";
import { ScheduleExportDialog } from "@/components/schedule/export/export-dialog";
import { ScheduleImportDialog } from "@/components/schedule/export/import-dialog";
import { useSelectedGenElectives } from "@/stores/selected";

export const Route = createFileRoute("/(public)/schedule")({
  component: SelectedCoursesPage,
});

function SelectedCoursesPage() {
  const selected = useSelectedGenElectives();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-12 pb-20">
      <div className="relative flex w-full items-stretch justify-between border-dashed after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <h1 className="flex items-center px-4 font-semibold text-3xl">
          {t("nav.schedule")}
        </h1>
        <div className="flex gap-2">
          <ScheduleImportDialog />
          <ScheduleExportDialog triggerClassName="h-18 border-0 mx-0.5 border-l-1" />
        </div>
      </div>
      <div className="relative flex w-full items-center justify-center px-2 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
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
