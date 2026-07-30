import { useTranslation } from "react-i18next";
import {
  getClassesForCell,
  getClassKey,
  getTimeSlotPosition,
  hasOverlap,
  isFirstCol,
} from "@/components/schedule/utils";
import { SCHEDULE_SIZE } from "@/constants/schedule";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { AcademicTerm } from "@/course/academic-term";
import { cn } from "@/lib/utils";
import { useScheduleSize } from "@/stores/schedule-settings";
import type { SelectedClassSession } from "@/stores/selected";

interface SchedulePreviewProps {
  sessions: SelectedClassSession[];
  term: AcademicTerm;
  darkMode: boolean;
  shorthand: boolean;
}

export function SchedulePreview({
  sessions,
  term,
  darkMode,
  shorthand,
}: SchedulePreviewProps) {
  const { t } = useTranslation();
  const size = useScheduleSize();
  const { cellSize, dayColumnWidth, rowHeight, textClass, subTextClass } =
    SCHEDULE_SIZE[size];

  // Calculate scaled dimensions
  const scaledCellSize = cellSize;
  const scaledDayColumnWidth = dayColumnWidth;
  const scaledRowHeight = rowHeight;

  // Base classes
  const containerClass = cn(
    "flex flex-col transition-colors duration-200",
    darkMode ? "text-foreground" : "text-slate-950"
  );

  const borderClass = darkMode ? "border-border" : "border-slate-200";
  const mutedBgClass = darkMode ? "bg-muted" : "bg-slate-100";
  const mutedTextClass = darkMode ? "text-muted-foreground" : "text-slate-500";
  const gridLineClass = darkMode ? "border-border" : "border-slate-200";

  return (
    <div className={cn(containerClass, "w-fit")}>
      <div className={cn("px-2 pb-2 font-medium text-sm", mutedTextClass)}>
        {t("academic.year")} {term.year}, {t("academic.semester")}{" "}
        {term.semester}
      </div>
      <div
        className={cn("grid border", borderClass)}
        style={{
          gridTemplateColumns: `${scaledDayColumnWidth}px repeat(${TIME_SLOTS.length}, ${scaledCellSize}px)`,
        }}
      >
        <div
          className={cn(
            "flex items-center justify-center border-r p-2 text-center font-medium text-xs",
            borderClass,
            mutedBgClass,
            mutedTextClass
          )}
        >
          {t("days_time.day")}
        </div>
        {TIME_SLOTS.map((time) => (
          <div
            className={cn(
              "flex items-center justify-center border-r p-2 text-center font-medium text-xs last:border-r-0",
              borderClass,
              mutedBgClass,
              mutedTextClass
            )}
            key={time}
          >
            {time}
          </div>
        ))}

        {DAYS.map((day) => (
          <>
            <div
              className={cn(
                "flex items-center justify-center border-t border-r p-2 text-center font-medium text-xs",
                borderClass,
                mutedBgClass,
                mutedTextClass
              )}
              key={`${day}-label`}
            >
              {shorthand
                ? t(`days_short.${day.toLowerCase()}`)
                : t(`days_time.${day.toLowerCase()}`)}
            </div>

            {TIME_SLOTS.map((_time, timeColIndex) => {
              const cellClasses = getClassesForCell(
                day,
                timeColIndex,
                sessions
              );
              const firstColClasses = cellClasses.filter((session) =>
                isFirstCol(session, timeColIndex)
              );

              return (
                <div
                  className={cn(
                    "relative border-t border-r p-0 last:border-r-0",
                    gridLineClass,
                    !darkMode && "bg-white",
                    darkMode && "bg-background"
                  )}
                  key={`${day}-${_time}`}
                  style={{ height: `${scaledRowHeight}px` }}
                >
                  {firstColClasses.map((session) => {
                    const classKey = getClassKey(session);
                    const { startOffset, span } = getTimeSlotPosition(
                      session.start,
                      session.end
                    );

                    const isOverlapping = hasOverlap(session, sessions);
                    // For basic export check we use global session check.
                    // Ideally we should match exact overlap logic if we want "red" for conflict.

                    // Styles matching SessionBlock roughly
                    const blockBg = isOverlapping
                      ? "bg-destructive/40 border-destructive"
                      : "bg-primary border-primary";
                    const blockText = isOverlapping
                      ? "text-destructive-foreground"
                      : "text-primary-foreground";

                    return (
                      <div
                        className={cn(
                          "absolute inset-y-0 z-10 m-0.5 overflow-hidden rounded border p-1.5",
                          textClass,
                          blockBg
                        )}
                        key={classKey}
                        style={{
                          left: `${startOffset * 100}%`,
                          width: `calc(${span * 100}% - 0.25rem)`,
                        }}
                      >
                        <div className={cn(blockText)}>
                          <p className="truncate">{session.courseCode}</p>
                          <p className="truncate font-bold">
                            {session.courseName}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "truncate opacity-80",
                            subTextClass,
                            blockText
                          )}
                        >
                          {session.start} - {session.end}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
