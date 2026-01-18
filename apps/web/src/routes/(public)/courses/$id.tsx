import { createFileRoute, notFound } from "@tanstack/react-router";
import { allCourses, type Course } from "content-collections";
import { ClockIcon, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { GenElectiveOption } from "@/course/schema";
import { ClassSelectButton } from "@/routes/(public)/courses/_components/class-select-button";
import { formatClassLabel } from "@/routes/(public)/courses/_components/use-class-selection";

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

  return (
    <div className="container mx-auto px-12 pb-20">
      <div className="relative border-dashed pb-4 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:border-border after:border-b-2 after:border-dashed">
        <div className="p-4">
          <DisclaimerAlert />
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
          <Accordion className="mt-4 border" defaultValue={[0]}>
            {course.class.map(
              (cls: GenElectiveOption["class"][number], index: number) => (
                <AccordionItem
                  key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                  value={index}
                >
                  <AccordionTrigger className="px-4">
                    {formatClassLabel(cls, t)}
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      <h2 className="font-bold text-xl">
                        <span>{t("course.group")}</span>{" "}
                        <span>{cls.group}</span>{" "}
                        <span>{t("days_time.day")}</span>
                        {t(`days_time.${cls.day.toLowerCase()}`)}
                      </h2>
                      <table className="table-fixed text-sm">
                        <tbody>
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
                      <div className="flex justify-end">
                        <ClassSelectButton
                          cls={cls}
                          course={course}
                          deselectLabel={t("courses.deselect_class")}
                          selectLabel={t("courses.select_class")}
                          showSelectPrefix={false}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
