import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allCourses } from "content-collections";
import { Button } from "@/components/ui/button";
import {
  useSelectedGenElectives,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

export const Route = createFileRoute("/(public)/courses/$id")({
  component: CourseDetailPage,
  loader: ({ params }) => {
    const course = allCourses.find((c) => c.slug === params.id);
    if (!course) {
      throw notFound();
    }
    return { course };
  },
});

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const selected = useSelectedGenElectives();
  const { add, removeByCode } = useSelectedGenElectivesActions();

  const isSelected = selected.some((c) => c.code === course.code);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      <div className="mb-4">
        <Link to="..">
          <Button className="mb-2" variant="outline">
            Go Back
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">
          {course.code} — {course.name}
        </h1>
        <p className="text-muted-foreground">
          Year {course.year}, Semester {course.semester}
        </p>
        <p className="mt-1 text-muted-foreground text-sm">
          Instructor: {course.instructor}
        </p>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border p-4 shadow-sm">
          <header className="mb-2">
            <h2 className="font-medium text-lg">Course Information</h2>
          </header>

          <div className="mt-2">
            <p className="font-medium text-sm">Classes</p>
            <ul className="mt-1 grid gap-1 text-sm">
              {course.class.map((cls) => (
                <li
                  className="flex items-center justify-between rounded border px-2 py-1"
                  key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                >
                  <span>
                    Group {cls.group} · {cls.day}
                  </span>
                  <span>
                    {cls.start}–{cls.end}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                if (isSelected) {
                  removeByCode(course.code);
                } else {
                  add(course);
                }
              }}
              variant={isSelected ? "secondary" : "outline"}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
