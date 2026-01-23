# Zustand Rules

## Store Creation and Exports

### Only Export Custom Hooks
- Never export the store directly. Always export custom hooks that wrap selectors.
- This prevents accidental subscription to the entire store and provides a cleaner interface.
- Even if a store has just a single state value, write a custom hook to allow future extensibility.

```typescript
// ❌ Don't export the store
const useBearStore = create((set) => ({
  bears: 0,
  fish: 0,
  increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
}))

// ✅ Export custom hooks
export const useBears = () => useBearStore((state) => state.bears)
export const useFish = () => useBearStore((state) => state.fish)
```

### Prefer Atomic Selectors
- Always use atomic selectors that return primitive values or stable references.
- Avoid returning new Objects or Arrays from selectors unless using shallow comparison.
- If a component needs multiple values, consume multiple hooks rather than returning an object.

```typescript
// ❌ Returns new object every render
const { bears, fish } = useBearStore((state) => ({
  bears: state.bears,
  fish: state.fish,
}))

// ✅ Use separate atomic selectors
export const useBears = () => useBearStore((state) => state.bears)
export const useFish = () => useBearStore((state) => state.fish)

// In component:
const bears = useBears()
const fish = useFish()
```

### Separate Actions from State
- Organize actions into a separate `actions` object in the store.
- Export a single hook for all actions since they never change and don't affect performance.
- Actions can be destructured without performance concerns.

```typescript
const useBearStore = create((set) => ({
  bears: 0,
  fish: 0,
  actions: {
    increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
    eatFish: () => set((state) => ({ fish: state.fish - 1 })),
    removeAllBears: () => set({ bears: 0 }),
  },
}))

export const useBears = () => useBearStore((state) => state.bears)
export const useFish = () => useBearStore((state) => state.fish)
export const useBearActions = () => useBearStore((state) => state.actions)
```

### Model Actions as Events, not Setters
- Actions should represent business events (e.g., "increasePopulation") rather than simple setters.
- Keep business logic inside the store, not in components.
- Components should call actions and let the store decide what to do.

## Store Scope and Organization

### Keep Stores Small
- Create multiple small stores rather than one large store.
- Each store should be responsible for a single piece of state.
- Combine stores using custom hooks when needed.

```typescript
// ✅ Multiple small stores
const useCredentialsStore = create(...)
const useUsersStore = create(...)

// Combine in custom hook
export const useCurrentUser = () => {
  const currentUser = useCredentialsStore((state) => state.currentUser)
  return useUsersStore((state) => state.users[currentUser])
}
```

### Combining with Other Libraries
- Prefer combining Zustand stores with other hooks (like `useQuery`, `useParams`) over combining multiple stores.
- Use custom hooks to combine Zustand state with other React hooks.

```typescript
export const useFilteredTodos = () => {
  const filters = useAppliedFilters()
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
  })
}
```

## React Context Integration

### When to Use Context with Zustand
Use React Context to wrap Zustand stores when you need:
1. **Initialization from Props** - Store needs initial values from component props
2. **Testing** - Easier isolated testing without global state
3. **Reusability/Encapsulation** - Multiple instances of the same component with separate stores

### Context Pattern Implementation

```typescript
const BearStoreContext = React.createContext(null)

export const BearStoreProvider = ({ children, initialBears }) => {
  const storeRef = React.useRef()
  if (!storeRef.current) {
    storeRef.current = createStore((set) => ({
      bears: initialBears ?? 0,
      actions: {
        increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
      },
    }))
  }

  return (
    <BearStoreContext.Provider value={storeRef.current}>
      {children}
    </BearStoreContext.Provider>
  )
}

const useBearStore = (selector) => {
  const store = React.useContext(BearStoreContext)
  if (!store) {
    throw new Error('Missing BearStoreProvider')
  }
  return useStore(store, selector)
}

export const useBears = () => useBearStore((state) => state.bears)
export const useBearActions = () => useBearStore((state) => state.actions)
```

### Benefits of Context Pattern
- Store can be initialized with props directly (no `useEffect` sync needed)
- Testing is simpler - each test gets an isolated store instance
- Components can render multiple instances with separate stores
- Avoids unnecessary re-renders from prop changes

## State Persistence

### When to Use Persist Middleware
- Use persist middleware for client-side preferences, settings, and user data that should survive page refreshes
- Prefer persist middleware over manual localStorage implementations
- Don't persist server state - use React Query or similar for that
- Don't persist actions - they are functions and cannot be serialized

