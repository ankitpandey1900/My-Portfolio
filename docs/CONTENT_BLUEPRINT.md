# Content Blueprint & Strategy

This document outlines the content structure, reading effort, and interaction design for every piece of data in the portfolio.

## 1. Micro-Copy Principles

- **Tone:** Scientific, direct, premium.
- **Verbosity:** Ruthlessly edited. No wall-of-text.
- **Action-Oriented:** CTAs must be verbs (e.g., `Deploy Meeting`, `Initiate Download`).

---

## 2. Section Blueprints

### A. Home (The Sun)

- **Headline (H1):** [First Name] [Last Name]
- **Subheadline (H2):** Senior Software Engineer & Creative Developer.
- **Quick Stats:** 3 data points (e.g., `5+ YRS EXP`, `30+ PROJECTS`, `LOC: NYC`).
- **Reading Time:** < 5 seconds.

### B. Projects (Saturn)

- **Architecture:** Each project is a card that expands into a full glass modal.
- **Content Required per Project:**
  1. Title & Tagline (1 line)
  2. The Problem (2 sentences)
  3. The Solution / Architecture (3 sentences)
  4. Tech Stack (Array of tags)
  5. Metrics / Impact (e.g., `Increased conversion by 20%`)
- **Reading Time:** 45 seconds per project.

### C. Services (Mars)

- **Architecture:** 3 distinct columns or cards representing tiers.
- **Content Required per Service:**
  1. Service Name (e.g., "Full-Stack Application")
  2. Ideal Client (e.g., "Seed-stage startups")
  3. Deliverables (Bullet list of 4 items)
  4. Timeline (e.g., "4-6 weeks")
- **Interaction:** Hovering a tier expands its height smoothly, revealing the `Book Call` CTA.

### D. GitHub Dashboard (Neptune)

- **Architecture:** Data visualization.
- **Content Required:**
  1. 3D representation or stylized grid of the GitHub contribution graph.
  2. Total Commits (Live data).
  3. Top Languages (Donut chart or stat bars).
- **Interaction:** Hovering a commit block shows the exact date and commit count.

---

## 3. Future CMS Architecture Blueprint

To prepare for Phase 2, the content data model must be strictly typed today.

### Projected Data Models

**`Project` Model:**

- `id`: string
- `title`: string
- `slug`: string
- `description`: text
- `architecture`: text
- `technologies`: string[]
- `liveUrl`: string
- `githubUrl`: string
- `media`: array of image/video URLs
- `featured`: boolean

**`Experience` Model:**

- `id`: string
- `company`: string
- `role`: string
- `startDate`: date
- `endDate`: date | null
- `achievements`: string[]
- `technologies`: string[]
- `type`: 'work' | 'education' | 'hackathon'

**`Testimonial` Model (Crucial for Conversion):**

- `id`: string
- `clientName`: string
- `clientTitle`: string
- `company`: string
- `quote`: text
- `avatarUrl`: string

**`Service` Model:**

- `id`: string
- `title`: string
- `idealClient`: string
- `deliverables`: string[]
- `timeline`: string
- `priceRange`: string

_(All content mapped in this blueprint will initially be stored in `src/data/` as static JSON, structured identically to this schema, allowing for a seamless transition to a headless CMS later)._
