import { useState } from "react";
import CourseVaul from "@/components/course/vaul";
import { getTimeSlotPosition } from "@/components/schedule/utils";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { SelectedClassSession } from "@/stores/selected";

const CELL_SIZE = 100;
const DAY_COLUMN_WIDTH = 120;
const MIN_WIDTH = DAY_COLUMN_WIDTH + TIME_SLOTS.length * CELL_SIZE + 2;

interface ScheduleProps {
  sessions: SelectedClassSession[];
}

function getClassKey(session: SelectedClassSession): string {
  return `${session.courseCode}-${session.group}-${session.day}-${session.start}-${session.end}`;
}

export function Schedule({ sessions }: ScheduleProps) {
  const [openClassKey, setOpenClassKey] = useState<string | null>(null);

  const getClassesForCell = (day: string, timeColIndex: number) => {
    return sessions.filter((session) => {
      if (session.day !== day) {
        return false;
      }
      const { startCol, span } = getTimeSlotPosition(
        session.start,
        session.end
      );
      const endCol = startCol + span;
      return timeColIndex >= startCol && timeColIndex < Math.ceil(endCol);
    });
  };

  const isFirstCol = (session: SelectedClassSession, timeColIndex: number) => {
    const { startCol } = getTimeSlotPosition(session.start, session.end);
    return timeColIndex === startCol;
  };

  return (
    <div style={{ width: `${MIN_WIDTH}px` }}>
      <div
        className="grid border border-border"
        style={{
          gridTemplateColumns: `${DAY_COLUMN_WIDTH}px repeat(${TIME_SLOTS.length}, ${CELL_SIZE}px)`,
        }}
      >
        <div className="sticky left-0 z-0 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs">
          Day
        </div>
        {TIME_SLOTS.map((time) => (
          <div
            className="border-border border-r bg-muted/50 p-2 text-center font-medium text-muted-foreground text-xs last:border-r-0"
            key={time}
          >
            {time}
          </div>
        ))}
      </div>

      <div className="border-border border-r border-b border-l">
        {DAYS.map((day) => (
          <div
            className="grid border-border border-b last:border-b-0"
            key={day}
            style={{
              gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, ${CELL_SIZE}px)`,
            }}
          >
            <div className="sticky left-0 z-0 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs">
              {day}
            </div>
            {TIME_SLOTS.map((time, timeColIndex) => {
              const cellClasses = getClassesForCell(day, timeColIndex);
              const firstColClasses = cellClasses.filter((session) =>
                isFirstCol(session, timeColIndex)
              );

              return (
                <div
                  className="relative min-h-[80px] border-border border-r bg-background last:border-r-0"
                  key={`${day}-${time}`}
                >
                  {firstColClasses.map((session) => {
                    const { startOffset, span } = getTimeSlotPosition(
                      session.start,
                      session.end
                    );
                    const classKey = getClassKey(session);
                    const isHighlighted = openClassKey === classKey;

                    return (
                      <CourseVaul
                        className="absolute inset-y-0 z-20 m-0.5 rounded border border-primary bg-primary p-1.5 text-xs"
                        isHighlighted={isHighlighted}
                        key={classKey}
                        onOpenChange={(open) => {
                          setOpenClassKey(open ? classKey : null);
                        }}
                        session={session}
                        style={{
                          left: `${startOffset * 100}%`,
                          width: `calc(${span * 100}% - 0.25rem)`,
                        }}
                      >
                        <div className="font-medium text-primary-foreground">
                          {session.courseCode}
                        </div>
                        <div className="text-[10px] text-primary-foreground/80">
                          {session.start}–{session.end}
                        </div>
                        <div className="text-[10px] text-primary-foreground/80">
                          Group {session.group}
                        </div>
                      </CourseVaul>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
