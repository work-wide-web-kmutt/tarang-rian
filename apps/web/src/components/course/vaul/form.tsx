import { useForm } from "@tanstack/react-form";
import { BookOpen, GraduationCap, UsersIcon } from "lucide-react";
import { type FormEvent, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import { DAYS, getFullDayTimeSlots } from "@/constants/times";
import { parseTime } from "@/lib/parser/time";
import { useSelectedGenElectivesActions } from "@/stores/selected";

const editSchema = z.object({
  courseCode: z.string().min(1, "Course code is required."),
  courseName: z.string().min(1, "Course name is required."),
  instructor: z.array(z.string()).min(1, "At least one instructor is required"),
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
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
});

export function CourseVaulForm() {
  const { t } = useTranslation();
  const { updateSession } = useSelectedGenElectivesActions();
  const { setIsEditing, session } = useCourseVaulContext();

  const timeSlots = useMemo(getFullDayTimeSlots, []);

  const form = useForm({
    defaultValues: {
      courseCode: session?.courseCode ?? "",
      courseName: session?.courseName ?? "",
      instructor: session?.instructor ?? [],
      group: session?.group ?? "",
      day: session?.day ?? "Monday",
      startTime: session?.start ?? "",
      endTime: session?.end ?? "",
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
        start: value.startTime,
        end: value.endTime,
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
      startTime: session.start,
      endTime: session.end,
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
                <FieldLabel htmlFor={field.name}>
                  {t("course.course_code")}
                </FieldLabel>
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
                <FieldLabel htmlFor={field.name}>
                  {t("course.course_name")}
                </FieldLabel>
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
        {session && (
          <p className="text-muted-foreground text-sm">
            {t("academic.year")} {session.year}, {t("academic.semester")}{" "}
            {session.semester}
          </p>
        )}

        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("days_time.day")}
                </FieldLabel>
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
                    className="w-full"
                    id={field.name}
                  >
                    <SelectValue>
                      {t(`days_time.${field.state.value.toLowerCase()}`)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day: (typeof DAYS)[number]) => (
                      <SelectItem key={day} value={day}>
                        {t(`days_time.${day.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="day"
        />
        <div className="flex gap-4">
          <form.Field
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const endTime = form.state.values.endTime;
              return (
                <Field className="flex-1" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("days_time.start_time")}
                  </FieldLabel>
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
                      className="w-full"
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(0, -1).map((time) => {
                        const isDisabled = endTime
                          ? parseTime(time) >= parseTime(endTime)
                          : false;
                        return (
                          <SelectItem
                            disabled={isDisabled}
                            key={time}
                            value={time}
                          >
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
            name="startTime"
          />
          <form.Field
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const startTime = form.state.values.startTime;
              return (
                <Field className="flex-1" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("days_time.end_time")}
                  </FieldLabel>
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
                      className="w-full"
                      id={field.name}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(1).map((time) => {
                        const isDisabled = startTime
                          ? parseTime(time) <= parseTime(startTime)
                          : false;
                        return (
                          <SelectItem
                            disabled={isDisabled}
                            key={time}
                            value={time}
                          >
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
            name="endTime"
          />
        </div>
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("course.group")}
                </FieldLabel>
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
                <FieldLabel htmlFor={field.name}>
                  {t("course.instructor")}
                </FieldLabel>
                <TagsInput
                  className="w-full"
                  onValueChange={(newTags) => {
                    field.handleChange(newTags);
                  }}
                  value={field.state.value}
                >
                  <TagsInputList>
                    {field.state.value.map((instructor) => (
                      <TagsInputItem key={instructor} value={instructor}>
                        {instructor}
                      </TagsInputItem>
                    ))}
                    <TagsInputInput
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      placeholder="Add instructor..."
                    />
                  </TagsInputList>
                </TagsInput>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="instructor"
        />
      </FieldGroup>
      <div className="flex gap-2">
        <Button disabled={form.state.isSubmitting} type="submit">
          {form.state.isSubmitting ? t("form.saving") : t("form.save")}
        </Button>
        <Button
          onClick={() => {
            setIsEditing(false);
            form.reset();
          }}
          type="button"
          variant="outline"
        >
          {t("form.cancel")}
        </Button>
      </div>
    </form>
  );
}
