import { Trash2Icon } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Drawer } from "vaul-base";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SelectedClassSession } from "@/stores/selected";
import { useSelectedGenElectivesActions } from "@/stores/selected";

interface CourseVaulProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
  onOpenOtherCourse?: (classKey: string) => void;
}

function CourseVaul({
  children,
  style,
  className,
  isHighlighted = false,
  onOpenChange,
  session,
  overlappingSessions = [],
  onOpenOtherCourse,
}: CourseVaulProps) {
  const [open, setOpen] = useState(false);
  const { remove } = useSelectedGenElectivesActions();

  useEffect(() => {
    if (isHighlighted) {
      setOpen(true);
    }
  }, [isHighlighted]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const openState = isHighlighted || open;

  const handleRemove = () => {
    if (!session) {
      return;
    }
    remove(
      session.courseCode,
      session.group,
      session.day,
      session.start,
      session.end
    );
    setOpen(false);
    onOpenChange?.(false);
  };

  return (
    <Drawer.Root
      direction="right"
      onOpenChange={handleOpenChange}
      open={openState}
    >
      <Drawer.Trigger
        nativeButton={false}
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
        <Drawer.Overlay
          className="fixed inset-0 z-50 bg-black/80"
          onClick={() => {
            handleOpenChange(false);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        />
        <Drawer.Content
          className="fixed top-0 right-0 z-70 flex h-full w-[80vw] flex-col rounded-l-lg border bg-background p-6 text-foreground sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
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
              {overlappingSessions.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Overlaps:</div>
                  <div className="flex flex-wrap gap-2">
                    {overlappingSessions.map((overlapSession) => {
                      const overlapKey = `${overlapSession.courseCode}-${overlapSession.group}-${overlapSession.day}-${overlapSession.start}-${overlapSession.end}`;
                      return (
                        <Button
                          key={overlapKey}
                          onClick={() => {
                            setOpen(false);
                            onOpenChange?.(false);
                            onOpenOtherCourse?.(overlapKey);
                          }}
                          variant="outline"
                        >
                          {overlapSession.courseCode}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex">
                <Button onClick={handleRemove} variant="destructive">
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Remove from selected
                </Button>
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
