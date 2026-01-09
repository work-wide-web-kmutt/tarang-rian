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

## General Principles

- Zustand stores should always use selectors - they are optional but should always be used.
- Be explicit about dependencies - Zustand doesn't track fields automatically.
- Keep stores focused on client-side state - prefer server state libraries (React Query, etc.) for server state.
- Use TypeScript for type safety - define proper types for store state and actions.
