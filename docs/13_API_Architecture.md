# 13_API_Architecture

## Purpose

The API Architecture document defines the data interfaces, request validation logic, rate limits, and error handling behaviors for the **Solar Portfolio** web service. It maps out both public endpoints and Next.js Server Actions.

## Goals

1. **Clean Validation:** Standardize input validation across all interfaces.
2. **Predictable Payload Structs:** Implement standardized JSON return formats for easy debugging.
3. **Optimized Latency:** Leverage the Vercel Edge runtime to ensure fast API responses.

## Architecture

The API layer is split into **REST API Route Handlers** (used for public Webhook endpoints and telemetry events) and **Next.js Server Actions** (used for React DOM forms and client conversions).

```
                             ┌───────────────────────────────────────────────┐
                             │               Client UI / HUD                 │
                             └──────────────┬─────────────────┬──────────────┘
                                            │                 │
                           Server Actions   │                 │  REST HTTP Requests
                           (Form Submits)   ▼                 ▼  (Telemetry Events)
                             ┌───────────────────────┐   ┌───────────────────────────┐
                             │  submitContactForm    │   │  /api/telemetry/session   │
                             │  submitQuoteRequest   │   │  /api/telemetry/event     │
                             └──────────┬────────────┘   └────────────┬──────────────┘
                                        │                             │
                                        └──────────────┬──────────────┘
                                                       ▼
                                         ┌───────────────────────────┐
                                         │  Zod Schema Validation    │
                                         └─────────────┬─────────────┘
                                                       ▼
                                         ┌───────────────────────────┐
                                         │    Database Connection    │
                                         └───────────────────────────┘
```

## Decisions

### 1. Endpoint Map

#### POST `/api/telemetry/session`

- **Purpose:** Registers a new user session. Runs on Edge runtime.
- **Payload:**
  ```json
  {
    "referrer": "https://google.com",
    "device": "desktop",
    "browser": "Chrome"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "sessionId": "a8b9c1d2-e3f4-5678-abcd-1234567890ab"
  }
  ```

#### POST `/api/telemetry/event`

- **Purpose:** Logs user interactions (downloads, planet warps).
- **Payload:**
  ```json
  {
    "sessionId": "a8b9c1d2-e3f4-5678-abcd-1234567890ab",
    "eventType": "resume_download",
    "payload": { "format": "PDF" }
  }
  ```
- **Response (200 OK):**
  ```json
  { "success": true }
  ```

#### GET `/api/github`

- **Purpose:** Exposes contribution heatmap coordinates. Cached using Next.js ISR (revalidate: 3600).
- **Response (200 OK):** An array of dates and contribution counts.

### 2. Server Actions (Direct Mutations)

- `submitContactForm(data: ContactInput)`: Validates input with Zod, inserts record into Supabase, and uses Resend to email a notification to the administrator.
- `submitQuoteRequest(data: QuoteInput)`: Processes dynamic service options, runs calculations, saves the quote to the database, and returns the estimated pricing back to the UI.

### 3. Error Handling Contract

All API errors return a standard JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided email address is invalid.",
    "details": [{ "path": "email", "issue": "Invalid email formatting" }]
  }
}
```

## Tradeoffs

- **Next.js Server Actions vs. POST Routes for Forms:** POST routes require defining routing boilerplate and manual fetch code. _Decision:_ Use Server Actions for all internal UI form flows. This reduces configuration overhead, gives us built-in CSRF protection, and keeps typing consistent between our forms and APIs.

## Future Expansion

- **GraphQL Node Wrapper:** Group GitHub integrations, telemetry feeds, and project details under a unified `/api/graphql` endpoint, resolving them in a single query.

## Risks

- **Telemetry API Spamming:** Malicious scripts could flood `/api/telemetry/event` and bloat the database. _Mitigation:_ The endpoint will restrict event logging to 10 events per session per minute using Redis token bucket middleware.

## Acceptance Criteria

- Request bodies that do not match Zod schemas are rejected with a 400 Bad Request status code.
- Environment keys (like Resend API keys) are kept server-side and never exposed in client bundles.
- Telemetry routes process requests within 100ms.

## Engineering Notes

- **Zod Schema Blueprint (`src/features/contact/schema.ts` outline):**

```ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Provide a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- **Server Action Error Utility:** Use utility wrappers to catch PostgreSQL query exceptions and map them to clean user-facing error messages.
