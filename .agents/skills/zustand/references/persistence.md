# Zustand Persistence and Migration

Load this reference when changing persisted state, storage adapters, hydration, or
legacy-data migration.

## Baseline

Use the TypeScript middleware form:

```tsx
const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      size: "md",
      actions: {
        setSize: (size) => set({ size }),
      },
    }),
    {
      name: "schedule-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ size: state.size }),
    }
  )
);
```

Persist only JSON-serializable source state. Never persist the `actions` object,
functions, or values that can be derived from persisted state.

## Versioning and migration

- Add `version` when the persisted shape changes.
- Implement `migrate(persistedState, version)` defensively for malformed and legacy
  values. Return a valid current state even when migration cannot recognize input.
- Normalize old arrays or pre-persist shapes before the store consumes them.
- Use `merge` when persisted data must be combined with current defaults.
- Test every supported legacy shape, current shape, malformed value, and fallback.

The existing stores demonstrate these patterns:

- `selected.ts` normalizes old schedule arrays and uses a custom storage adapter.
- `academic-context.ts` restores a valid academic term or falls back to the latest
  catalog term.
- `schedule-settings.ts` normalizes time ranges and merges current defaults.

## Storage and hydration

- Use `localStorage` for preferences that survive browser restarts.
- Use `sessionStorage` only for session-scoped state.
- Guard browser storage access when code can execute outside a browser.
- Catch storage failures without breaking rendering.
- For SSR or asynchronous storage, explicitly consider hydration timing and whether
  delayed `rehydrate()` or a hydration guard is required. This Vite app currently
  uses browser-local persistence rather than an SSR store.
