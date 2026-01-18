import { createFileRoute, notFound } from "@tanstack/react-router";
import { allCourses, type Course } from "content-collections";
import {
  AlertTriangle,
  CalendarIcon,
  ClockIcon,
  User,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import type { GenElectiveOption } from "@/course/schema";
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
  const { t } = useTranslation();

  const selected = useSelectedGenElectives();
  const { add, remove } = useSelectedGenElectivesActions();

  return (
    <div className="container mx-auto px-12 pb-20">
      <div className="relative border-dashed pb-4 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
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
            {course.code} — {course.name}
          </h1>
          <p className="px-4 text-muted-foreground">
            {t("academic.year")} {course.year}, {t("academic.semester")}{" "}
            {course.semester}
          </p>
        </div>
      </div>

      <div className="space-y-0">
        <section className="p-4">
          <header className="mb-2">
            <h2>{t("courses.course_info")}</h2>
          </header>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{course.content}</Markdown>
          </div>
        </section>
        <section className="p-4">
          <header className="mb-2">
            <h2>{t("courses.group_section_info")}</h2>
          </header>
          <Tabs
            className="mt-4 border"
            defaultValue={course.class[0] ? "class-0" : undefined}
          >
            <div className="border-b">
              <TabsList variant="underline">
                {course.class.map(
                  (cls: GenElectiveOption["class"][number], index: number) => (
                    <TabsTab
                      key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                      value={`class-${index}`}
                    >
                      {t(`days_short.${cls.day.toLowerCase()}`)} {cls.start} -{" "}
                      {cls.end}
                    </TabsTab>
                  )
                )}
              </TabsList>
            </div>
            {course.class.map(
              (cls: GenElectiveOption["class"][number], index: number) => {
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
                  <TabsPanel
                    key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}-panel`}
                    value={`class-${index}`}
                  >
                    <div className="space-y-4 p-4">
                      <table className="table-fixed text-sm">
                        <tbody>
                          <tr>
                            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>{t("days_time.day")}</span>
                              </div>
                            </td>
                            <td className="py-1.5">
                              {t(`days_time.${cls.day.toLowerCase()}`)}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ClockIcon className="h-3.5 w-3.5" />
                                <span>{t("days_time.time")}</span>
                              </div>
                            </td>
                            <td className="py-1.5">
                              {cls.start} - {cls.end}
                            </td>
                          </tr>
                          <tr>
                            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <UsersIcon className="h-3.5 w-3.5" />
                                <span>{t("course.group")}</span>
                              </div>
                            </td>
                            <td className="py-1.5">{cls.group}</td>
                          </tr>
                          <tr>
                            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <User className="h-3.5 w-3.5" />
                                <span>{t("course.instructor")}</span>
                              </div>
                            </td>
                            <td className="py-1.5">
                              <div className="flex flex-wrap gap-2">
                                {cls.instructor.map((instructor) => (
                                  <Badge key={instructor} variant="outline">
                                    {instructor}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Button
                        onClick={() => {
                          if (isClassSelected && selectedSession) {
                            remove(selectedSession.id);
                          } else {
                            add(course, cls);
                          }
                        }}
                        variant={isClassSelected ? "secondary" : "outline"}
                      >
                        {isClassSelected
                          ? t("courses.deselect_class")
                          : t("courses.select_class")}
                      </Button>
                    </div>
                  </TabsPanel>
                );
              }
            )}
          </Tabs>
        </section>
      </div>
    </div>
  );
}
