# Information Architecture Strategy

## 1. Core Philosophy

The Information Architecture (IA) of this portfolio treats the solar system as a spatial CMS (Content Management System). Navigation is not linear (top-to-bottom); it is orbital (center-to-edge). Users explore based on their intent, but the architecture is strictly designed to pull them into distinct conversion funnels.

## 2. Global Navigation & Utilities

Regardless of where a user is in the solar system, they must have access to:

- **Mission Control (HUD):** A persistent, minimal overlay displaying current system status, audio toggle, and the `[ESC] Return to Orbit` action.
- **Global Escape Hatch:** Fixed `Resume (PDF)` and `Contact` actions in the top-right corner.
- **Quick Navigation (Warp):** A discreet dropdown or radial menu to teleport to specific planets instantly without manual flying.
- **Accessibility Panel:** Opt-in toggles for `Reduced Motion`, `High Contrast`, and `Pause Idle Animations`.

## 3. Conversion Funnels (Persona Architecture)

### 👩‍💼 Recruiter Funnel (The 60-Second Path)

- **Goal:** Verify skills and download resume.
- **Path:** Arrival (Sun) → Quick Stats (HUD) → `Download Resume` (Global CTA).
- **Secondary Path:** Arrival → Earth (Experience) → Interactive Timeline → Contact Comet.
- **IA Priority:** Shallow depth. Important data (Tech Stack) must be visible at level 0 (Arrival).

### 🚀 Startup Founder Funnel

- **Goal:** Find an engineer with product sense.
- **Path:** Arrival → Saturn (Projects) → Read Case Studies → Mars (Services) → Request Discovery Call.
- **IA Priority:** Narrative depth. Projects must prioritize Architecture and Business Impact over raw code.

### 💼 Freelance Client Funnel

- **Goal:** Hire for a specific project.
- **Path:** Arrival → Mars (Services) → Pricing Philosophy → Testimonials → Contact Comet → Cal.com Booking.
- **IA Priority:** Trust and Process. Needs clear deliverables and timelines.

## 4. Future Expansion Architecture

The IA is designed to map perfectly to a headless CMS (like Sanity or Strapi) in the future.

- **Current State:** Hardcoded JSON constants.
- **Phase 2 (CMS):** Projects, Blogs, and Testimonials will be fetched dynamically, allowing the portfolio to grow without code deployment.
- **Phase 3 (Authentication/Portal):** Adding a "Space Station" node that requires a login, serving as a client portal for active freelance contracts (invoices, updates).
