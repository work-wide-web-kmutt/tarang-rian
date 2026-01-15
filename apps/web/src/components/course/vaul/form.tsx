import { useForm } from "@tanstack/react-form";
import {
  BookOpen,
  CalendarIcon,
  GraduationCap,
  User,
  UsersIcon,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo } from "react";
import z from "zod";
import { useCourseVaulContext } from "@/components/course/vaul/context";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS } from "@/constants/times";
import { useCurrentYear } from "@/stores/academic-context";
import { useSelectedGenElectivesActions } from "@/stores/selected";

const editSchema = z.object({
  courseCode: z.string().min(1, "Course code is required."),
  courseName: z.string().min(1, "Course name is required."),
  instructor: z.string().min(1, "Instructor name is required."),
  group: z.string().min(1, "Group is required."),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  year: z.string().min(1, "Year is required."),
  semester: z.enum(["1", "2", "S"]),
});

export function CourseVaulForm() {
  const { updateSession } = useSelectedGenElectivesActions();
  const { setIsEditing, session } = useCourseVaulContext();
  const currentYear = useCurrentYear();

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = currentYear - 4; i <= currentYear + 4; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  const form = useForm({
    defaultValues: {
      courseCode: session?.courseCode ?? "",
      courseName: session?.courseName ?? "",
      instructor: session?.instructor ?? "",
      group: session?.group ?? "",
      day: session?.day ?? "Monday",
      year: session?.year ?? currentYear.toString(),
      semester: session?.semester ?? "1",
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
        group: value.group,
        day: value.day,
        year: value.year,
        semester: value.semester,
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
      group: session.group,
      day: session.day,
      year: session.year,
      semester: session.semester,
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
                <InputGroup>
                  <InputGroupAddon>
                    <BookOpen />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(event.target.value);
                    }}
                    value={field.state.value}
                  />
                </InputGroup>
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
                <InputGroup>
                  <InputGroupAddon>
                    <GraduationCap />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(event.target.value);
                    }}
                    value={field.state.value}
                  />
                </InputGroup>
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
                <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <CalendarIcon />
                  </InputGroupAddon>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        field.handleChange(value);
                      }
                    }}
                    value={field.state.value}
                  >
                    <SelectTrigger
                      aria-invalid={isInvalid}
                      className="w-full border-0 shadow-none"
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="year"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <BookOpen />
                  </InputGroupAddon>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        field.handleChange(value as typeof field.state.value);
                      }
                    }}
                    value={field.state.value}
                  >
                    <SelectTrigger
                      aria-invalid={isInvalid}
                      className="w-full border-0 shadow-none"
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                    </SelectContent>
                  </Select>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="semester"
        />

        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Day</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <CalendarIcon />
                  </InputGroupAddon>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        field.handleChange(value as typeof field.state.value);
                      }
                    }}
                    value={field.state.value}
                  >
                    <SelectTrigger
                      aria-invalid={isInvalid}
                      className="w-full border-0 shadow-none"
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day: (typeof DAYS)[number]) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="day"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Group</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UsersIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(event.target.value);
                    }}
                    value={field.state.value}
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="group"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Instructor</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(event.target.value);
                    }}
                    value={field.state.value}
                  />
                </InputGroup>
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
