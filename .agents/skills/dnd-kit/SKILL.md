---
name: dnd-kit
description: Add or change accessible drag-and-drop, drag-to-create, or resize interactions in apps/web with @dnd-kit/core. Use when changing DndContext, draggable/droppable elements, sensors, drag previews, or schedule positioning.
---

# dnd-kit Interactions

## Choose the interaction model

- Use `DndContext`, `useDraggable`, and `useDroppable` for standard reordering, moving, and container interactions.
- Use `PointerSensor` and `TouchSensor` with deliberate activation constraints.
- Use custom pointer handlers for schedule-specific drag-to-create and resize flows when standard draggable semantics do not model the interaction precisely.

## Workflow

1. Inspect existing schedule positioning, snapping, and class-key utilities.
2. Keep drag state local and model explicit phases: start, preview, commit, cancel.
3. Reuse the same positioning calculation for preview and final placement. Validate bounds, minimum drag distance, duration, day, and time range before committing.
4. Prevent drag initiation from existing interactive elements when the gesture means something else. Clear state on pointer up, cancel, leave, invalid target, and unmount paths.
5. Use CSS `transform` for movement where possible and minimize DOM work during drag.
6. Provide clear preview, highlight, cursor, and dragging-state feedback. Add a keyboard alternative when the interaction can reasonably support one.
7. Keep draggable controls semantically labeled and expose relevant ARIA state.

## Verification

- Test mouse and touch activation, including accidental click prevention.
- Test valid, invalid, out-of-bounds, too-short, cancelled, and cross-container drags.
- Confirm previews align with final placement and state always resets.
- Confirm keyboard and non-drag alternatives for core actions.
- Check performance while moving many schedule blocks.
