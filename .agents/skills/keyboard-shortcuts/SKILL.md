---
name: keyboard-shortcuts
description: Add accessible, conflict-free keyboard shortcuts in apps/web with @reecelucas/react-use-hotkeys. Use when creating or changing shortcut handlers, command actions, shortcut labels, or shortcut documentation.
---

# Keyboard Shortcuts

## Workflow

1. Search existing shortcut handlers and the target action before choosing a key.
2. Use `@reecelucas/react-use-hotkeys` and include at least one modifier key.
3. Register both `Meta` and `Control` variants when the action is cross-platform:

   ```tsx
   useHotkeys(["Meta+k", "Control+k"], (event) => {
     event.preventDefault();
     openCommandMenu();
   });
   ```

4. Avoid browser defaults, OS shortcuts, and screen-reader commands. Call `event.preventDefault()` only when intentionally overriding a default.
5. Use `enabled` for shortcuts that apply only in a particular feature or mode. Keep the library's input-field ignore behavior unless the shortcut is explicitly useful inside an input; use `ignoredElementWhitelist` only for that exception.

## Accessibility

- Add `aria-keyshortcuts` to the element or control that owns the action. Use `Meta+S Control+S` formatting for multiple platform variants.
- Show the shortcut with existing `Kbd` and `KbdGroup` components in buttons, menus, tooltips, or help UI.
- Keep a mouse, touch, or visible control alternative. A shortcut must never be the only way to reach an action.
- Use platform-appropriate labels (`Cmd` or `Ctrl`) when the UI can detect the user's platform without harming server or test environments.

## Verification

- Test `Meta` on macOS and `Control` on Windows/Linux.
- Confirm intentional browser-default overrides are prevented.
- Confirm shortcuts do not fire while typing in inputs or textareas unless opted in.
- Check keyboard layouts, screen-reader commands, and assistive-technology behavior.
- Confirm the action remains available without a keyboard shortcut.
