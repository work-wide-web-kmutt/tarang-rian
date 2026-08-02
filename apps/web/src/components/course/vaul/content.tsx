import { Link } from "@tanstack/react-router";
import { allCourses } from "content-collections";
import {
  CalendarIcon,
  ClockIcon,
  ExternalLinkIcon,
  PencilIcon,
  Trash2Icon,
  User,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCourseVaulContext } from "@/components/course/vaul/context";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export function CourseVaulContent() {
  const { session, overlappingSessions, setIsEditing, handleRemove } =
    useCourseVaulContext();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { t } = useTranslation();

  if (!session) {
    return null;
  }

  const course = allCourses.find(
    (candidate) =>
      candidate.code === session.courseCode &&
      candidate.year === session.year &&
      candidate.semester === session.semester
  );
  const courseSlug = course?.slug;

  function handleConfirmRemove(e?: React.MouseEvent<HTMLButtonElement>): void {
    e?.stopPropagation();
    handleRemove();
    setShowRemoveDialog(false);
  }

  return (
    <>
      <div>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl">{session.courseName}</h2>
            <Badge>{session.courseCode}</Badge>
            <p className="mt-1 flex gap-2 text-muted-foreground">
              {t("academic.year")}{" "}
              <Badge className="text-black dark:text-white" variant="outline">
                {session.year}
              </Badge>
              {t("academic.semester")}{" "}
              <Badge className="text-black dark:text-white" variant="outline">
                {session.semester}
              </Badge>
            </p>
          </div>
          {session.type === "custom" && (
            <Button
              aria-label="Edit course information"
              onClick={() => {
                setIsEditing(true);
              }}
              size="icon"
              type="button"
              variant="outline"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {session.type === "fixed" && <DisclaimerAlert className="mb-4" />}

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
              {t(`days_time.${session.day.toLowerCase()}`)}
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
              {session.start} - {session.end}
            </td>
          </tr>
          <tr>
            <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UsersIcon className="h-3.5 w-3.5" />
                <span>{t("course.group")}</span>
              </div>
            </td>
            <td className="py-1.5">{session.group}</td>
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
                {session.instructor.map((instructor) => (
                  <Badge key={instructor} variant="outline">
                    {instructor}
                  </Badge>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {overlappingSessions.length > 0 && (
        <div className="space-y-2">
          <div className="font-medium text-sm">Overlaps:</div>
          <div className="flex flex-wrap gap-2">
            {overlappingSessions.map((overlapSession) => {
              const overlapKey = `${overlapSession.courseCode}-${overlapSession.group}-${overlapSession.day}-${overlapSession.start}-${overlapSession.end}`;
              return (
                <Badge key={overlapKey} variant="outline">
                  {overlapSession.courseCode}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setShowRemoveDialog(true);
          }}
          variant="destructive"
        >
          <Trash2Icon />
          {t("schedule.remove_from_select")}
        </Button>
        {session.type !== "custom" &&
          courseSlug !== undefined &&
          courseSlug !== "" && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              params={{ id: courseSlug }}
              to="/courses/$id"
            >
              <ExternalLinkIcon />
              {t("courses.view")}
            </Link>
          )}
        <AlertDialog onOpenChange={setShowRemoveDialog} open={showRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("schedule.remove_from_schedule")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("schedule.remove_from_schedule_description1")}{" "}
                {session.courseCode} - {session.courseName}{" "}
                {t("schedule.remove_from_schedule_description2")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("schedule.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmRemove}>
                {t("schedule.remove")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
