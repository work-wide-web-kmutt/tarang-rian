# dnd-kit Rules

## Overview

This project uses `@dnd-kit/core` for drag-and-drop interactions. dnd-kit provides a modern, accessible, and performant drag-and-drop solution for React.

## Core Principles

### Use dnd-kit for All Drag Interactions

- Use `@dnd-kit/core` for drag-and-drop functionality
- Prefer dnd-kit over native drag events for better accessibility and cross-browser support
- Use `DndContext` to wrap drag-and-drop areas

### Drag-to-Create Pattern

For drag-to-create interactions (like creating custom schedule entries):

- Use `DndContext` as a wrapper for the drag area
- Implement native mouse events (`onMouseDown`, `onMouseMove`, `onMouseUp`) for precise control
- Track drag state locally in component state
- Use `PointerSensor` from dnd-kit for better cross-browser support (when needed)

### Accessibility

- Ensure draggable elements have appropriate ARIA attributes
- Provide keyboard alternatives when possible
- Use semantic HTML where appropriate, but accept that drag interactions may require event handlers on div elements

### Performance

- Use CSS `transform` for moving draggable items (avoids layout recalculations)
- Minimize DOM mutations during drag operations
- Use `useMemo` or `useCallback` for expensive calculations in drag handlers

## Common Patterns

### Basic Drag Context Setup

```typescript
import { DndContext } from "@dnd-kit/core";

function MyComponent() {
  return (
    <DndContext>
      {/* Your draggable/droppable content */}
    </DndContext>
  );
}
```

### Drag-to-Create with Mouse Events

```typescript
const [dragState, setDragState] = useState<DragState | null>(null);

const handleMouseDown = (e: React.MouseEvent, ...args) => {
  // Prevent drag on existing elements
  if (e.target.closest("[data-existing-element]")) {
    return;
  }
  // Start drag tracking
  setDragState({ ... });
};

const handleMouseMove = (e: React.MouseEvent) => {
  if (!dragState) return;
  // Update drag state based on mouse position
  setDragState({ ...dragState, ... });
};

const handleMouseUp = () => {
  if (!dragState) return;
  // Create item based on drag state
  createItem(dragState);
  setDragState(null);
};
```

### Snapping to Grid

- Calculate snap positions based on mouse coordinates
- Use utility functions to convert pixel positions to logical units (e.g., time slots)
- Update preview position in real-time during drag

## Best Practices

1. **Reuse Positioning Utilities**: When showing drag previews, reuse the same positioning logic as final elements to ensure perfect alignment

2. **Prevent Drag on Existing Elements**: Always check if drag starts on existing draggable/droppable elements and prevent default behavior

3. **Clean Up State**: Always clear drag state on mouse up or mouse leave

4. **Validate Drag Duration**: For drag-to-create, validate minimum drag distance/duration before creating items

5. **Visual Feedback**: Provide clear visual feedback during drag (preview blocks, highlighting, etc.)

6. **Error Handling**: Handle edge cases like dragging outside bounds, invalid positions, etc.

## When to Use Native Events vs dnd-kit Hooks

- **Use native events** (`onMouseDown`, etc.) for:
  - Drag-to-create interactions
  - Custom drag behaviors that don't fit standard draggable/droppable patterns
  - Precise control over drag behavior

- **Use dnd-kit hooks** (`useDraggable`, `useDroppable`) for:
  - Reordering lists
  - Moving items between containers
  - Standard drag-and-drop patterns

## Notes

- dnd-kit provides excellent accessibility support, but for custom drag-to-create patterns, native events may be necessary
- Always test drag interactions on touch devices if mobile support is required
- Consider using `PointerSensor` from `@dnd-kit/core` for better touch support in the future
