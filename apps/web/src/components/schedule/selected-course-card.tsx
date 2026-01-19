import { Eye, Pencil, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CourseVaul from "@/components/course/vaul";
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
import type { SelectedClassSession } from "@/stores/selected";
import { useSelectedGenElectivesActions } from "@/stores/selected";

interface SelectedCourseCardProps {
  session: SelectedClassSession;
}

export function SelectedCourseCard({ session }: SelectedCourseCardProps) {
  const { t, i18n } = useTranslation();
  const { remove } = useSelectedGenElectivesActions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isVaulOpen, setIsVaulOpen] = useState(false);
  const [defaultEditMode, setDefaultEditMode] = useState(false);

  const isCustom = session.type === "custom";

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    remove(session.id);
    setShowDeleteDialog(false);
  };

  const handleEditClick = () => {
    setDefaultEditMode(true);
    setIsVaulOpen(true);
  };

  const handleViewClick = () => {
    setDefaultEditMode(false);
    setIsVaulOpen(true);
  };

  const handleVaulOpenChange = (open: boolean) => {
    setIsVaulOpen(open);
    if (!open) {
      setDefaultEditMode(false);
    }
  };

  return (
    <div className="flex rounded-lg border border-x-0">
      {/* Left: Card content */}
      <section className="flex-1 p-4">
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

      {/* Right: Action buttons stacked vertically */}
      <div className="flex w-12 flex-col border-l">
        <button
          aria-label={t("schedule.delete")}
          className="flex h-1/2 items-center justify-center bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90"
          onClick={handleDeleteClick}
          type="button"
        >
          <Trash2 className="size-5" />
        </button>

        <button
          aria-label={isCustom ? t("form.save") : t("courses.view")}
          className="flex h-1/2 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={isCustom ? handleEditClick : handleViewClick}
          type="button"
        >
          {isCustom ? (
            <Pencil className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>

      {/* CourseVaul for view/edit sheet */}
      <CourseVaul
        className="hidden"
        defaultEditMode={defaultEditMode}
        onOpenChange={handleVaulOpenChange}
        session={session}
        shouldOpen={isVaulOpen}
      >
        <span />
      </CourseVaul>

      {/* Delete confirmation dialog */}
      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
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
            <AlertDialogAction onClick={handleConfirmDelete}>
              {t("schedule.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
