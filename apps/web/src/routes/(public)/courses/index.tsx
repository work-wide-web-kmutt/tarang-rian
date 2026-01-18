import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CourseFilters } from "@/components/course/course-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { GenElectiveOption } from "@/course/schema";
import { useCourseFilters } from "@/hooks/use-course-filters";
import {
  useSelectedGenElectives,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

export const Route = createFileRoute("/(public)/courses/")({
  component: AllCoursesPage,
});

function AllCoursesPage() {
  const selected = useSelectedGenElectives();
  const { add, remove } = useSelectedGenElectivesActions();
  const { filters, setters, filteredCourses, totalCourses } =
    useCourseFilters();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-12 pb-20">
      <div className="sticky top-0 z-10 border-x-2 border-b-2 border-dashed bg-background pb-4">
        <div className="py-4">
          <Alert className="border-destructive" variant="destructive">
            <AlertTriangle />
            <AlertTitle>{t("courses.disclaimer_head")}</AlertTitle>
            <AlertDescription>
              {t("courses.disclaimer_text1")}{" "}
              <a
                href="https://www.facebook.com/genKMUTTofficial"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("courses.disclaimer_text2")}
              </a>{" "}
              {t("courses.disclaimer_text3")}
            </AlertDescription>
          </Alert>
        </div>

        <div className="mb-4">
          <h1 className="px-4 font-semibold text-3xl">
            {t("courses.courses")}
          </h1>
        </div>
        <div>
          <CourseFilters filters={filters} setters={setters} />
        </div>
        <p className="mt-4 px-4 text-muted-foreground text-sm">
          {t("courses.show")} {filteredCourses.length} {t("courses.of")}{" "}
          {totalCourses} {t("courses.courses")}
        </p>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
          <p className="font-bold text-muted-foreground">
            {t("courses.no_result")}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {filteredCourses.map((course) => {
            return (
              <section
                className="rounded-lg border border-x-0 p-4"
                key={course.slug}
              >
                <header className="mb-2 flex items-baseline justify-between gap-2">
                  <div>
                    <h2 className="font-medium text-lg">
                      {course.code} — {course.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {t("academic.year")} {course.year},{" "}
                      {t("academic.semester")} {course.semester}
                    </p>
                  </div>
                </header>

                <div className="mt-2">
                  <p className="font-medium text-sm">{t("academic.classes")}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.class.map(
                      (cls: GenElectiveOption["class"][number]) => {
                        const selectedSession = selected.find(
                          (s) =>
                            s.courseCode === course.code &&
                            s.group === cls.group &&
                            s.day === cls.day &&
                            s.start === cls.start &&
                            s.end === cls.end
                        );
                        const isClassSelected = selectedSession !== undefined;

                        return (
                          <Button
                            key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                            onClick={() => {
                              if (isClassSelected && selectedSession) {
                                remove(selectedSession.id);
                              } else {
                                add(course, cls);
                              }
                            }}
                            size="sm"
                            variant={isClassSelected ? "secondary" : "outline"}
                          >
                            {t(`days_short.${cls.day.toLowerCase()}`)}{" "}
                            {cls.start} - {cls.end}
                          </Button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Link params={{ id: course.slug }} to="/courses/$id">
                    <Button variant="outline">{t("courses.view")}</Button>
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
