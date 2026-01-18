import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CourseFilters } from "@/components/course/course-filters";
import { Schedule } from "@/components/schedule";
import { ScheduleExportDialog } from "@/components/schedule/export/export-dialog";
import { ScheduleImportDialog } from "@/components/schedule/export/import-dialog";
import { SelectedCourseCard } from "@/components/schedule/selected-course-card";
import { useCourseFilters } from "@/hooks/use-course-filters";
import { useSelectedGenElectives } from "@/stores/selected";

export const Route = createFileRoute("/(public)/schedule")({
  component: SelectedCoursesPage,
});

function SelectedCoursesPage() {
  const selected = useSelectedGenElectives();
  const { filters, setters, filteredSessions, totalSessions } =
    useCourseFilters({ showYearSemester: false });
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

      <div className="mt-4">
        <CourseFilters
          filters={filters}
          setters={setters}
          showYearSemester={false}
        />
        <p className="mt-4 px-4 text-muted-foreground text-sm">
          {t("courses.show")} {filteredSessions.length} {t("courses.of")}{" "}
          {totalSessions} {t("courses.courses")}
        </p>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
          <p className="font-bold text-muted-foreground">
            {t("courses.no_result")}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {filteredSessions.map((session) => (
            <SelectedCourseCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
