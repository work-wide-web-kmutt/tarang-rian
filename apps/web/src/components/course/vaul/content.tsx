import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
  User,
  UsersIcon,
} from "lucide-react";
import { useCourseVaulContext } from "@/components/course/vaul/context";
import { CourseVaulForm } from "@/components/course/vaul/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSelectedGenElectivesActions } from "@/stores/selected";

export function CourseVaulContent() {
  const {
    open,
    setOpen,
    isEditing,
    setIsEditing,
    children,
    style,
    className,
    isHighlighted,
    session,
    overlappingSessions,
    onOpenOtherCourse,
  } = useCourseVaulContext();
  const { remove } = useSelectedGenElectivesActions();

  const openState = isHighlighted || open;

  const handleRemove = () => {
    if (!session) {
      return;
    }
    remove(session.id);
    setOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          className,
          "transition-all duration-300 ease-out",
          isHighlighted && "z-60 scale-[1.02] shadow-lg"
        )}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        role="button"
        style={style}
        tabIndex={0}
      >
        {children}
      </div>
      <Sheet onOpenChange={setOpen} open={openState}>
        <SheetContent
          className="flex h-full w-[80vw] flex-col rounded-l-lg border-l p-6 text-foreground sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]"
          side="right"
        >
          {session ? (
            <div className="flex h-full flex-col space-y-6 overflow-y-auto">
              {isEditing ? (
                <CourseVaulForm />
              ) : (
                <>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-2xl">
                          {session.courseName}
                        </h2>
                        <Badge>{session.courseCode}</Badge>
                        <p className="mt-1 flex gap-2 text-muted-foreground">
                          Year{" "}
                          <Badge
                            className="text-black dark:text-white"
                            variant="outline"
                          >
                            {session.year}
                          </Badge>
                          Semester{" "}
                          <Badge
                            className="text-black dark:text-white"
                            variant="outline"
                          >
                            {session.semester}
                          </Badge>
                        </p>
                      </div>
                      {session.type === "custom" && (
                        <Button
                          aria-label="Edit course information"
                          onClick={() => setIsEditing(true)}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <table className="table-fixed text-sm">
                    <tbody>
                      <tr>
                        <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>Day</span>
                          </div>
                        </td>
                        <td className="py-1.5">{session.day}</td>
                      </tr>
                      <tr>
                        <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>Time</span>
                          </div>
                        </td>
                        <td className="py-1.5">
                          {session.start} - {session.end}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <UsersIcon className="h-3.5 w-3.5" />
                            <span>Group</span>
                          </div>
                        </td>
                        <td className="py-1.5">{session.group}</td>
                      </tr>
                      <tr>
                        <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>Instructor</span>
                          </div>
                        </td>
                        <td className="py-1.5">{session.instructor}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

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
        </SheetContent>
      </Sheet>
    </>
  );
}
