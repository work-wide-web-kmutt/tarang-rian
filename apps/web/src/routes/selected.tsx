import { createFileRoute } from "@tanstack/react-router";

import { useSelectedGenElectives } from "@/stores/selected";

export const Route = createFileRoute("/selected")({
  component: SelectedCoursesPage,
});

function SelectedCoursesPage() {
  const selected = useSelectedGenElectives();

  const sortedSelected = [...selected].sort((a, b) => {
    if (a.year === b.year) {
      if (a.semester === b.semester) {
        return a.code.localeCompare(b.code);
      }
      return a.semester.localeCompare(b.semester);
    }
    return a.year.localeCompare(b.year);
  });

  const hasSelected = sortedSelected.length > 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      <div className="mb-4">
        <h1 className="font-semibold text-2xl">Selected GEN Courses</h1>
        <p className="text-muted-foreground">
          Showing only courses you&apos;ve added to your selected list.
        </p>
      </div>

      {hasSelected ? (
        <div className="space-y-4">
          {sortedSelected.map((course) => (
            <section
              className="rounded-lg border p-4 shadow-sm"
              key={course.code}
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
            </section>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          You have not selected any courses yet.
        </p>
      )}
    </div>
  );
}
