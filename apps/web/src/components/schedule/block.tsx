import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CourseVaul from "@/components/course/vaul";
import {
  getClassKey,
  getOverlappingSessions,
  getTimeSlotPosition,
  hasOverlap,
} from "@/components/schedule/utils";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { SelectedClassSession } from "@/stores/selected";
import { useSelectedGenElectivesActions } from "@/stores/selected";

interface SessionBlockProps {
  session: SelectedClassSession;
  allSessions: SelectedClassSession[];
  openClassKey: string | null;
  onOpenChange: (classKey: string | null) => void;
  extraLeftPadding?: string;
  isCustom?: boolean;
  textClass?: string;
  subTextClass?: string;
  defaultEditMode?: boolean;
}

export function SessionBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
  extraLeftPadding,
  textClass = "text-xs",
  subTextClass = "text-[10px]",
  defaultEditMode = false,
}: SessionBlockProps) {
  const { startOffset, span } = getTimeSlotPosition(session.start, session.end);
  const classKey = getClassKey(session);
  const hasOverlapping = hasOverlap(session, allSessions);
  const overlappingSessions = getOverlappingSessions(session, allSessions);
  const { remove } = useSelectedGenElectivesActions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    remove(session.id);
    setShowDeleteDialog(false);
  };

  const { t } = useTranslation();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <CourseVaul
          className={`absolute inset-y-0 z-20 m-0.5 cursor-pointer rounded border p-1.5 ${textClass} ${
            hasOverlapping
              ? "border-destructive bg-destructive/40"
              : "border-primary bg-primary"
          }`}
          data-session-block
          defaultEditMode={defaultEditMode}
          key={classKey}
          onOpenChange={(open) => {
            onOpenChange(open ? classKey : null);
          }}
          overlappingSessions={overlappingSessions}
          session={session}
          shouldOpen={openClassKey === classKey}
          style={{
            left: `${startOffset * 100}%`,
            width: `calc(${span * 100}% - 0.25rem)`,
            paddingLeft: extraLeftPadding,
          }}
        >
          <div className="min-w-0">
            <div
              className={`truncate ${
                hasOverlapping
                  ? "text-destructive-foreground"
                  : "text-primary-foreground"
              }`}
            >
              <span>{session.courseCode}</span>{" "}
            </div>
            <div
              className={`truncate ${
                hasOverlapping
                  ? "text-destructive-foreground"
                  : "text-primary-foreground"
              }`}
            >
              <span className="font-bold">{session.courseName}</span>
            </div>
            <div
              className={`truncate ${subTextClass} ${
                hasOverlapping
                  ? "text-destructive-foreground/80"
                  : "text-primary-foreground/80"
              }`}
            >
              {session.start} - {session.end} ({span}h)
            </div>
          </div>
        </CourseVaul>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>
            {session.courseCode} - {session.courseName}
          </ContextMenuLabel>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete} variant="destructive">
          <Trash2Icon />
          {t("schedule.delete")}
        </ContextMenuItem>
      </ContextMenuContent>
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
    </ContextMenu>
  );
}
