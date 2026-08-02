---
name: forms
description: Create and change accessible forms in apps/web with @tanstack/react-form, Zod, and the project's shadcn/ui Field components. Use for form state, validation, submission, field arrays, or form error UI.
---

# Web Forms

## Workflow

1. Inspect nearby forms and `src/components/ui/field.tsx` before choosing a pattern.
2. Use `@tanstack/react-form` for state and Zod for schema validation. Do not add a
   second form library. Define the schema outside the component when practical.
3. Make `defaultValues` match the schema exactly. Use `onBlur` plus `onSubmit`
   validators by default; choose `onChange` only when immediate feedback matters.
4. Render a semantic `<form>`. Prevent the browser default before calling
   `form.handleSubmit()`:

   ```tsx
   <form
     onSubmit={(event) => {
       event.preventDefault();
       form.handleSubmit();
     }}
   >
     <FieldGroup>{/* form.Field entries */}</FieldGroup>
   </form>
   ```

5. Use `Field`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldContent`,
   `FieldLabel`, `FieldDescription`, and `FieldError` as appropriate. Use
   `FieldSet`/`FieldLegend` for logical groups and arrays.
6. For each field, connect `FieldLabel htmlFor` to the control `id`, pass the field
   `name`, and keep the control controlled by `field.state.value`.
7. Derive invalid state as `field.state.meta.isTouched && !field.state.meta.isValid`.
   Set `data-invalid` on `Field`, `aria-invalid` on the control, and render
   `FieldError errors={field.state.meta.errors}` beside the control.
8. Use `type="submit"` for submit buttons and `type="button"` for reset buttons.
   Disable or label submit controls while `form.state.isSubmitting`.
9. Keep Zod messages clear and actionable. Show async failures near the action and
   preserve field-level errors near their fields.

## Specialized patterns

Read `references/forms-patterns.md` when implementing select, checkbox, radio,
input-group, responsive, array, dependent-validation, or external-submit patterns.

## Verification

- Keyboard-submit and navigate every control.
- Confirm labels, descriptions, `aria-invalid`, and errors are associated correctly.
- Check untouched fields do not show errors prematurely.
- Test invalid, valid, submitting, reset, async failure, and array edge cases.
- Use user-facing validation text without technical jargon.
