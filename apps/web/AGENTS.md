# Web Application Agent Guidance

## Scope and Stack

These instructions apply to `apps/web` and supplement repository-root guidance.

- React 19 application built with Vite and TanStack Router.
- TypeScript uses strict mode and `@/*` aliases to `apps/web/src/*`.
- Use existing components under `src/components/ui` before adding primitives.
- Use i18next translation keys for user-facing copy.

## Code Layout

- `src/routes`: TanStack Router route components and route layout.
- `src/components`: feature and shared UI components.
- `src/components/ui`: reusable shadcn-style primitives.
- `src/stores`: client state and persistence.
- `src/course`: course models, schemas, and academic-term logic.
- `src/lib`: shared utilities, parsing, i18n, and integrations.
- `src/constants`: stable schedule and UI constants.
- `src/locales`: English and Thai translations.
- `scripts/generate-content-collections.ts`: content-collection generation.

Keep domain logic in the closest domain module. Keep route components focused on composition and data flow. Reuse existing schedule positioning, snapping, and normalization utilities instead of duplicating them.

## Existing Patterns

- Forms use TanStack Form, Zod, and `Field` components.
- Stores use Zustand selectors, grouped actions, persistence, and migrations where state must survive reloads.
- Context providers are component-scoped when state needs isolated instances.
- Drag interactions use dnd-kit; schedule-specific creation and resizing may use pointer handlers plus existing schedule utilities.
- User-facing text belongs in `src/locales/en` and `src/locales/th`.

## Verification

From repository root, use:

```bash
bun run check
bun run check-types
bun run test
bun run build
```

`check-types` generates content collections before invoking TypeScript. Run the focused web test or type check first during iteration, then the relevant root checks before handoff.

## Task Skills

- `$keyboard-shortcuts` for `@reecelucas/react-use-hotkeys` work.
- `$forms` for TanStack Form, Zod, and Field component work.
- `$dnd-kit` for drag, drop, drag-to-create, and resize work.
- `$zustand` for stores, selectors, persistence, and migrations.
- `$react-context` for typed providers and custom context hooks.
