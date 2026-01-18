import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SelectedClassSession } from "@/stores/selected";

interface SelectedCourseCardProps {
  session: SelectedClassSession;
}

export function SelectedCourseCard({ session }: SelectedCourseCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <section className="rounded-lg border border-x-0 p-4">
      <header className="mb-2">
        <h2 className="font-medium text-lg">
          {session.courseCode} — {session.courseName}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("academic.year")} {session.year}, {t("academic.semester")}{" "}
          {session.semester}
        </p>
      </header>

      <div className="space-y-4">
        <h3 className="font-bold text-base">
          <span>{t("course.group")}</span> <span>{session.group}</span>{" "}
          {i18n.language !== "en" && <span>{t("days_time.day")}</span>}
          {t(`days_time.${session.day.toLowerCase()}`)} {session.start} -{" "}
          {session.end}
        </h3>
        <table className="table-fixed text-sm">
          <tbody>
            <tr>
              <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>{t("course.instructor")}</span>
                </div>
              </td>
              <td className="py-1.5">
                <div className="flex flex-wrap gap-2">
                  <p>
                    {session.instructor.map((instructor, idx) =>
                      idx === session.instructor.length - 1
                        ? instructor
                        : `${instructor}, `
                    )}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
