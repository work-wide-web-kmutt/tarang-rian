import { createFileRoute, notFound } from "@tanstack/react-router";
import { allCourses, type Course } from "content-collections";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { GenElectiveOption } from "@/course/schema";
import { formatDayShort } from "@/lib/formatter/day-short";
import {
  useSelectedGenElectives,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

export const Route = createFileRoute("/(public)/courses/$id")({
  component: CourseDetailPage,
  loader: ({ params }) => {
    const course = allCourses.find((c: Course) => c.slug === params.id);
    if (!course) {
      throw notFound();
    }
    return { course };
  },
});

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const selected = useSelectedGenElectives();
  const { add, remove } = useSelectedGenElectivesActions();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      <div className="mb-4">
        <h1 className="font-semibold text-2xl">
          {course.code} — {course.name}
        </h1>
        <p className="text-muted-foreground">
          Year {course.year}, Semester {course.semester}
        </p>
      </div>

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

      <div className="space-y-4">
        <section className="rounded-lg border p-4 shadow-sm">
          <header className="mb-2">
            <h2 className="font-medium text-lg">Course Information</h2>
          </header>

          <div className="mt-2">
            <p className="font-medium text-sm">Classes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {course.class.map((cls: GenElectiveOption["class"][number]) => {
                const selectedSession = selected.find(
                  (s) =>
                    s.courseCode === course.code &&
                    s.group === cls.group &&
                    s.day === cls.day &&
                    s.start === cls.start &&
                    s.end === cls.end
                );
                const isClassSelected = !!selectedSession;

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
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
