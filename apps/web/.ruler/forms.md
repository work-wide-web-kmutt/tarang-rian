# Forms Rules

## Overview

This project uses **TanStack Form** (`@tanstack/react-form`) with **Zod** for schema validation and **shadcn/ui Field components** for building accessible, type-safe forms.

## Core Principles

### Use TanStack Form for All Forms

- MUST use `@tanstack/react-form` for form state management
- MUST use Zod schemas for validation
- MUST use shadcn/ui Field components (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`) for accessible form structure
- NEVER mix form libraries (e.g., React Hook Form) in the same project

### Type Safety & Validation

- MUST define Zod schemas for all forms
- MUST use explicit types for form values
- MUST validate on appropriate events (onBlur, onChange, onSubmit)
- MUST provide clear, user-friendly error messages in Zod schemas
- SHOULD use Zod's built-in validators before custom validation logic

### Accessibility

- MUST use semantic HTML form elements (`<form>`, `<input>`, `<textarea>`, etc.)
- MUST associate labels with inputs using `htmlFor` and `id` attributes
- MUST use `aria-invalid` on invalid fields
- MUST display errors using `FieldError` component
- MUST provide field descriptions using `FieldDescription` when helpful
- MUST ensure all form controls are keyboard accessible

## Form Structure

### Basic Form Setup

```typescript
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title must be at most 100 characters."),
});

