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
}

export function SessionBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
  extraLeftPadding,
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
          className={`absolute inset-y-0 z-20 m-0.5 cursor-pointer rounded border p-1.5 text-xs ${
            hasOverlapping
              ? "border-destructive bg-destructive/40"
              : "border-primary bg-primary"
          }`}
          data-session-block
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
          <div>
            <div
              className={`${
                hasOverlapping
                  ? "text-destructive-foreground"
                  : "text-primary-foreground"
              }`}
            >
              <p>{session.courseCode}</p>{" "}
              <p className="font-bold">{session.courseName}</p>
            </div>
            <div
              className={`text-[10px] ${
                hasOverlapping
                  ? "text-destructive-foreground/80"
                  : "text-primary-foreground/80"
              }`}
            >
              {session.start} - {session.end}
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