### Basic Persist Implementation
- Always use `persist` middleware from `zustand/middleware` for state persistence
- Use `createJSONStorage` helper to create storage adapter
- Default to `localStorage` for persistent data (survives browser restarts)
- Use `sessionStorage` only when data should not persist across browser sessions
- Always provide a unique `name` for the storage key to avoid conflicts

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  fontSize: number;
  actions: {
    setTheme: (theme: "light" | "dark") => void;
    setFontSize: (size: number) => void;
  };
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      fontSize: 14,
      actions: {
        setTheme: (theme) => set({ theme }),
        setFontSize: (fontSize) => set({ fontSize }),
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### TypeScript Usage
- Use `create<State>()()` syntax (double function call) when using persist middleware with TypeScript
- This ensures proper type inference for the persisted state

```typescript
// ✅ Correct TypeScript syntax with persist
const useStore = create<MyState>()(
  persist(
    (set) => ({
      // state
    }),
    {
      name: "my-storage",
    }
  )
);
```

### Partialize for Selective Persistence
- Always use `partialize` to exclude `actions` and other non-serializable data
- Never persist the `actions` object - functions cannot be serialized
- Only persist state values that are JSON-serializable
- Use `partialize` to include only specific fields, or exclude specific fields

```typescript
// ❌ Don't persist actions
const useStore = create<State>()(
  persist(
    (set) => ({
      count: 0,
      actions: {
        increment: () => set((state) => ({ count: state.count + 1 })),
      },
    }),
    {
      name: "store",
      // Actions will cause errors when serialized
    }
  )
);

// ✅ Exclude actions using partialize
const useStore = create<State>()(
  persist(
    (set) => ({
      count: 0,
      actions: {
        increment: () => set((state) => ({ count: state.count + 1 })),
      },
    }),
    {
      name: "store",
      partialize: (state) => ({ count: state.count }),
    }
  )
);

// ✅ Alternative: Exclude by filtering out actions
const useStore = create<State>()(
  persist(
    (set) => ({
      count: 0,
      name: "John",
      actions: {
        increment: () => set((state) => ({ count: state.count + 1 })),
      },
    }),
    {
      name: "store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== "actions")
        ),
    }
  )
);
```

### Version and Migration
- Use `version` when introducing breaking changes to stored data structure
- Implement `migrate` function to handle version upgrades gracefully
- Always return a valid state from migrate function, even if migration fails
- Test migrations thoroughly with real stored data

```typescript
interface OldState {
  oldField: string;
}

interface NewState {
  newField: string;
  version: number;
}

const useStore = create<NewState>()(
  persist(
    (set) => ({
      newField: "",
      version: 1,
      actions: {
        setField: (value: string) => set({ newField: value }),
      },
    }),
    {
      name: "store",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migrate from version 0 to version 1
          const oldState = persistedState as OldState;
          return {
            newField: oldState.oldField ?? "",
            version: 1,
          };
        }
        return persistedState as NewState;
      },
      partialize: (state) => ({ newField: state.newField, version: state.version }),
    }
  )
);
```

### Storage Options
- Default to `localStorage` via `createJSONStorage(() => localStorage)` for persistent data
- Use `sessionStorage` for temporary data that should clear on browser close
- Only use custom storage implementations for advanced use cases (IndexedDB, AsyncStorage, etc.)

```typescript
// ✅ localStorage (default, persistent)
storage: createJSONStorage(() => localStorage),

// ✅ sessionStorage (temporary)
storage: createJSONStorage(() => sessionStorage),

// ✅ Custom storage (advanced use cases)
const customStorage = {
  getItem: (name: string) => {
    // custom implementation
  },
  setItem: (name: string, value: string) => {
    // custom implementation
  },
  removeItem: (name: string) => {
    // custom implementation
  },
};
storage: createJSONStorage(() => customStorage),
```

### Hydration Considerations
- Understand that `localStorage` is synchronous (hydrates immediately) while `sessionStorage` and custom async storages hydrate asynchronously
- For SSR apps (Next.js), use `skipHydration: true` and manually call `rehydrate()` after mount
- Components that depend on persisted state should check hydration status if needed

```typescript
// For SSR apps (Next.js)
const useStore = create<State>()(
  persist(
    (set) => ({
      // state
    }),
    {
      name: "store",
      skipHydration: true,
    }
  )
);

// In component or app initialization
useEffect(() => {
  useStore.persist.rehydrate();
}, []);
```

### Migration from Manual Persistence
- Replace manual `getStored*` and `saveToStorage` functions with persist middleware
- Remove manual localStorage read/write logic from store creators
- Let persist middleware handle all storage operations automatically
- Use `partialize` to control what gets persisted

```typescript
// ❌ Manual persistence (don't do this)
const STORAGE_KEY = "settings-storage";

const getStoredSize = (): ScheduleSize => {
  if (typeof window === "undefined") return "md";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return "md";
    const parsed = JSON.parse(stored) as { size?: ScheduleSize };
    return parsed.size ?? "md";
  } catch {
    return "md";
  }
};

const saveToStorage = (size: ScheduleSize) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ size }));
  } catch {
    // ignore
  }
};

const useStore = create<State>((set, get) => ({
  size: getStoredSize(),
  actions: {
    setSize: (size: ScheduleSize) => {
      saveToStorage(size);
      set({ size });
    },
  },
}));

// ✅ Use persist middleware instead
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create<State>()(
  persist(
    (set) => ({
      size: "md",
      actions: {
        setSize: (size: ScheduleSize) => set({ size }),
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ size: state.size }),
    }
  )
);
```

### Best Practices
- Always exclude `actions` from persistence using `partialize`
- Use meaningful storage key names (e.g., `schedule-settings` not `store1`)
- Storage errors are handled gracefully by persist middleware automatically
- Use version numbers when changing data structure to enable migrations
- Test migrations thoroughly with real stored data from previous versions
- Don't persist computed values or derived state - only persist source data
- Consider using `merge` option for deep merging nested objects if needed

## General Principles

- Zustand stores should always use selectors - they are optional but should always be used.
- Be explicit about dependencies - Zustand doesn't track fields automatically.
- Keep stores focused on client-side state - prefer server state libraries (React Query, etc.) for server state.
- Use TypeScript for type safety - define proper types for store state and actions.
