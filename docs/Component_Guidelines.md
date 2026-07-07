# Component Guidelines

This document details the usage patterns, parameters options, and states for the reusable base UI components.

---

## 1. Button

- **Primary (`variant="primary"`):** Used for primary conversion triggers (e.g. "Download Resume", "Request Quote"). Teal backdrop glow.
- **Secondary (`variant="secondary"`):** Default button for general dashboard options.
- **Outline (`variant="outline"`):** Subtle options or filter controls.
- **Loading state (`loading={true}`):** Disables clicks and prepends a spinner. Use this during form actions or telemetry fetches.

---

## 2. Card

Cards organize dashboard modules:

- **Glass Card (`variant="glass"`):** Overlay cards resting directly above the starfield. Keeps the space background visible.
- **Stat Card (`variant="stat"`):** Visual boxes for data numbers and coords. Outlined with Solar Orange on hover.
- **Project Card (`variant="project"`):** Grid blocks representing portfolio applications. Glows with HUD Teal on hover.

---

## 3. Panel & Modal

- **Panel (`src/components/ui/panel.tsx`):** Slide-out overlays representing detailed planet information. Slide transitions are configured to `500ms` with decel cubic-bezier timings.
- **Modal (`src/components/ui/modal.tsx`):** Dialog overlays for focused conversions (e.g., booking form calendars). Leverages the native `<dialog>` element for built-in keyboard trap and focus accessibility.

---

## 4. Inputs & Forms

Form fields utilize the custom `Input` and `Textarea` components:

- **Labels:** Small capitalized labels with tracking values mapping to the Outfit typeface.
- **States:** Clear highlight outlines on focus. Invalid inputs display a red border (`border-destructive`) and display helper errors below the field.
