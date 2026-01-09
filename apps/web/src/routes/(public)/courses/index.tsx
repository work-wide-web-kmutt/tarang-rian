import { createFileRoute, Link } from "@tanstack/react-router";
import { allCourses } from "content-collections";
import { Button } from "@/components/ui/button";
import type { GenElectiveOption } from "@/course/schema";
import { formatDayShort } from "@/lib/formatter/day-short";
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

  const sortedCourses = [...allCourses].sort((a, b) => {
    if (a.year === b.year) {
      if (a.semester === b.semester) {
        return a.code.localeCompare(b.code);
      }
      return a.semester.localeCompare(b.semester);
    }
    return a.year.localeCompare(b.year);
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      <div className="mb-4">
        <Link className="" to="..">
          <Button className="mb-2" variant="outline">
            Go Back
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">All GEN Courses</h1>
        <p className="text-muted-foreground">
          Listing all General Education elective courses from content
          collections.
        </p>
      </div>

      <div className="space-y-4">
        {sortedCourses.map((course) => {
          return (
            <section
              className="rounded-lg border p-4 shadow-sm"
              key={course.slug}
            >
              <header className="mb-2 flex items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-medium text-lg">
                    {course.code} — {course.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Year {course.year}, Semester {course.semester}
                  </p>
                </div>
                <p className="font-medium text-muted-foreground text-sm">
                  {course.instructor}
                </p>
              </header>

              <div className="mt-2">
                <p className="font-medium text-sm">Classes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {course.class.map(
                    (cls: GenElectiveOption["class"][number]) => {
                      const isClassSelected = selected.some(
                        (s) =>
                          s.courseCode === course.code &&
                          s.group === cls.group &&
                          s.day === cls.day &&
                          s.start === cls.start &&
                          s.end === cls.end
                      );

                      return (
                        <Button
                          key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                          onClick={() => {
                            if (isClassSelected) {
                              remove(
                                course.code,
                                cls.group,
                                cls.day,
                                cls.start,
                                cls.end
                              );
                            } else {
                              add(course, cls);
                            }
                          }}
                          size="sm"
                          variant={isClassSelected ? "secondary" : "outline"}
                        >
                          {formatDayShort(cls.day)} {cls.start} - {cls.end}
                        </Button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Link params={{ id: course.slug }} to="/courses/$id">
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
