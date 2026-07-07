# 25_Roadmap

## Purpose

The Roadmap document establishes the development timeline, sprint milestones, and release strategy for the **Solar Portfolio** over a 12-month development cycle. It outlines what features are delivered when, and schedules post-launch upgrades (such as blogs and AI integrations) for V2.

## Goals

1. **Deliver Structured Milestones:** Break down the project into clear, manageable development phases.
2. **Prioritize Performance:** Integrate performance optimization checks early, rather than waiting until the end of the project.
3. **Establish Clear Goals:** Define measurable acceptance criteria for each development sprint.

## Architecture

The roadmap follows an **Incremental Delivery Schedule**. We start by setting up the project skeleton, build the WebGL graphics engine, layer on HUD interfaces, hook up database APIs, run performance tuning, and launch.

```
Months 1-2:   Setup, Workspace Config, Asset Pipeline Initialization
Months 3-5:   Core 3D Engine, Orbit mechanics, Starfields, Planet Shader configs
Months 6-8:   HUD Interfaces, Planet Cards, Quick Warp search console
Months 9-10:  API & Database integration (Supabase, Resend, GitHub)
Months 11-12: Optimization, Cross-browser tests, Performance Tuning, Launch!
Months 13+:   V2 Upgrades (AI Probe Assistant, Research Log Blog station)
```

## Decisions

### 1. Phase Breakdown

#### Phase 1: Planning & Setup (Months 1-2)

- **Goal:** Configure workspace settings, define design system variables, and establish the asset pipeline.
- **Deliverables:** Directory structure skeleton, `.env` templates, Tailwind variables, and test environments.

#### Phase 2: Core 3D Space Engine (Months 3-5)

- **Goal:** Build the solar system canvas, orbital paths, and camera navigation behaviors.
- **Deliverables:** Stars particle field, Sun emission shaders, 3D planet models (Draco compressed), and GSAP camera travel splines.

#### Phase 3: HUD Interface Layers (Months 6-8)

- **Goal:** Layer UI dashboard panels, navigation controls, and input forms above the 3D canvas.
- **Deliverables:** Glassmorphism overlay panels, quick-warp menus, contact forms, services calculator cards, and custom cursor animations.

#### Phase 4: Data Integrations (Months 9-10)

- **Goal:** Hook up backend services, databases, and third-party APIs.
- **Deliverables:** Supabase PostgreSQL tables, RLS security policies, Resend email actions, and GitHub contribution graphs.

#### Phase 5: Optimization & Launch (Months 11-12)

- **Goal:** Optimize performance, run cross-device tests, and launch the website.
- **Deliverables:** KTX2 texture compressions, dynamic LOD meshes, Lighthouse audit reviews, and production hosting setup.

#### Phase 6: Post-Launch Upgrades (V2)

- **Goal:** Introduce advanced features after launch.
- **Deliverables:** MDX blog logs and interactive AI navigator assistants.

## Tradeoffs

- **Linear vs. Parallel Development:** Building the 3D engine and HUD UI in parallel is faster but can lead to integration conflicts. _Decision:_ We build the project in linear steps (Core 3D -> HUD overlays -> Integrations). This ensures the 3D scene coordinate space is locked and stable before we overlay HUD components and connect APIs.

## Future Expansion

- **Dynamic Content Expansion:** Schedule sprints to add new planets representing new areas of study (e.g. game design, security audits) as the creator's career evolves.

## Risks

- **Scope Creep on 3D Assets:** Spending too much time polishing minor 3D details can cause project delays. _Mitigation:_ Focus on core assets (the Sun and Earth) first, using simple placeholder spheres for other planets to lock navigation flows before final high-poly assets are ready.

## Acceptance Criteria

- Sprints execute on time, and build progress is tracked inside [task.md](file:///C:/Users/ankit/.gemini/antigravity-ide/brain/32d6031c-6adb-4da2-82fe-deccfb72f783/task.md).
- Each phase ends with a review step to verify visual rendering and performance metrics.
- The V1 product release is launched within the scheduled 12-month development cycle.

## Engineering Notes

- **Sprint Progress Reviews:** At the start of each sprint, developers review the specifications in this roadmap to verify goals and acceptance criteria.
