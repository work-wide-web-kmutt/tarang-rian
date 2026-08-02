---
name: zustand
description: Add or change Zustand stores in apps/web, including selectors, actions, persistence, storage normalization, and migrations. Use when changing files under src/stores or consuming persisted client state.
---

# Zustand Stores

## Store design

1. Keep each store focused on one client-state concern. Keep server state in the
   existing query/data layer.
2. Keep the `create` store private. Export selector hooks for state and one action
   hook for grouped actions. Use atomic selectors that return primitives or stable
   references; avoid fresh objects and arrays unless shallow comparison is deliberate.
3. Model actions as domain events and keep state transitions inside the store. A
   component should call an action rather than duplicate business logic or setters.
4. Use `getState()` helpers only for intentional non-React consumers; do not expose
   the store itself as a component API.

## Context and instance scope

Use Context around a Zustand store only when initialization comes from props, tests
need isolated instances, or multiple component instances need independent stores.
Use the `$react-context` skill for provider design and missing-provider behavior.

## Persistence

- Use `persist` and `createJSONStorage` for client preferences or local data that
  must survive reloads; do not persist server state.
- Give every store a stable, unique storage `name`.
- Exclude `actions`, functions, and derived values with `partialize`.
- Add `version` and a defensive `migrate` function when the stored shape changes.
- Preserve legacy-data normalization and graceful storage failure behavior.
- Read `references/persistence.md` before changing storage, migration, hydration,
  or merge behavior.

## Verification

- Test selectors and action transitions.
- Test empty, malformed, legacy, and current persisted values.
- Test migration version changes and ensure migrated state is valid.
- Confirm actions are not serialized and storage failures do not break rendering.
- Check hydration behavior when state is read during initial render.
