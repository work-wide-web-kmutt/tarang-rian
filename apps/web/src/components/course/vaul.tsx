import { type CSSProperties, type ReactNode, useState } from "react";
import { Drawer } from "vaul-base";
import { cn } from "@/lib/utils";
import type { SelectedClassSession } from "@/stores/selected";

interface CourseVaulType {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
}

function CourseVaul({
  children,
  style,
  className,
  isHighlighted = false,
  onOpenChange,
  session,
}: CourseVaulType) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Drawer.Root direction="right" onOpenChange={handleOpenChange} open={open}>
      <Drawer.Trigger
        render={(props) => {
          return (
            <div
              {...props}
              className={cn(
                className,
                "transition-all duration-300 ease-in-out",
                isHighlighted && "z-60"
              )}
              style={style}
            >
              {children}
            </div>
          );
        }}
      />
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Drawer.Content className="fixed top-0 right-0 z-70 flex h-full w-[80vw] flex-col rounded-l-lg border bg-background p-6 text-foreground sm:w-[60vw] lg:w-[40vw]">
          {session ? (
            <div className="flex h-full flex-col space-y-6 overflow-y-auto">
              <div>
                <h2 className="font-semibold text-2xl">
                  {session.courseCode} — {session.courseName}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Year {session.year}, Semester {session.semester}
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Instructor: {session.instructor}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Day:</span> {session.day}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {session.start} -{" "}
                  {session.end}
                </div>
                <div>
                  <span className="font-medium">Group:</span> {session.group}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                No course information available
              </p>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
export default CourseVaul;
