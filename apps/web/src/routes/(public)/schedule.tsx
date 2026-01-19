import NumberFlow from "@number-flow/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CourseFilters } from "@/components/course/course-filters";
import { NotFound } from "@/components/not-found";
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

  const totalHours = useMemo(() => {
    return selected.reduce((acc, session) => {
      const [startH, startM] = session.start.split(":").map(Number);
      const [endH, endM] = session.end.split(":").map(Number);
      const hours = endH - startH + (endM - startM) / 60;
      return acc + hours;
    }, 0);
  }, [selected]);

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
      <div className="relative flex w-full items-stretch justify-between border-dashed after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <h1 className="flex items-center pl-4 font-semibold text-xl md:text-2xl">
          {t("nav.selected_classes")}
        </h1>
        <div className="flex items-center pr-4">
          <div className="flex size-18 flex-col items-center justify-center border border-y-0 border-r-0">
            <NumberFlow
              className="font-bold text-2xl tabular-nums"
              value={selected.length}
            />
            <span className="text-muted-foreground text-xs">
              {t("courses.courses")}
            </span>
          </div>
          <div className="flex size-18 flex-col items-center justify-center border border-y-0">
            <NumberFlow
              className="font-bold text-2xl tabular-nums"
              value={totalHours}
            />
            <span className="text-muted-foreground text-xs">
              {t("academic.hours")}
            </span>
          </div>
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

      <div className="relative flex w-full items-stretch justify-between border-dashed after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        {filteredSessions.length === 0 ? (
          <div className="flex w-full items-center justify-center">
            <NotFound
              className="my-8"
              description={
                selected.length === 0
                  ? t("not_found.no_selected_classes")
                  : t("not_found.no_courses")
              }
            />
          </div>
        ) : (
          <div className="my-4 w-full space-y-4">
            {filteredSessions.map((session) => (
              <SelectedCourseCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
