import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SelectButton } from "@/components/class/select-button";
import { SelectDropdown } from "@/components/class/select-dropdown";
import { CourseFilters } from "@/components/course/course-filters";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import { NotFound } from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { useCourseFilters } from "@/hooks/use-course-filters";

export const Route = createFileRoute("/(public)/courses/")({
  component: AllCoursesPage,
});

function AllCoursesPage() {
  const { filters, setters, filteredCourses, totalCourses } =
    useCourseFilters();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-12 pb-20">
      <div className="sticky top-0 z-10 border-x-2 border-dashed bg-background pb-4 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <div className="py-4">
          <DisclaimerAlert />
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
        <NotFound className="mt-8" description={t("not_found.no_courses")} />
      ) : (
        <div className="mt-4 space-y-4">
          {filteredCourses.map((course) => (
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
                    {t("academic.year")} {course.year}, {t("academic.semester")}{" "}
                    {course.semester}
                  </p>
                </div>
              </header>

              <div className="mt-4 flex justify-end gap-2">
                {course.class.length === 1 ? (
                  <SelectButton cls={course.class[0]} course={course} />
                ) : (
                  <SelectDropdown course={course} />
                )}
                <Link params={{ id: course.slug }} to="/courses/$id">
                  <Button variant="outline">{t("courses.view")}</Button>
                </Link>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
