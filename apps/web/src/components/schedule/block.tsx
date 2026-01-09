import CourseVaul from "@/components/course/vaul";
import { getTimeSlotPosition } from "@/components/schedule/utils";
import { parseTime } from "@/lib/parser/time";
import type { SelectedClassSession } from "@/stores/selected";

function getClassKey(session: SelectedClassSession): string {
  return `${session.courseCode}-${session.group}-${session.day}-${session.start}-${session.end}`;
}

function doSessionsOverlap(
  session1: SelectedClassSession,
  session2: SelectedClassSession
): boolean {
  if (session1.day !== session2.day) {
    return false;
  }

  const start1 = parseTime(session1.start);
  const end1 = parseTime(session1.end);
  const start2 = parseTime(session2.start);
  const end2 = parseTime(session2.end);

  return start1 < end2 && start2 < end1;
}

function hasOverlap(
  session: SelectedClassSession,
  allSessions: SelectedClassSession[]
): boolean {
  return allSessions.some(
    (other) =>
      getClassKey(session) !== getClassKey(other) &&
      doSessionsOverlap(session, other)
  );
}

function getOverlappingSessions(
  session: SelectedClassSession,
  allSessions: SelectedClassSession[]
): SelectedClassSession[] {
  return allSessions.filter(
    (other) =>
      getClassKey(session) !== getClassKey(other) &&
      doSessionsOverlap(session, other)
  );
}

interface SessionBlockProps {
  session: SelectedClassSession;
  allSessions: SelectedClassSession[];
  openClassKey: string | null;
  onOpenChange: (classKey: string | null) => void;
}

export function SessionBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
}: SessionBlockProps) {
  const { startOffset, span } = getTimeSlotPosition(session.start, session.end);
  const classKey = getClassKey(session);
  const isHighlighted = openClassKey === classKey;
  const hasOverlapping = hasOverlap(session, allSessions);
  const overlappingSessions = getOverlappingSessions(session, allSessions);

  return (
    <CourseVaul
      className={`absolute inset-y-0 z-20 m-0.5 rounded border p-1.5 text-xs ${
        hasOverlapping
          ? "border-destructive bg-destructive/40"
          : "border-primary bg-primary"
      }`}
      isHighlighted={isHighlighted}
      key={classKey}
      onOpenChange={(open) => {
        onOpenChange(open ? classKey : null);
      }}
      onOpenOtherCourse={(otherClassKey) => {
        onOpenChange(otherClassKey);
      }}
      overlappingSessions={overlappingSessions}
      session={session}
      style={{
        left: `${startOffset * 100}%`,
        width: `calc(${span * 100}% - 0.25rem)`,
      }}
    >
      <div
        className={`font-medium ${
          hasOverlapping
            ? "text-destructive-foreground"
            : "text-primary-foreground"
        }`}
      >
        {session.courseCode}
      </div>
      <div
        className={`text-[10px] ${
          hasOverlapping
            ? "text-destructive-foreground/80"
            : "text-primary-foreground/80"
        }`}
      >
        {session.start}–{session.end}
      </div>
      <div
        className={`text-[10px] ${
          hasOverlapping
            ? "text-destructive-foreground/80"
            : "text-primary-foreground/80"
        }`}
      >
        Group {session.group}
      </div>
    </CourseVaul>
  );
}
