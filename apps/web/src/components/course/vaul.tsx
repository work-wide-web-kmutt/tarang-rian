import { useForm } from "@tanstack/react-form";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Drawer } from "vaul-base";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

const editSchema = z.object({
  courseCode: z.string().min(1, "Course code is required."),
  courseName: z.string().min(1, "Course name is required."),
  instructor: z.string().min(1, "Instructor name is required."),
});

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
  const { remove, updateSession } = useSelectedGenElectivesActions();

  const form = useForm({
    defaultValues: {
      courseCode: session?.courseCode ?? "",
      courseName: session?.courseName ?? "",
      instructor: session?.instructor ?? "",
    },
    validators: {
      onBlur: editSchema,
      onSubmit: editSchema,
    },
    onSubmit: ({ value }) => {
      if (!session) {
        return;
      }
      updateSession(session.id, {
        courseCode: value.courseCode,
        courseName: value.courseName,
        instructor: value.instructor,
      });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (isHighlighted) {
      setOpen(true);
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (session && isEditing) {
      form.reset({
        courseCode: session.courseCode,
        courseName: session.courseName,
        instructor: session.instructor,
      });
    }
  }, [session, isEditing, form]);

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
            <div className="flex h-full flex-col space-y-6 overflow-y-auto">
              {isEditing ? (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <FieldGroup>
                    <form.Field
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Course Code
                            </FieldLabel>
                            <Input
                              aria-invalid={isInvalid}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                      name="courseCode"
                    />
                    <form.Field
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Course Name
                            </FieldLabel>
                            <Input
                              aria-invalid={isInvalid}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                      name="courseName"
                    />
                    <form.Field
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Instructor
                            </FieldLabel>
                            <Input
                              aria-invalid={isInvalid}
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              value={field.state.value}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                      name="instructor"
                    />
                  </FieldGroup>
                  <div className="flex gap-2">
                    <Button disabled={form.state.isSubmitting} type="submit">
                      {form.state.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
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
