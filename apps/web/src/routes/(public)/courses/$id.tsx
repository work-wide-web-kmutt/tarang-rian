import { createFileRoute, notFound } from "@tanstack/react-router";
import { allCourses, type Course } from "content-collections";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { AccordionItem } from "@/components/class/accordion-item";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import { Accordion } from "@/components/ui/accordion";
import type { GenElectiveOption } from "@/course/schema";

const H1_REGEX = /^#\s+(.+)$/m;

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

  const [openItems, setOpenItems] = useState<number[]>([0]);

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
        <section className="px-0 md:px-4">
          <header className="px-4 py-6 md:px-0">
            <h2 className="font-bold text-xl">{t("courses.course_info")}</h2>
          </header>
          <div className="border">
            <div className="border-b p-4 font-semibold text-xl">
              <Markdown>{course.content.match(H1_REGEX)?.[1] ?? ""}</Markdown>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4">
              <Markdown>{course.content.replace(H1_REGEX, "")}</Markdown>
            </div>
          </div>
        </section>

        <section className="px-0 md:px-4">
          <header className="px-4 py-6 md:px-0">
            <h2 className="font-bold text-xl">
              {t("courses.group_section_info")}
            </h2>
          </header>
          <Accordion
            className="border"
            onValueChange={setOpenItems}
            value={openItems}
          >
            {course.class.map(
              (cls: GenElectiveOption["class"][number], index: number) => (
                <AccordionItem
                  cls={cls}
                  course={course}
                  index={index}
                  key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
                  openIndexs={openItems}
                />
              )
            )}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
