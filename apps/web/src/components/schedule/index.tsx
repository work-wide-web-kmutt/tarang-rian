import { useState } from "react";
import CourseVaul from "@/components/course/vaul";
import { getTimeSlotPosition } from "@/components/schedule/utils";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import { cn } from "@/lib/utils";
import type { SelectedClassSession } from "@/stores/selected";

interface ScheduleProps {
  sessions: SelectedClassSession[];
  className?: string;
}

interface ScheduleClass {
  day: string;
  start: string;
  end: string;
  group: string;
  courseCode: string;
  courseName: string;
}

function getClassKey(cls: ScheduleClass): string {
  return `${cls.courseCode}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`;
}

export function Schedule({ sessions, className }: ScheduleProps) {
  const [openClassKey, setOpenClassKey] = useState<string | null>(null);

  const scheduleData: ScheduleClass[] = sessions.map((session) => ({
    day: session.day,
    start: session.start,
    end: session.end,
    group: session.group,
    courseCode: session.courseCode,
    courseName: session.courseName,
  }));

  const getClassesForCell = (day: string, timeColIndex: number) => {
    return scheduleData.filter((cls) => {
      if (cls.day !== day) {
        return false;
      }
      const { startCol, span } = getTimeSlotPosition(cls.start, cls.end);
      const endCol = startCol + span;
      return timeColIndex >= startCol && timeColIndex < Math.ceil(endCol);
    });
  };

  const isFirstCol = (cls: ScheduleClass, timeColIndex: number) => {
    const { startCol } = getTimeSlotPosition(cls.start, cls.end);
    return timeColIndex === startCol;
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="min-w-[1000px]">
        <div
          className="grid border border-border"
          style={{
            gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, minmax(80px, 1fr))`,
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
                gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, minmax(80px, 1fr))`,
              }}
            >
              <div className="sticky left-0 z-0 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs">
                {day}
              </div>
              {TIME_SLOTS.map((time, timeColIndex) => {
                const cellClasses = getClassesForCell(day, timeColIndex);
                const firstColClasses = cellClasses.filter((cls) =>
                  isFirstCol(cls, timeColIndex)
                );

                return (
                  <div
                    className="relative min-h-[80px] border-border border-r bg-background last:border-r-0"
                    key={`${day}-${time}`}
                  >
                    {firstColClasses.map((cls) => {
                      const { startOffset, span } = getTimeSlotPosition(
                        cls.start,
                        cls.end
                      );
                      const classKey = getClassKey(cls);
                      const isHighlighted = openClassKey === classKey;

                      return (
                        <CourseVaul
                          className="absolute inset-y-0 z-20 m-0.5 rounded border border-primary bg-primary p-1.5 text-xs"
                          isHighlighted={isHighlighted}
                          key={classKey}
                          onOpenChange={(open) => {
                            setOpenClassKey(open ? classKey : null);
                          }}
                          style={{
                            left: `${startOffset * 100}%`,
                            width: `calc(${span * 100}% - 0.25rem)`,
                          }}
                        >
                          <div className="font-medium text-primary-foreground">
                            {cls.courseCode}
                          </div>
                          <div className="text-[10px] text-primary-foreground/80">
                            {cls.start}–{cls.end}
                          </div>
                          <div className="text-[10px] text-primary-foreground/80">
                            Group {cls.group}
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
    </div>
  );
}
