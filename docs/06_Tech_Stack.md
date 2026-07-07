# 06_Tech_Stack

## Purpose

The Tech Stack document defines and justifies the specific libraries, frameworks, runtime environments, and APIs selected for the **Solar Portfolio**. It establishes version baselines and explains the engineering rationale behind each choice.

## Goals

1. **Developer Efficiency:** Rely on highly mature, standard libraries with robust ecosystems to speed up development.
2. **Minimal Bundle Weight:** Select modular libraries that support tree-shaking to prevent code bloat.
3. **Execution Safety:** Enforce end-to-end type safety from database schemas up to client components.
4. **Cinematic Capability:** Choose tools capable of handling precise timelines, physics-based simulations, and GPU shaders.

## Architecture

The stack is categorized into four distinct layers: **Core Framework**, **3D Graphics Engine**, **State & UI System**, and **Backend/Data Integrations**.

```
┌──────────────────────────────────────────────────────────┐
│                      CORE FRAMEWORK                      │
│            Next.js (App Router) + TypeScript             │
└────────────────────────────┬─────────────────────────────┘
                             │
       ┌─────────────────────┴─────────────────────┐
       ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│       3D GRAPHICS ENGINE     │            │        STATE & UI SYSTEM     │
│  Three.js / R3F / Drei       │            │  Zustand / Framer Motion     │
│  @react-three/postprocessing │            │  GSAP / Tailwind / shadcn/ui │
└──────────────┬───────────────┘            └──────────────┬───────────────┘
               │                                           │
               └─────────────────────┬─────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────┐
│                 BACKEND & INTEGRATIONS                   │
│          Supabase (PostgreSQL) + Resend Mailer           │
└──────────────────────────────────────────────────────────┘
```

### Dependency Catalog

- **Next.js (v14/v15 - App Router):** Framework for routing, server actions, image optimizations, and ISR layouts.
- **React (v18/v19):** Core component model.
- **React Three Fiber (R3F) (v8/v9):** React renderer wrapper for Three.js.
- **Three.js (v0.160+):** Low-level WebGL graphics engine.
- **@react-three/drei:** Utility library for camera controllers, loaders, environment setups, and shapes.
- **@react-three/postprocessing:** High-performance GPU post-processing effects (Bloom, Chromatic Aberration, Noise).
- **Zustand:** Lightweight client state container.
- **GSAP (GreenSock):** Complex camera path interpolation, spatial timeline choreographies.
- **Framer Motion:** DOM element slide-ins, layout transitions, and hover micro-animations.
- **Tailwind CSS:** Layout design utilities.
- **shadcn/ui:** Extensible, copy-paste components built on Radix primitives.
- **React Hook Form & Zod:** Dynamic validation schema models for forms.
- **Resend:** Serverless transactional email dispatcher.
- **Supabase Client (@supabase/supabase-js):** PostgreSQL connectivity, analytics pipelines.
- **Lucide Icons:** SVG icons for the HUD UI.

## Decisions

- **GSAP for Camera and Canvas, Framer Motion for DOM:** GSAP excels at orchestrating raw number properties (such as Three.js vectors) along complex Splines outside React's render loop, making it perfect for camera warps. Framer Motion is highly optimized for CSS/DOM layout animations. We split them according to their strengths.
- **shadcn/ui over Material UI / NextUI:** shadcn/ui components copy code directly into our project files, giving us total CSS/DOM control. This is critical for applying glassmorphism borders and custom glow styles to HUD components.
- **Resend for Email Delivery:** Resend has developer-friendly APIs, fast delivery speeds, and simple React Email templates, avoiding the configuration complexity of Nodemailer or SendGrid.

## Tradeoffs

- **Next.js App Router vs. Vite SPA:** Vite yields a slightly smaller initial bundle, but Next.js offers native SSR/ISR page routing, image optimizations, and server-side Edge APIs. Since **SEO is a key requirement**, Next.js is selected to ensure search crawlers can index the site layout natively.
- **React Three Fiber vs. Vanilla Three.js:** R3F introduces a small library overhead, but its declarative component model makes composing complex scenes, lighting rigs, and responsive viewpoints much more manageable than raw imperative JavaScript.

## Future Expansion

- **React 19 Server Components Optimization:** Ensure compatibility with React 19's server-actions and compiler upgrades to further reduce bundle weights.
- **Dynamic Import Strategy:** Apply dynamic imports (`next/dynamic`) to chunk-load R3F, Three.js, and post-processing files only when the user passes the initial loading screen, reducing initial page script weight.

## Risks

- **Package Version Lockups:** Major version mismatches (e.g. Three.js breaking changes vs. R3F wrappers) can cause builds to fail. _Mitigation:_ Explicitly lock dependency versions in `package.json` and prevent automated minor update bumps (`^`).
- **Supabase Database Session Exhaustion:** Serverless environments spin up database connections rapidly. _Mitigation:_ Rely on Supabase's HTTP REST endpoints via the Javascript client instead of keeping long-lived TCP sockets open.

## Acceptance Criteria

- The project compiles without TypeScript errors.
- Dynamic imports split the JS bundles such that the initial DOM landing shell bundle remains under 150KB.
- Third-party integrations (Supabase, Resend) are fully authenticated via serverless environment variables.

## Engineering Notes

- **ESLint Configuration:** Configure a parser rule in `.eslintrc.json` that prevents importing the entire `lucide-react` library, enforcing individual imports (e.g. `import { Home } from 'lucide-react'`) to enable effective tree-shaking.
- **WebGL Shaders:** Store custom shader code in separate `.glsl` or `.vert`/`.frag` files, using a webpack loader (`raw-loader`) to import them into R3F materials.
