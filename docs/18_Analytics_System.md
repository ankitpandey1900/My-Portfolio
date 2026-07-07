# 18_Analytics_System

## Purpose

The Analytics System document defines the implementation guidelines, telemetry events, database storage, and visualization components for tracking visitor interactions across the **Solar Portfolio**.

## Goals

1. **Accurate Tracking:** Capture key user interactions without relying on heavy third-party tracking scripts.
2. **Privacy Compliance:** Protect user privacy by sanitizing IP addresses and storing only anonymized location data.
3. **Interactive Telemetry:** Build a visual analytics dashboard directly into the 3D space scene.

## Architecture

The system uses a custom-built, lightweight analytics pipeline. Interaction events are sent via fetch requests to Next.js Edge APIs, validated using Zod, and saved in Supabase PostgreSQL tables.

```
┌───────────────────────────────────────────────┐
│               Client-Side HUD                 │
│  - Triggers on warps, downloads, and clicks   │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Vercel Edge API Route            │
│  - Captures GeoIP headers from Cloudflare      │
│  - Sanitizes IP addresses                     │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Supabase Data Store              │
│  - Logs sessions and interaction events       │
└───────────────────────────────────────────────┘
```

## Decisions

### 1. Tracked Events Registry

The system monitors and logs specific user interactions:

- **Session Start:** Logged on initial page load. Captures device type, browser, referrer URL, and location (country code retrieved from Cloudflare headers).
- **Planet Zoom (Travel):** Logged whenever the camera warps to a new planet node. Captures target planet ID (e.g. `Mercury`, `Venus`).
- **Resume Download:** Logged when the "Download Resume" button is clicked. Captures file format (e.g. `PDF`).
- **Inquiry/Quote Submissions:** Logged upon successful form submissions.
- **Meeting Bookings:** Logged when the Calendly/Cal.com overlay is opened.

### 2. Privacy Policy & Anonymization

To maintain privacy, the system does not record IP addresses or personal details in session logs. Location tracking is handled by capturing the country code (via standard headers) and discarding the source IP address before writing to the database.

## Tradeoffs

- **Custom Database Logs vs. Google Analytics / Plausible:** Google Analytics is powerful but adds script weight and raises GDPR tracking concerns. Plausible is lightweight but charges monthly fees and lacks integration hooks for in-app 3D canvas dashboards. _Decision:_ We build our own database tracking table, which keeps our bundle small and allows us to query statistics directly to render our in-game analytics node.

## Future Expansion

- **Real-time Live Heatmap:** Render active sessions as small glowing space probes orbiting the Sun in real time, using Supabase Realtime subscription hooks.

## Risks

- **Database Table Bloat:** Automated bot scripts could spam the tracking endpoints and inflate table size. _Mitigation:_ The Edge API route will filter out bots (checking user-agents) and ignore duplicate events fired within 100ms.

## Acceptance Criteria

- The tracking script runs asynchronously without blocking initial page rendering.
- Location detection correctly parses ISO country codes from incoming headers.
- Data is stored securely; public API calls are blocked from reading analytics tables directly.

## Engineering Notes

- **Analytics Event Dispatcher Script Blueprint (`src/features/analytics/telemetry.ts` outline):**

```ts
export async function trackEvent(eventType: string, payload: Record<string, any> = {}) {
  const sessionId = sessionStorage.getItem('solar_session_id');
  if (!sessionId) return;

  try {
    await fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, eventType, payload }),
    });
  } catch (error) {
    console.error('Failed to log telemetry event:', error);
  }
}
```

- **GeoIP Parsing:** Read the header values `x-vercel-ip-country` or `cf-ipcountry` inside the edge middleware API to log the country location.
