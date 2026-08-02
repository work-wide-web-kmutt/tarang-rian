---
name: react-context
description: Add or change typed React Context providers and consumers in apps/web. Use when introducing context, custom context hooks, provider scope, context performance, or missing-provider behavior.
---

# React Context

## Decide whether Context fits

Use Context for prop drilling, theme, authentication, localization, or state scoped
to one component subtree. Prefer props for direct parent-child communication. Prefer
Zustand for global client state and React Query for server state. Avoid Context for
high-frequency state when consumers would re-render unnecessarily.

## Workflow

1. Define a typed value interface and create a nullable context:

   ```tsx
   const FeatureContext = createContext<FeatureContextValue | null>(null);
   ```

2. Keep the provider scope as narrow as the consumers require. Keep one provider
   focused on one concern; split contexts when update frequencies differ.
3. Export the provider and a custom hook, not the raw context. The hook must throw a
   descriptive error when a required provider is missing:

   ```tsx
   export function useFeatureContext() {
     const context = useContext(FeatureContext);
     if (!context) {
       throw new Error("useFeatureContext must be used within FeatureProvider");
     }
     return context;
   }
   ```

4. Memoize context values and callbacks when they contain objects or functions.
   Avoid creating a new value object on every provider render.
5. For reusable component instances, create an instance-scoped provider rather than
   relying on a global singleton.

## Verification

- Test provider behavior and consumer updates.
- Test the missing-provider error.
- Confirm provider scope and value identity do not cause avoidable re-renders.
- Confirm direct parent-child data still uses props where appropriate.
