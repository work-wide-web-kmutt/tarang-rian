import { CopyIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CourseVaul from "@/components/course/vaul";
import {
  getClassKey,
  getOverlappingSessions,
  getSessionColorClasses,
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
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DAYS } from "@/constants/times";
import type { ScheduleTimeRange } from "@/constants/times";
import { parseTime } from "@/lib/parser/time";
import { cn } from "@/lib/utils";
import { useScheduleColorMode } from "@/stores/schedule-settings";
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
  timeRange: ScheduleTimeRange;
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
  timeRange,
}: SessionBlockProps) {
  const position = getTimeSlotPosition(session.start, session.end, timeRange);
  const classKey = getClassKey(session);
  const hasOverlapping = hasOverlap(session, allSessions);
  const overlappingSessions = getOverlappingSessions(session, allSessions);
  const { duplicate, remove } = useSelectedGenElectivesActions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { t } = useTranslation();
  const colorMode = useScheduleColorMode();
  const colors = getSessionColorClasses(
    session,
    allSessions,
    colorMode,
    hasOverlapping
  );

  if (!position) {
    return null;
  }

  const { startOffset, span } = position;
  const durationHours =
    (parseTime(session.end) - parseTime(session.start)) / 60;

  function handleDelete(e: React.MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
  }

  function handleConfirmDelete(e?: React.MouseEvent<HTMLButtonElement>): void {
    e?.stopPropagation();
    remove(session.id);
    setShowDeleteDialog(false);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <CourseVaul
          className={cn(
            "absolute inset-y-0 z-20 m-0.5 cursor-pointer rounded border p-1.5",
            textClass,
            colors.block
          )}
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
            paddingLeft: extraLeftPadding,
            width: `calc(${span * 100}% - 0.25rem)`,
          }}
        >
          <div className={cn("min-w-0", colors.text)}>
            <div className="truncate">
              <span>{session.courseCode}</span>{" "}
            </div>
            <div className="truncate">
              <span className="font-bold">{session.courseName}</span>
            </div>
            <div className={cn("truncate opacity-80", subTextClass)}>
              {session.start} - {session.end}{" "}
              {t("schedule.duration", { duration: durationHours })}
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
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <CopyIcon />
            {t("schedule.duplicate_to")}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {DAYS.map((day) => {
              const dayLabel = t(`days_time.${day.toLowerCase()}`);
              return (
                <ContextMenuItem
                  key={day}
                  onClick={() => {
                    duplicate(session.id, day);
                  }}
                >
                  {day === session.day
                    ? t("schedule.duplicate_same_day", { day: dayLabel })
                    : dayLabel}
                </ContextMenuItem>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
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
