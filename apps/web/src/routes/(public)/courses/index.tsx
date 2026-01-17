import { createFileRoute, Link } from "@tanstack/react-router";
import { allCourses } from "content-collections";
import { AlertTriangle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { CourseFilters } from "@/components/course/course-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );
  const [dayFilter, setDayFilter] = useQueryState(
    "day",
    parseAsString.withDefault("all")
  );
  const [timeSlotFilter, setTimeSlotFilter] = useQueryState(
    "time",
    parseAsString.withDefault("all")
  );

  const sortedCourses = [...allCourses].sort((a, b) => {
    if (a.year === b.year) {
      if (a.semester === b.semester) {
        return a.code.localeCompare(b.code);
      }
      return a.semester.localeCompare(b.semester);
    }
    return a.year.localeCompare(b.year);
  });

  const filteredCourses = useMemo(() => {
    return sortedCourses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        course.code.toLowerCase().includes(searchLower) ||
        course.name.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }

      const matchesDay =
        dayFilter === "all" ||
        course.class.some((cls) => cls.day === dayFilter);

      if (!matchesDay) {
        return false;
      }

      const matchesTimeSlot =
        timeSlotFilter === "all" ||
        course.class.some((cls) => {
          const startHour = Number.parseInt(cls.start.split(":")[0], 10);
          if (timeSlotFilter === "morning") {
            return startHour < 12;
          }
          if (timeSlotFilter === "afternoon") {
            return startHour >= 12;
          }
          return true;
        });

      return matchesTimeSlot;
    });
  }, [sortedCourses, searchQuery, dayFilter, timeSlotFilter]);

  return (
    <div className="container mx-auto px-20 py-4">
      <Alert className="mb-4" variant="destructive">
        <AlertTriangle />
        <AlertTitle>Course Information Disclaimer</AlertTitle>
        <AlertDescription>
          Course information displayed here may not be accurate. Always verify
          details by checking{" "}
          <a
            href="https://www.facebook.com/genKMUTTofficial"
            rel="noopener noreferrer"
            target="_blank"
          >
            the official Facebook page
          </a>{" "}
          and official course documents.
        </AlertDescription>
      </Alert>
      <div className="mb-4">
        <h1 className="font-semibold text-3xl">Courses</h1>
      </div>

      <CourseFilters
        dayFilter={dayFilter}
        onDayChange={setDayFilter}
        onSearchChange={setSearchQuery}
        onTimeSlotChange={setTimeSlotFilter}
        searchQuery={searchQuery}
        timeSlotFilter={timeSlotFilter}
      />

      {filteredCourses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No courses found matching your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Showing {filteredCourses.length} of {sortedCourses.length} courses
          </p>
          {filteredCourses.map((course) => {
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
      )}
    </div>
  );
}
