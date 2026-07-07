# 20_SEO

## Purpose

The SEO document defines the optimization strategies, metadata structures, and structured data schemas for the **Solar Portfolio**. It explains how to maintain search engine visibility on a website that relies heavily on a 3D WebGL canvas.

## Goals

1. **High Search Rankings:** Ensure pages rank highly for keywords related to full-stack engineering, web design, and SaaS development.
2. **Search Engine Indexing:** Make all professional content (projects, services, skills, experience) indexable by search crawlers.
3. **Rich Social Previews:** Generate clean Open Graph (OG) social card previews for sharing on platforms like LinkedIn and X (Twitter).

## Architecture

The system uses a **Hybrid Rendering Strategy**. Next.js Server Components pre-render a complete semantic HTML layout containing all text content. This semantic structure is hidden behind the WebGL Canvas using CSS rules that hide it from visitors while keeping it readable for search crawlers and screen readers.

```
┌──────────────────────────────────────────────────────────┐
│                 Search Engine Crawler                    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Reads pre-rendered HTML DOM
┌──────────────────────────────────────────────────────────┐
│                Next.js Server-Side Layout                │
│  - Semantic HTML5 structure (<article>, <section>)       │
│  - Hidden visually, fully accessible to bots             │
│  - Dynamic metadata generation, JSON-LD Schema           │
└──────────────────────────────────────────────────────────┘
```

## Decisions

### 1. Pre-Rendered Semantic Layouts

- Every virtual route (e.g. `/projects`, `/experience`, `/services`) renders its content inside standard, semantic HTML5 tags (`<main>`, `<article>`, `<section>`, `<h1>`).
- These layout wrappers are hidden from sight using a custom CSS utility class:
  ```css
  .sr-only-layout {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  ```
  This ensures search engines can parse the content without triggering layout shifts or overlaying text on the 3D scene.

### 2. Structured Data Schema (JSON-LD)

We inject structured data into the home layout header to help search engines understand the creator's professional profile:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Developer Name",
  "url": "https://solar-portfolio.com",
  "jobTitle": "Senior Full Stack Engineer & Product Designer",
  "knowsAbout": ["React", "Next.js", "Three.js", "TypeScript", "SaaS Development"],
  "sameAs": ["https://github.com/profile", "https://linkedin.com/in/profile"]
}
```

## Tradeoffs

- **Static Content vs. Client-Side Telemetry Indexing:** Telemetry metrics (such as visitor session counts) are fetched client-side. _Decision:_ Analytics data is not index-critical. We focus SEO optimization efforts on static pages (Home, Projects, Skills, Services, Experience), pre-rendering them on the server to keep search indexes fresh.

## Future Expansion

- **Dynamic OG Image Generator:** Create a Next.js dynamic image endpoint (`/api/og`) that pulls the visitor's location and active project details to render a custom, personalized Open Graph share card.

## Risks

- **Cloaking Penalties:** Search engines can penalize websites that serve different content to crawlers than to regular visitors. _Mitigation:_ Ensure the text content in the hidden semantic HTML nodes matches the text displayed in the interactive HUD overlays exactly.

## Acceptance Criteria

- Search crawlers receive a `200 OK` status and can index the full text content of all route endpoints.
- Open Graph tag verifications pass successfully on LinkedIn Post Inspector and X Card validator interfaces.
- The `sitemap.xml` and `robots.txt` files are compiled and served correctly from the root directory.

## Engineering Notes

- **Dynamic metadata generation blueprint (`src/app/projects/page.tsx` outline):**

```tsx
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Solar Portfolio | Featured SaaS & WebGL Projects',
    description:
      'Explore a portfolio of SaaS platforms, custom AI integrations, and interactive WebGL experiences.',
    openGraph: {
      title: 'Solar Portfolio - Projects Node',
      description: 'Explore custom software development projects.',
      images: [
        {
          url: 'https://solar-portfolio.com/images/og-projects.jpg',
          width: 1200,
          height: 630,
          alt: 'Solar Portfolio Projects Command Outpost',
        },
      ],
    },
  };
};

export default function ProjectsPage() {
  return (
    <main className="sr-only-layout">
      <h1>Featured Projects Outpost</h1>
      <p>Detailed catalog of full stack engineering projects...</p>
    </main>
  );
}
```

- **Metadata validation:** Confirm that all routes render their corresponding titles and descriptions in the compiled HTML headers.
