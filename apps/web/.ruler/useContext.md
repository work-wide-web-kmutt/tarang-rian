# React Context API Rules

## Overview

This project uses the **React Context API** for passing data from parent components to deeply nested descendants without prop drilling. Context is useful for sharing state across component trees, but should be used judiciously to avoid performance issues.

## Core Principles

### When to Use React Context

- **Prop Drilling**: When you need to pass data through multiple levels of component hierarchy
- **Theme Management**: Sharing theme, styling, or UI preferences across the app
- **Authentication**: Providing user authentication state to nested components
- **Localization**: Managing language/locale settings
- **Component-Scoped State**: Managing state that belongs to a specific component subtree (e.g., drawer state, modal state)

### When NOT to Use React Context

- **Frequently Changing State**: Context causes all consumers to re-render on every value change
- **Server State**: Prefer React Query, SWR, or similar libraries for server data
- **Global Application State**: Consider Zustand, Redux, or other state management solutions
- **Simple Parent-Child Communication**: Use props for direct parent-to-child data flow
- **Performance-Critical Components**: Context can cause unnecessary re-renders

## Context Creation

### Basic Context Pattern

```typescript
import { createContext, useContext } from "react";

// Create context with default value
const MyContext = createContext<MyContextValue | null>(null);

// Define context value type
interface MyContextValue {
  value: string;
  setValue: (value: string) => void;
}

// Provider component
export function MyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState("");

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// Custom hook for consuming context
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within MyProvider");
  }
  return context;
}
```

### Context with Default Values

```typescript
// Provide meaningful defaults
const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

// Default values are used when context is consumed outside provider
// Always provide a custom hook that throws if provider is required
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

## Provider Patterns

### Provider Component Structure

- MUST wrap providers around the component tree that needs access
- SHOULD keep provider scope as narrow as possible
- MUST provide stable context values (use `useMemo` or `useCallback` for objects/functions)
- SHOULD handle initialization logic inside the provider

```typescript
export function MyProvider({ children, initialValue }: MyProviderProps) {
  const [state, setState] = useState(initialValue);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      setState,
      // Other values
    }),
    [state]
  );

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}
```

### Multiple Contexts

- Use separate contexts for unrelated concerns
- Nest providers when multiple contexts are needed
- Keep contexts focused on a single responsibility

```typescript
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

## Custom Hooks for Context Consumption

### Always Export Custom Hooks

- NEVER export the context directly
- ALWAYS create a custom hook that wraps `useContext`
- MUST throw an error if context is used outside provider (when required)

```typescript
// ✅ Good: Custom hook with error handling
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within MyProvider");
  }
  return context;
}

// ❌ Bad: Exporting context directly
export { MyContext };
```

### Hook Naming Convention

- Use descriptive names: `useTheme`, `useAuth`, `useCourseVaul`
- Match the context purpose: `useCourseVaulContext` for `CourseVaulContext`
- Keep names concise but clear

## Performance Optimization

### Memoization Strategies

#### Memoize Context Values

```typescript
const contextValue = useMemo(
  () => ({
    state,
    actions: {
      increment: () => setState((s) => s + 1),
      decrement: () => setState((s) => s - 1),
    },
  }),
  [state]
);
```

#### Memoize Callbacks

```typescript
const toggleTheme = useCallback(() => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
}, []);

const contextValue = useMemo(
  () => ({ theme, toggleTheme }),
  [theme, toggleTheme]
);
```

#### Use React.memo for Consumers

```typescript
const ThemeButton = React.memo(() => {
  const { toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle Theme</button>;
});
```

### Splitting Contexts

- Split contexts by update frequency
- Separate static values from dynamic values
- Use multiple small contexts instead of one large context

```typescript
// ✅ Good: Split by update frequency
const ThemeContext = createContext({ theme: "light" });
const ThemeActionsContext = createContext({ toggleTheme: () => {} });

// ❌ Bad: Single context with everything
const AppContext = createContext({
  theme: "light",
  user: null,
  settings: {},
  toggleTheme: () => {},
  updateUser: () => {},
});
```

## Context with Reducers

### Using useReducer with Context

For complex state management within a context:

```typescript
type State = { count: number };
type Action = { type: "increment" } | { type: "decrement" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const contextValue = useMemo(
    () => ({ state, dispatch }),
    [state]
  );

  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  );
}
```

## Component-Scoped Context

### Instance-Scoped State

When each component instance needs its own isolated state:

```typescript
// Context scoped to component instance
const CourseVaulContext = createContext<CourseVaulContextValue | null>(null);

export function CourseVaulProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Effects and logic specific to this instance

  return (
    <CourseVaulContext.Provider value={{ open, setOpen, isEditing, setIsEditing }}>
      {children}
    </CourseVaulContext.Provider>
  );
}

// Each CourseVaul instance has its own provider
function CourseVaul({ children }) {
  return (
    <CourseVaulProvider>
      <Drawer>
        {children}
      </Drawer>
    </CourseVaulProvider>
  );
}
```

## Best Practices

### 1. Keep Contexts Focused

- One context per concern
- Avoid creating "god contexts" that manage everything
- Split contexts when they serve different purposes

### 2. Provide Stable References

- Use `useMemo` for context values
- Use `useCallback` for functions in context
- Avoid creating new objects/functions on every render

### 3. Error Handling

- Always check if context exists before using
- Throw descriptive errors when context is required but missing
- Provide meaningful default values when appropriate

### 4. Type Safety

- Always define TypeScript types for context values
- Use type inference where possible
- Export types for consumers to use

### 5. Testing

- Mock context providers in tests
- Test context providers in isolation
- Verify error handling when context is missing

### 6. Documentation

- Document when context should be used
- Explain the scope of the context
- Provide examples of usage

## Common Patterns

### Theme Context

```typescript
const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### Authentication Context

```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: Credentials) => {
    const user = await authenticate(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

## Anti-Patterns to Avoid

### ❌ Don't Create Context for Everything

```typescript
// ❌ Bad: Context for simple prop passing
const NameContext = createContext("");
function Parent() {
  return (
    <NameContext.Provider value="John">
      <Child />
    </NameContext.Provider>
  );
}

// ✅ Good: Use props
function Parent() {
  return <Child name="John" />;
}
```

### ❌ Don't Put Everything in One Context

```typescript
// ❌ Bad: God context
const AppContext = createContext({
  user: null,
  theme: "light",
  settings: {},
  notifications: [],
  // ... 50 more properties
});

// ✅ Good: Split contexts
const UserContext = createContext({ user: null });
const ThemeContext = createContext({ theme: "light" });
const SettingsContext = createContext({ settings: {} });
```

### ❌ Don't Create New Objects on Every Render

```typescript
// ❌ Bad: New object every render
function Provider({ children }) {
  return (
    <Context.Provider value={{ count, setCount }}>
      {children}
    </Context.Provider>
  );
}

// ✅ Good: Memoized value
function Provider({ children }) {
  const value = useMemo(() => ({ count, setCount }), [count]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

## Notes

- React Context is not a state management solution - it's a dependency injection mechanism
- Context causes re-renders of all consumers when value changes - optimize accordingly
- Use Context for component-scoped state, Zustand for global state, React Query for server state
- Always provide TypeScript types for context values
- Test context providers and consumers separately
- Document context scope and usage patterns
