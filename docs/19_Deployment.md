# 19_Deployment

## Purpose

The Deployment document details the hosting infrastructure, build settings, content delivery network (CDN) routing, and environment variable configurations for running the **Solar Portfolio** in production.

## Goals

1. **Zero-Downtime Deployments:** Implement clean atomic releases on staging and production branches.
2. **Fast Asset Loading:** Leverage edge caching to deliver models and textures quickly.
3. **VPS Ready:** Provide a clear migration path from serverless environments to self-hosted VPS setups.

## Architecture

The primary architecture relies on **Vercel Serverless Hosting** for edge routing, Next.js page generation, and server actions, integrated with **Cloudflare DNS and CDN caching layers** to speed up static asset deliveries.

```
┌──────────────────────────────────────────────────────────┐
│                   Cloudflare DNS & CDN                   │
│  - Static cache rules for models, textures, and audio     │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Vercel Hosting Platform                  │
│  - Next.js Serverless & Edge API Routes                  │
│  - Static Page Cache & ISR layouts                       │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Supabase & Resend API                    │
│  - Relational database and transaction emails            │
└──────────────────────────────────────────────────────────┘
```

## Decisions

### 1. Vercel Hosting Configuration

- Next.js pages and Server Actions are deployed on Vercel's serverless runtime.
- Core API telemetry routes run on Vercel's Edge runtime to minimize response times.
- The build output is configured to use Incremental Static Regeneration (ISR) for pages like Earth (Projects) and Jupiter (Analytics), rebuilding static layouts in the background.

### 2. Cloudflare CDN Optimization Rules

To reduce load on Vercel and lower bandwidth costs, Cloudflare page rules cache static WebGL assets at the edge:

- **Target Path:** `*domain.com/models/*` and `*domain.com/textures/*`
- **Edge Cache TTL:** Cache assets for **1 Month** (`Cache-Control: public, max-age=2592000`).
- **Browser Cache TTL:** Cache assets for **7 Days**.
- **Cache Level:** "Cache Everything", ensuring assets are served directly from the nearest Cloudflare edge node.

## Tradeoffs

- **Vercel Serverless vs. Self-Hosted VPS (Docker):** Vercel handles deployments and CDN setups automatically, but can become expensive if bandwidth usage spikes. _Decision:_ Start with Vercel for fast initial launching and staging previews, but structure the project using clean environment variables to support easy migration to a self-hosted Docker environment later.

## Future Expansion

- **Dockerized VPS Migration Blueprint:** The codebase contains a production-ready `Dockerfile` at the root. If bandwidth usage grows, the site can be compiled as a standalone Node.js server container and deployed on a VPS (such as Hetzner or DigitalOcean) behind an Nginx reverse proxy.

## Risks

- **Vercel Bandwidth Limits:** Delivering large 3D models directly from the public folder can trigger high bandwidth fees. _Mitigation:_ In addition to Cloudflare edge caching, compress all GLB models to under 2MB and consider hosting assets on external object storage (like AWS S3 or Cloudflare R2) if site traffic spikes.

## Acceptance Criteria

- Deploying changes to the `main` branch triggers an automated production build and release cycle.
- Cache headers confirm that static assets (textures, models) are cached at edge locations.
- SSL certificates are renewed automatically.

## Engineering Notes

- **Standard `Dockerfile` Blueprint for VPS Migration:**

```dockerfile
# Multi-stage build runner
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

- **Build Command Check:** Run `npm run build` locally to confirm the standalone server bundle compiles correctly.
