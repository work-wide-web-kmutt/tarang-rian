import type { CSSProperties, ReactNode } from "react";
import { CourseVaulContent } from "@/components/course/vaul/content";
import { CourseVaulProvider } from "@/components/course/vaul/context";
import type { SelectedClassSession } from "@/stores/selected";

interface CourseVaulProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
}

function CourseVaul({
  children,
  style,
  className,
  onOpenChange,
  session,
  overlappingSessions = [],
}: CourseVaulProps) {
  return (
    <CourseVaulProvider
      className={className}
      onOpenChange={onOpenChange}
      overlappingSessions={overlappingSessions}
      session={session}
      style={style}
      triggerChildren={children}
    >
      <CourseVaulContent />
    </CourseVaulProvider>
  );
}

export default CourseVaul;
