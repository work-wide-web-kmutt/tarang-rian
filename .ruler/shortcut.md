# Keyboard Shortcuts

## Overview

This project uses `@reecelucas/react-use-hotkeys` for implementing keyboard shortcuts. This document outlines best practices for adding keyboard shortcuts to ensure consistency, accessibility, and a good user experience.

## Core Principles

### Always Use Modifier Keys

- MUST include at least one modifier key (Cmd/Ctrl, Shift, Alt)
- NEVER use single character shortcuts as they conflict with typing
- SHOULD provide both Mac (Meta) and Windows/Linux (Control) variants

```typescript
// Good: Uses modifier keys with both platform variants
useHotkeys(["Meta+s", "Control+s"], callback);

// Bad: Single character shortcut
useHotkeys("s", callback);
```

### Avoid Conflicts

- NEVER override browser defaults without explicit purpose (Ctrl+C, Ctrl+P, Ctrl+F)
- NEVER override OS shortcuts or screen reader commands
- SHOULD check existing shortcuts before adding new ones
- MUST call `event.preventDefault()` when intentionally overriding system shortcuts

### Common Safe Shortcuts

| Action         | Shortcut           | Notes                                    |
| -------------- | ------------------ | ---------------------------------------- |
| Save/Export    | Cmd/Ctrl+S         | Override browser save with preventDefault |
| Search/Filter  | Cmd/Ctrl+K         | Common command palette pattern           |
| New Item       | Cmd/Ctrl+N         | May conflict with browser new window     |
| Close/Cancel   | Escape             | Standard dismissal key                   |
| Select All     | Cmd/Ctrl+A         | Context-dependent                        |
| Undo           | Cmd/Ctrl+Z         | Context-dependent                        |
| Redo           | Cmd/Ctrl+Shift+Z   | Context-dependent                        |

## Implementation

### Basic Usage

```typescript
import useHotkeys from "@reecelucas/react-use-hotkeys";

function MyComponent() {
  const [open, setOpen] = useState(false);

  useHotkeys(["Meta+k", "Control+k"], (event) => {
    event.preventDefault();
    setOpen(true);
  });

  return <Dialog open={open} onOpenChange={setOpen} />;
}
```

### Conditional Shortcuts

```typescript
useHotkeys(["Meta+s", "Control+s"], callback, {
  enabled: isFeatureEnabled, // Only active when condition is true
});
```

### Input Field Handling

The library automatically ignores shortcuts when the user is typing in INPUT or TEXTAREA elements. To override this behavior:

```typescript
useHotkeys("Escape", callback, {
  ignoredElementWhitelist: ["INPUT", "TEXTAREA"], // Allow in inputs
});
```

## Accessibility

### Use aria-keyshortcuts

- MUST add `aria-keyshortcuts` attribute to elements with keyboard shortcuts
- Format: modifier keys first, separated by `+`, multiple shortcuts separated by space

```tsx
<Button aria-keyshortcuts="Meta+S Control+S">
  Export
</Button>
```

### Visual Discoverability

- MUST display shortcuts visually using the `Kbd` component
- SHOULD show shortcuts in tooltips, menu items, or directly on buttons
- SHOULD document all shortcuts in a help section or cheat sheet

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd";

<Button>
  Export
  <KbdGroup className="ml-2">
    <Kbd>Cmd</Kbd>
    <Kbd>S</Kbd>
  </KbdGroup>
</Button>
```

### Screen Reader Considerations

- Assistive technologies can announce shortcuts via `aria-keyshortcuts`
- NEVER make shortcuts the only way to access functionality
- MUST provide mouse/touch alternatives for all shortcut actions

## Kbd Component

### Basic Usage

```tsx
<Kbd>Cmd</Kbd>
<Kbd>S</Kbd>
```

### Grouping Multiple Keys

```tsx
<KbdGroup>
  <Kbd>Cmd</Kbd>
  <Kbd>Shift</Kbd>
  <Kbd>S</Kbd>
</KbdGroup>
```

### Platform-Aware Display

Consider showing the appropriate modifier for the user's platform:

```tsx
const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

<Kbd>{isMac ? "Cmd" : "Ctrl"}</Kbd>
```

## Testing

- Verify shortcuts work on Mac (Meta key) and Windows/Linux (Control key)
- Confirm browser default behavior is properly prevented when intended
- Test that shortcuts do NOT fire when typing in input fields
- Verify screen readers announce shortcuts via aria-keyshortcuts
- Test with different keyboard layouts (QWERTY, AZERTY, etc.)
- Ensure shortcuts don't interfere with assistive technology

## Best Practices Summary

1. **Use modifiers**: Always include Cmd/Ctrl, Shift, or Alt
2. **Support both platforms**: Provide Meta (Mac) and Control (Windows/Linux) variants
3. **Prevent default**: Call `event.preventDefault()` when overriding system shortcuts
4. **Be accessible**: Add `aria-keyshortcuts` and display shortcuts visually
5. **Don't conflict**: Avoid browser, OS, and screen reader shortcuts
6. **Provide alternatives**: Never make shortcuts the only way to access features
7. **Document shortcuts**: Make them discoverable via UI or help section
8. **Test thoroughly**: Verify across platforms, keyboard layouts, and assistive tech
