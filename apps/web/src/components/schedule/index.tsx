import { useState } from "react";
import { SessionBlock } from "@/components/schedule/block";
import { getClassKey, getTimeSlotPosition } from "@/components/schedule/utils";
import { CELL_SIZE, DAY_COLUMN_WIDTH, MIN_WIDTH } from "@/constants/schedule";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { SelectedClassSession } from "@/stores/selected";

interface ScheduleProps {
  sessions: SelectedClassSession[];
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
                    const classKey = getClassKey(session);
                    return (
                      <SessionBlock
                        allSessions={sessions}
                        key={classKey}
                        onOpenChange={setOpenClassKey}
                        openClassKey={openClassKey}
                        session={session}
                      />
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
