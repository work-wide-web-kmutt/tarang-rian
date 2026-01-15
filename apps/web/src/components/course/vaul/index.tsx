import { PencilIcon, Trash2Icon } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Drawer } from "vaul-base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SelectedClassSession } from "@/stores/selected";
import { useSelectedGenElectivesActions } from "@/stores/selected";
import { CourseVaulForm } from "./form";

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
  const [isEditing, setIsEditing] = useState(false);
  const { remove } = useSelectedGenElectivesActions();

  useEffect(() => {
    if (isHighlighted) {
      setOpen(true);
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const openState = isHighlighted || open;

  const handleRemove = () => {
    if (!session) {
      return;
    }
    remove(session.id);
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
                "transition-all duration-300 ease-out",
                isHighlighted && "z-60 scale-[1.02] shadow-lg"
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
          className={cn(
            "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ease-out",
            openState ? "opacity-100" : "opacity-0"
          )}
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
          className={cn(
            "fixed top-0 right-0 z-70 flex h-full w-[80vw] flex-col rounded-l-lg border bg-background p-6 text-foreground transition-transform duration-300 ease-out sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]",
            openState ? "translate-x-0" : "translate-x-full"
          )}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          {session ? (
            <div
              className="flex h-full flex-col space-y-6 overflow-y-auto"
              data-vaul-no-drag
            >
              {isEditing ? (
                <CourseVaulForm
                  onCancel={() => {
                    setIsEditing(false);
                  }}
                  onSaved={() => {
                    setIsEditing(false);
                  }}
                  session={session}
                />
              ) : (
                <div className="space-y-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h2 className="font-semibold text-2xl">
                        {session.courseName}
                      </h2>
                      <Badge>{session.courseCode}</Badge>
                    </div>
                    {session.type === "custom" && (
                      <Button
                        aria-label="Edit course information"
                        onClick={() => setIsEditing(true)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-0 pt-4">
                    <p className="mt-1 text-muted-foreground">
                      Year {session.year}, Semester {session.semester}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Instructor: {session.instructor}
                    </p>
                  </div>
                </div>
              )}

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
            <div
              className="flex h-full items-center justify-center"
              data-vaul-no-drag
            >
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
