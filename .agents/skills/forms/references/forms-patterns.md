# Form Patterns

Load this reference only when a form needs one of these specialized structures.

## Field baseline

```tsx
<form
  onSubmit={(event) => {
    event.preventDefault();
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
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
            />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    />
  </FieldGroup>
</form>
```

Use `FieldDescription` for helpful context. Render `FieldError` immediately after the control or inside `FieldContent` so errors stay aligned with their field.

## Field groups

- Use vertical `Field` by default.
- Use `orientation="horizontal"` for checkboxes, switches, and compact label/control rows; put label and description inside `FieldContent`.
- Use `orientation="responsive"` with `@container/field-group` on responsive forms.
- Use `FieldSet` and `FieldLegend` for logical sections. Use `FieldSeparator` only when the visual and assistive-technology boundary is useful.

## Controls

- Text controls and textareas must pass `id`, `name`, `value`, `onBlur`, `onChange`, and `aria-invalid`.
- Select controls use `value` and `onValueChange`; keep the trigger labelled by the field label and mark it invalid when needed.
- Checkboxes convert the library value to a boolean with `checked === true` and use horizontal orientation.
- Use `InputGroup` plus `InputGroupInput` and `InputGroupAddon` for icons, buttons, or counters attached to inputs. Use `tabular-nums` for counters.

## Validation and actions

- Use `validators: { onBlur: schema, onSubmit: schema }` for the default UX.
- Use `onChange` only for feedback that must update while typing.
- Show errors only after touch unless the form-level submission state requires a deliberate summary.
- Use `type="submit"` for submit buttons and `type="button"` for reset buttons.
- Disable or relabel submit controls while `form.state.isSubmitting`.
- Use an `id` on the form and a matching `form` attribute for an external submit button.

## Arrays and dependent fields

- Use `mode="array"`, `pushValue`, and `removeValue` for dynamic fields.
- Use bracket notation for nested names, such as `emails[${index}].address`.
- Validate array length with Zod `.min()` and `.max()`.
- Use Zod `.refine()` or `.superRefine()` for cross-field constraints and attach the message to the field that needs correction.
