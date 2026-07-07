# 04_Information_Architecture

## Purpose

The Information Architecture (IA) defines the taxonomy, structure, and distribution of information across the **Solar Portfolio**. It establishes how data models, content pages, and UI controls are organized to support smooth visual discovery and solid search engine indexing.

## Goals

1. **Semantic Content Structure:** Organize complex professional portfolios (projects, skills, services, timelines) into clear hierarchies.
2. **Hybrid Spatial/Logical Map:** Provide a seamless mapping between 3D astronomical objects and standard 2D web pages.
3. **SEO-Ready Sitemaps:** Ensure crawlers can access deep content routes directly via traditional URLs.

## Architecture

The Solar Portfolio utilizes a **flat hierarchical structure with orbital taxonomy**. Content is divided into themed sections, each mapped to a celestial body:

```
Solar System (Core Domain)
├── Sun: Home Hub (Landing page / Hero context)
├── Mercury: Skills Node (Interactive inventory)
├── Venus: Chronology Hub (Experience & Education Timeline)
├── Earth: Project Outpost (SaaS, Web3, Open Source cards)
├── Mars: Services Command (Landing pages, Automation, Quotes)
├── Jupiter: Telemetry Array (Visitor analytics & GitHub contribution heatmap)
├── Saturn: Communications Array (Contact, Book meeting, Schedule logs)
└── Outer Ring: Coming Soon Stations (MDX-ready Blog, AI Assistant placeholder)
```

### Route Mapping Grid

Every celestial node corresponds to a unique semantic URL route:

| Celestial Body      | Section Name          | Route         | Data Source                  |
| :------------------ | :-------------------- | :------------ | :--------------------------- |
| **Sun**             | Home Hub              | `/`           | Static Content / MDX         |
| **Mercury**         | Skills Constellation  | `/skills`     | Static / Config Object       |
| **Venus**           | Experience Timeline   | `/experience` | Supabase / Database          |
| **Earth**           | Project Catalog       | `/projects`   | Supabase / GitHub API        |
| **Mars**            | Service Packages      | `/services`   | Config Object / Dynamic Form |
| **Jupiter**         | Telemetry / Analytics | `/telemetry`  | Live Supabase / GitHub API   |
| **Saturn**          | Contact Portal        | `/contact`    | Supabase / Calendly Embed    |
| **Asteroids (TBA)** | Research Logs (Blog)  | `/blog` (V2)  | MDX Files                    |

## Decisions

- **Dynamic Content Nodes via API:** Highly dynamic data (GitHub heatmap, Visitor Analytics) is separated from static info. This allows sections like Earth/Jupiter to query live endpoints without invalidating the static build caches of the rest of the site.
- **Unified HUD Navigation menu:** A secondary global hamburger/command menu provides direct, text-based links to all pages. This ensures visitors don't have to guess what planet corresponds to what professional section.
- **MDX-ready Schema for Future Blog:** The architecture configures `/blog/[slug]` route structures early. The local filesystem holds MDX layouts so that future updates only require dropping `.mdx` files into the content directory.

## Tradeoffs

- **Visual Separation vs. Contextual Grouping:** In traditional portfolios, "Skills" and "Experience" are often grouped together. In the Solar Portfolio, they are separate planets (Mercury and Venus) to prevent UI overload inside a single planet panel. _Mitigation:_ Navigation footers in the planet HUD suggest "Travel to Venus for Experience" as next steps.
- **Nested vs. Flat Routes:** We chose flat routes (e.g. `/projects` instead of `/solar-system/planets/earth/projects`). Flat paths are cleaner, easier to share, and offer better SEO indexing weight.

## Future Expansion

- **Dynamic Deep Linking:** When a user shares a link like `/projects?id=solar-portfolio`, the page loads, spins the solar system, warps the camera to Earth, slides open the Projects panel, and auto-focuses the specific project modal.
- **Localization (i18n) Nodes:** Map system language translations to different orbital quadrants or interface overlays.

## Risks

- **Indexation of 3D-Only Content:** If search bots hit the pages and find only a WebGL `<canvas>` hook, the site will not rank. _Mitigation:_ Ensure that every route (`/skills`, `/projects`, etc.) utilizes Next.js Layouts to pre-render the semantic text content inside hidden/accessible DOM nodes.

## Acceptance Criteria

- The sitemap.xml dynamically lists all route endpoints.
- Each route properly updates the document title, meta description, and open-graph (OG) headers.
- Moving between routes updates the browser history state (`pushState`), enabling back/forward browser button navigation.

## Engineering Notes

- **Next.js App Router Structure:** Put routes in standard directory format: `app/projects/page.tsx`, `app/experience/page.tsx`, etc., each rendering the corresponding React server layout.
- **Metadata Config:** Implement `generateMetadata()` helper in all route directories to inject tailored semantic descriptions for search bots.
