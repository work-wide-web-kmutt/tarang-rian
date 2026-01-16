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
  shouldOpen?: boolean;
}

function CourseVaul({
  children,
  style,
  className,
  onOpenChange,
  session,
  overlappingSessions = [],
  shouldOpen = false,
}: CourseVaulProps) {
  return (
    <CourseVaulProvider
      className={className}
      onOpenChange={onOpenChange}
      overlappingSessions={overlappingSessions}
      session={session}
      shouldOpen={shouldOpen}
      style={style}
      triggerChildren={children}
    >
      <CourseVaulContent />
    </CourseVaulProvider>
  );
}

export default CourseVaul;
