# Tarang Rian Agent Guidance

## Scope

These instructions apply to the repository. `apps/web/AGENTS.md` adds guidance for frontend work under `apps/web`.

## Project

- Bun monorepo managed with Turbo.
- `apps/web`: React 19, Vite, TanStack Router, TypeScript, Tailwind CSS.
- `packages/config`: shared TypeScript and tooling configuration.
- `packages/env`: typed environment access.
- `docs/adr`: architecture decisions.

Use Bun. Keep changes scoped to the requested work and inspect existing patterns before adding new abstractions.

## Commands

```bash
bun install          # install dependencies
bun run dev          # develop all workspaces
bun run dev:web      # develop web app only
bun run check        # Oxfmt and Oxlint checks
bun run fix          # Oxfmt and Oxlint fixes; mutates files
bun run check-types  # TypeScript checks
bun run test         # workspace tests
bun run build        # workspace builds
```

CI runs `bun run fix`, `bun run check-types`, `bun run test`, then `bun run build`. Run relevant checks before handoff; run full CI checks when changes affect shared configuration, dependencies, or build behavior.

## TypeScript and React

- Keep TypeScript strict and prefer `unknown` plus narrowing over `any`.
- Use meaningful names and explicit types where they clarify intent.
- Prefer `const`, `for...of`, optional chaining, nullish coalescing, and early returns.
- Await promises in async functions and handle errors with useful context.
- Use function components and call hooks only at the top level.
- Include complete hook dependencies and stable keys for rendered collections.
- Keep components and functions focused; extract complex conditions into named values.
- Remove `console.log`, `debugger`, and `alert` from production code.

## Accessibility and UI

- Use semantic HTML, correct heading hierarchy, labels, meaningful image alt text, keyboard handlers, and ARIA only where needed.
- Use existing project primitives before adding new ones. Use `cn` for class logic.
- Prefer Tailwind defaults for spacing, radius, shadows, colors, and typography.
- Add `aria-label` to icon-only buttons.
- Use `AlertDialog` for destructive or irreversible actions.
- Use `h-dvh`, respect safe-area insets for fixed elements, and show errors beside the action or field that caused them.
- Never block paste in inputs or textareas.
- Do not add animation unless requested. Animate only `transform` and `opacity`, keep interaction feedback under 200ms, pause off-screen loops, and respect `prefers-reduced-motion`.
- Avoid gradients, glow effects, large blur/backdrop surfaces, and custom easing unless explicitly requested.
- Use text balancing for headings, text prettifying for body copy, tabular numbers for data, a fixed z-index scale, and square size utilities where appropriate.

## Skills

Use task-specific skills only when their trigger matches the work:

- `$keyboard-shortcuts`: add or change web keyboard shortcuts.
- `$forms`: create or change forms in `apps/web`.
- `$dnd-kit`: add or change drag-and-drop or resize interactions.
- `$zustand`: add or change Zustand stores, persistence, or migrations.
- `$react-context`: add or change React Context providers or consumers.

## Change Workflow

1. Read the nearest applicable AGENTS.md and inspect related code.
2. Reuse existing components, utilities, state patterns, and tests.
3. Make the smallest complete change; do not rewrite unrelated code.
4. Run formatting/checks appropriate to changed files.
5. Report checks run and any known limitation.