export function MyForm() {
  const form = useForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Handle submission
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Form Element Structure

- MUST wrap form fields in `<form>` element
- MUST prevent default form submission: `e.preventDefault()` before `form.handleSubmit()`
- MUST use `FieldGroup` to group related fields
- MUST use `FieldSet` and `FieldLegend` for logical field groupings (e.g., sections, arrays)
- SHOULD use form `id` and button `form` attribute for submit buttons outside the form element

## Field Components

### Field Component Pattern

Every form field MUST follow this structure:

```typescript
<form.Field
  name="fieldName"
  children={(field) => {
    const isInvalid =
      field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Label Text</FieldLabel>
        {/* Input component */}
        <FieldDescription>Optional help text</FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

### Field Validation State

- MUST check `field.state.meta.isTouched && !field.state.meta.isValid` to determine if field is invalid
- MUST set `data-invalid={isInvalid}` on the `Field` component
- MUST set `aria-invalid={isInvalid}` on the input element
- MUST only show `FieldError` when field is invalid

### Field Labeling

- MUST use `FieldLabel` with `htmlFor` matching the input `id`
- MUST use `field.name` for both `htmlFor` and `id` when possible
- MUST provide descriptive, concise labels
- SHOULD use `FieldDescription` for additional context or instructions

## Input Types

### Text Inputs

```typescript
<Input
  id={field.name}
  name={field.name}
  value={field.state.value}
  onBlur={field.handleBlur}
  onChange={(e) => field.handleChange(e.target.value)}
  aria-invalid={isInvalid}
  placeholder="Optional placeholder"
  type="text"
  autoComplete="off"
/>
```

### Textarea

```typescript
<Textarea
  id={field.name}
  name={field.name}
  value={field.state.value}
  onBlur={field.handleBlur}
  onChange={(e) => field.handleChange(e.target.value)}
  aria-invalid={isInvalid}
  rows={6}
/>
```

### Select

```typescript
<Select
  value={field.state.value}
  onValueChange={(value) => field.handleChange(value)}
>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox

```typescript
<form.Field
  name="acceptTerms"
  children={(field) => {
    return (
      <Field orientation="horizontal">
        <Checkbox
          id={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) =>
            field.handleChange(checked === true)}
        />
        <FieldLabel htmlFor={field.name}>Accept terms</FieldLabel>
      </Field>
    );
  }}
/>
```

### Radio Group

```typescript
<form.Field
  name="option"
  children={(field) => {
    return (
      <Field>
        <FieldLabel>Choose an option</FieldLabel>
        <RadioGroup
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <RadioGroupItem value="option1" id="option1" />
          <RadioGroupLabel htmlFor="option1">Option 1</RadioGroupLabel>
          <RadioGroupItem value="option2" id="option2" />
          <RadioGroupLabel htmlFor="option2">Option 2</RadioGroupLabel>
        </RadioGroup>
      </Field>
    );
  }}
/>
```

## Validation Modes

### Validation Timing

- Use `validators.onBlur` for most fields (validates when user leaves the field)
- Use `validators.onChange` for real-time validation (e.g., password strength, character counts)
- Use `validators.onSubmit` for form-level validation (validates all fields on submit)
- SHOULD combine `onBlur` and `onSubmit` for best UX: validate individual fields on blur, validate entire form on submit

```typescript
const form = useForm({
  defaultValues: { ... },
  validators: {
    onBlur: formSchema, // Validate individual fields
    onSubmit: formSchema, // Validate entire form
  },
});
```

### Error Display

- MUST only show errors after field is touched (`field.state.meta.isTouched`)
- MUST use `FieldError` component to display errors
- MUST pass `errors={field.state.meta.errors}` to `FieldError`
- SHOULD show errors immediately after blur for better UX

## Array Fields

### Array Field Structure

For dynamic lists of fields (e.g., multiple email addresses):

```typescript
<form.Field
  name="emails"
  mode="array"
  children={(field) => {
    return (
      <FieldSet>
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldDescription>
          Add up to 5 email addresses.
        </FieldDescription>
        <FieldGroup>
          {field.state.value.map((_, index) => (
            <form.Field
              key={index}
              name={`emails[${index}].address`}
              children={(subField) => {
                // Sub-field implementation
              }}
            />
          ))}
          <Button
            type="button"
            onClick={() => field.pushValue({ address: "" })}
            disabled={field.state.value.length >= 5}
          >
            Add Email
          </Button>
        </FieldGroup>
      </FieldSet>
    );
  }}
/>
```

### Array Field Operations

- Use `field.pushValue(item)` to add items
- Use `field.removeValue(index)` to remove items
- Use bracket notation for nested fields: `emails[${index}].address`
- MUST validate array length in Zod schema (`.min()`, `.max()`)

### Array Validation

```typescript
const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email("Enter a valid email address."),
      })
    )
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
});
```

## Form Actions

### Submit Button

- MUST use `type="submit"` for submit buttons
- MUST prevent default form submission in `onSubmit` handler
- SHOULD disable submit button while form is submitting
- SHOULD show loading state during submission

```typescript
<Button
  type="submit"
  disabled={form.state.isSubmitting}
>
  {form.state.isSubmitting ? "Submitting..." : "Submit"}
</Button>
```

### Reset Button

- Use `form.reset()` to reset form to default values
- MUST use `type="button"` for reset buttons (not `type="submit"`)

```typescript
<Button
  type="button"
  variant="outline"
  onClick={() => form.reset()}
>
  Reset
</Button>
```

## Input Groups

### Using InputGroup Components

For inputs with addons (e.g., character counts, icons, buttons):

```typescript
<InputGroup>
  <InputGroupInput
    id={field.name}
    name={field.name}
    value={field.state.value}
    onBlur={field.handleBlur}
    onChange={(e) => field.handleChange(e.target.value)}
    aria-invalid={isInvalid}
  />
  <InputGroupAddon align="block-end">
    <InputGroupText className="tabular-nums">
      {field.state.value.length}/100 characters
    </InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

- Use `InputGroup` to wrap input and addons
- Use `InputGroupInput` instead of `Input` when using input groups
- Use `InputGroupTextarea` instead of `Textarea` when using input groups
- Use `InputGroupAddon` for addon elements (text, buttons, icons)
- Use `align="block-end"` for bottom-aligned addons, `align="inline-end"` for right-aligned addons

## Error Handling

### Displaying Errors

- MUST show errors next to the field where the error occurs
- MUST use `FieldError` component for consistent error styling
- MUST only show errors for touched fields
- SHOULD show errors immediately after validation fails

### Error Messages

- MUST provide clear, actionable error messages in Zod schemas
- MUST avoid technical jargon in user-facing error messages
- SHOULD explain what went wrong and how to fix it

## Form Submission

### Async Submission

- MUST handle async operations in `onSubmit`
- SHOULD show loading state during submission
- MUST handle errors appropriately
- SHOULD provide user feedback on success/failure

```typescript
onSubmit: async ({ value }) => {
  try {
    await submitForm(value);
    toast.success("Form submitted successfully");
  } catch (error) {
    toast.error("Failed to submit form");
    // Handle error
  }
}
```

## Best Practices

1. **Schema Organization**: Define Zod schemas outside the component for reusability and type inference

2. **Default Values**: Always provide default values that match the schema structure

3. **Field Naming**: Use descriptive, consistent field names that match your data model

4. **Validation Messages**: Write clear, user-friendly validation messages

5. **Form IDs**: Use form `id` and button `form` attribute when submit button is outside the form element

6. **Character Counts**: Use `tabular-nums` class for character counts to prevent layout shift

7. **Auto-complete**: Set appropriate `autoComplete` attributes for better UX and browser autofill

8. **Placeholders**: Use placeholders sparingly; prefer `FieldDescription` for guidance

9. **Required Fields**: Indicate required fields in labels (e.g., "Email *") and validate in schema

10. **Complex Forms**: Break complex forms into logical sections using `FieldSet` and `FieldLegend`

## Common Patterns

### Form with External Submit Button

```typescript
<form id="my-form" onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
  {/* Fields */}
</form>

<Button type="submit" form="my-form">Submit</Button>
```

### Conditional Fields

```typescript
<form.Field
  name="showAdvanced"
  children={(field) => (
    <Checkbox
      checked={field.state.value}
      onCheckedChange={(checked) => field.handleChange(checked === true)}
    />
  )}
/>

{form.state.values.showAdvanced && (
  <form.Field name="advancedOption" ... />
)}
```

### Dependent Validation

Use Zod's `.refine()` or `.superRefine()` for cross-field validation:

```typescript
const formSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

## Notes

- TanStack Form provides excellent TypeScript support and type inference
- Field components from shadcn/ui ensure consistent, accessible form structure
- Zod schemas can be reused for both client and server-side validation
- Always test forms with keyboard navigation and screen readers
- Consider using `InputGroup` for enhanced input UX (character counts, icons, etc.)
