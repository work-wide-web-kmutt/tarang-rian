import { useForm } from "@tanstack/react-form";
import { type FormEvent, useEffect } from "react";
import z from "zod";
import { useCourseVaulContext } from "@/components/course/vaul/context";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSelectedGenElectivesActions } from "@/stores/selected";

const editSchema = z.object({
  courseCode: z.string().min(1, "Course code is required."),
  courseName: z.string().min(1, "Course name is required."),
  instructor: z.string().min(1, "Instructor name is required."),
});

export function CourseVaulForm() {
  const { updateSession } = useSelectedGenElectivesActions();
  const { setIsEditing, session } = useCourseVaulContext();

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
      updateSession(session?.id, {
        courseCode: value.courseCode,
        courseName: value.courseName,
        instructor: value.instructor,
      });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (!session) {
      return;
    }
    form.reset({
      courseCode: session.courseCode,
      courseName: session.courseName,
      instructor: session.instructor,
    });
  }, [session, form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Course Code</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="courseCode"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Course Name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="courseName"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Instructor</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
  );
}
