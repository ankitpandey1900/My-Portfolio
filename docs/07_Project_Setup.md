# 07_Project_Setup

## Purpose

The Project Setup document provides a comprehensive developer guide to configure, initialize, run, and deploy the **Solar Portfolio** workspace. It acts as an onboarding guide to ensure environment setups are consistent across all developer workstations.

## Goals

1. **Zero-friction Onboarding:** Clear, actionable step-by-step commands to get the site running locally under 5 minutes.
2. **Environment Integrity:** Enforce strict verification of all local config flags and access tokens.
3. **Structured Scripts:** Standardize npm scripts for compiling, testing, linting, and formatting.

## Architecture

The local development environment is configured to run inside a Node.js workspace, mimicking Vercel's edge environment constraints.

```
                  ┌───────────────────────────────────────────────┐
                  │          Developer Machine / VS Code          │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Read local .env.local variables    │
                      └───────────────────┬───────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│     Local Dev Node (npm run dev)  │           │      Database Stack (Supabase)    │
│  - Port 3000 (React Server app)   │           │  - Local migrations & DB seeding  │
│  - Hot Module Reload (HMR)        │           │  - RLS Policies & SQL Schema      │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

## Decisions

- **Node.js LTS Core:** Lock the project runtime to Node.js v20.x (LTS) or higher to guarantee compatibility with Next.js edge adapters.
- **PNPM / NPM Consistency:** We will standardize on `npm` as the package manager since it requires zero secondary installations on fresh developer setups.
- **Separated Local DB Environment:** Utilize local Supabase CLI configs for migrations and seed data before applying changes to the live production database.

## Tradeoffs

- **Local Supabase Docker Stack vs. Remote Dev Project:** Running a local Docker stack for Supabase is ideal for offline development, but it requires Docker to be running on the developer's computer. _Decision:_ We provide configurations for both: a direct connection to a remote development sandbox project (e.g. `supabase.co`) and a local Supabase CLI setup for developers with Docker configured.

## Future Expansion

- **Dockerized App Shell:** Add a `Dockerfile` for multi-stage production builds to allow deploying onto VPS providers (like DigitalOcean, Hetzner, or AWS EC2).
- **Automated CI/CD Workflows:** Define GitHub Action scripts that automate testing and preview deployments on pull requests.

## Risks

- **Missing Secret Environment Keys:** The app will crash if it tries to boot without connection details for Supabase or Resend. _Mitigation:_ We include a startup script (`src/lib/env-check.ts`) that asserts the existence of all critical keys, terminating process execution early with readable, actionable errors if any are missing.

## Acceptance Criteria

- Running `npm install` runs successfully without warnings or dependency conflicts.
- Running `npm run dev` boots the server on `http://localhost:3000` with hot-reload functional.
- Local TypeScript builds compile successfully with no lint or formatting exceptions.

## Engineering Notes

### 1. Pre-requisites

- **Node.js:** v20.x (LTS) or higher.
- **NPM:** v10.x or higher.
- **Supabase CLI:** (Optional) for local DB migrations.

### 2. Initialization Blueprint

Follow this script block sequence to initialize the project:

```bash
# Clone the repository and navigate to root
cd portfolio

# Install dependencies exactly as locked in package.lock
npm ci

# Initialize shadcn/ui components
npx shadcn@latest init

# Add required UI components
npx shadcn@latest add button card dialog form input textarea toast
```

### 3. Environment Config Blueprint

Create a `.env.local` file at the root of the project:

```env
# Next.js Server & Client Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Transactional Mail Config (Resend)
RESEND_API_KEY=re_123456789abcdef...
NOTIFICATION_EMAIL_RECIPIENT=your-inbox@domain.com

# GitHub Integration Config (For Contribution Heatmap)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_abcdef123456789...
```

### 4. NPM Script Targets

- `npm run dev` - Launches Next.js local server.
- `npm run build` - Compiles the project for production.
- `npm run lint` - Executes ESLint analysis.
- `npm run format` - Standardizes spacing/style via Prettier.
