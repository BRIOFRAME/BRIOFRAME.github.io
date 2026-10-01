# My Stay guest portal: connecting your own backend

**Product:** BF-SOLARA-PV-M1 · **Version:** 1.1.0

`my-stay/index.html` is a complete **front-end** guest portal: sign-in, reservation summary and
confirmation, payments and invoices (view, print, download), itinerary, concierge requests,
messages and notices, arrival information and checklist, guest details, account and sign-out.

Out of the box it runs in **demo mode**. `assets/js/portal.js` simulates a booking system in the
browser with sample data from `SOLARA_DATA.portalDemo`. The demo sign-in is **not authentication**.
It is a sessionStorage flag that disappears when the tab closes.

**BRIOFRAME does not supply, host or operate a backend, identity provider, database or file store
for this template.** To run a live portal, you (or your developer) connect it to infrastructure
you own. Your guests' credentials, sessions, bookings, messages, documents, logs and secrets stay
in your environment.

---

## 1. How the front end talks to a backend

The page never calls a server directly. It calls an **adapter**, which is a plain object on
`window.SOLARA_PORTAL_ADAPTER` with these async methods:

| Method | Returns | Notes |
|---|---|---|
| `signIn({ reference, email })` | session | Throw an `Error` with a guest-safe `message` (shown on screen) and a `code`, for example `not_found`, `locked` or `check_email` |
| `getSession()` | session or `null` | Called on page load to restore a signed-in guest |
| `signOut()` | – | End the server session |
| `getStay()` | stay | The whole reservation (shape below) |
| `updateGuest(fields)` | guest | `firstName, lastName, email, phone, country, flight, adults, children, dietary, occasion` |
| `createRequest({ service, date, detail })` | request | Concierge request |
| `sendMessage(text)` | message | Guest → planner message |
| `setChecklist(id, done)` | checklist | Returns the updated checklist array |
| `getDocument(id)` | document | Metadata; the page renders the printable copy |
| `reset()` *(optional)* | – | Demo only. Omit it in live adapters |

When data changes on the server (a planner replies, for example), dispatch
`document.dispatchEvent(new CustomEvent("solara:portal-update"))` and the page refreshes the stay.

```
session = { email, reference, signedInAt, expiresAt }            // ISO timestamps
stay    = { reference, status, confirmedOn, villa, arrival, departure, nights, rate, currency,
            party: { adults, children, infants },
            guest: { firstName, lastName, email, phone, country, flight, dietary, occasion },
            planner: { name, email, phone },
            documents: [{ id, kind: "invoice" | "document", title, issued, amount?, status?, paidOn?, dueOn?, lines?: [[label, amount]] }],
            itinerary: [{ id, date, time, title, detail, status }],
            requests:  [{ id, service, detail, date, status, created }],
            messages:  [{ id, from: "guest" | "planner", at, text }],
            arrivalInfo: { address, checkin, checkout, host, wifi, directions },
            checklist: [{ id, label, done }] }
```

Dates are `YYYY-MM-DD` strings, except message `at` and session times, which are full ISO timestamps.
`villa` is a villa `id` from `data.js`, which supplies the photograph, policies and destination.

### Switching to live

1. Copy `docs/portal/http-adapter.example.js` to `assets/js/portal-adapter.js` and set `API`.
2. In `my-stay/index.html`, add `<script src="../assets/js/portal-adapter.js" defer></script>`
   after `portal.js` and before `pages.js`. You may remove `portal.js` once you are live.
3. In `assets/js/config.js`, set `portal: { mode: "live" }`.
   With `live` mode and no adapter, the page disables sign-in and asks guests to contact reservations.
4. When a real adapter is present, the demo notice, demo access details and "Reset demo data" hide automatically.

## 2. Reference architecture: Azure

This is one proven way to host everything in your own Azure subscription with a same-origin API,
so the Content-Security-Policy can stay at `connect-src 'self'`.

| Concern | Azure service | Notes |
|---|---|---|
| Static site | **Azure Static Web Apps** (Standard plan) | Serves this folder. Copy the headers from `_headers` into `staticwebapp.config.json` → `globalHeaders` |
| Guest sign-in | **Microsoft Entra External ID** (customer tenant) via Static Web Apps custom authentication, *or* passwordless email one-time codes issued by your API | Sessions are HttpOnly cookies set by the platform. Restrict `/api/portal/stay*` to the `authenticated` role in `staticwebapp.config.json` |
| API | **Azure Functions** (managed or linked to the Static Web App at `/api`) | Implements the endpoints in section 3. Read the signed-in principal from the `x-ms-client-principal` header |
| Data | **Azure SQL Database** or **Azure Cosmos DB** | See `schema.example.sql`. Every query is filtered by the signed-in guest's booking |
| Documents | **Azure Blob Storage**, private container | The API streams the file or returns a short-lived, read-only SAS URL, created per request |
| Secrets | **Azure Key Vault** plus managed identity | No connection strings in code or in this repository |
| Email | **Azure Communication Services Email** (or your provider) | One-time codes, planner notifications |
| Monitoring | **Application Insights** | Log sign-in attempts, failures and document access. Do not log message bodies or personal data you don't need |

Other targets work the same way behind the adapter: AWS (Cognito, API Gateway and Lambda, DynamoDB or RDS, S3),
Supabase (Auth, Postgres with Row Level Security, Storage), Firebase (Auth, Firestore rules, Storage),
or a self-hosted Node or .NET API in front of your property-management system. GitHub is for source control,
releases and CI/CD only. It is not an authentication backend.

## 3. API contract used by the example adapter

All routes live under `/api/portal`. They return JSON and require the guest's session cookie,
except `POST /sign-in`.

| Route | Purpose |
|---|---|
| `POST /sign-in` `{ reference, email }` | Look up the booking. **Do not reveal whether a reference exists.** Respond `202 { code: "check_email", message }` after emailing a one-time link or code, or redirect to your identity provider. |
| `GET /session` · `DELETE /session` | Current session, or sign out |
| `GET /stay` | The stay object above, for the signed-in guest only |
| `PATCH /stay/guest` | Validate on the server (party size ≤ villa capacity, lengths, formats) |
| `POST /stay/requests` · `POST /stay/messages` | Create; notify the planner |
| `PUT /stay/checklist/:id` `{ done }` | Update one checklist item |
| `GET /stay/documents/:id` | Metadata, or a short-lived download URL for the stored PDF |

## 4. Security checklist (your backend)

- Authorise every request on the server. A guest may only read or change records linked to their own booking.
  Use row-level security or an equivalent guard, never only the reference in the URL.
- Rate-limit `POST /sign-in` and lock out repeated failures. Make responses identical for unknown and known references.
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`, short expiry, rotated on sign-in, cleared on sign-out.
- Keep documents in private storage. Hand out time-limited links only after authorisation.
- Never take card details in this page. "Pay balance" should open your hosted checkout
  (Stripe Checkout, your booking engine or payment provider). The demo only shows an explanatory note.
- Keep secrets in a vault or in environment variables on the server (see `env.example`). Anything in `assets/js` is public.
- If your API is on another origin, add it to `connect-src` in the CSP meta tag of `my-stay/index.html` and in `_headers`,
  and configure CORS to allow only your site's origin with credentials.
- Keep `<meta name="robots" content="noindex">` on the portal and the `Disallow: /my-stay/` line in `robots.txt`.
- Log sign-ins, failed attempts and document downloads for audit, with retention that matches your privacy policy.

## 5. What you provide

A cloud account, domain, identity tenant or provider, database and storage, email sender, secrets, monitoring,
backups and any ongoing service charges. None of these are included with the template.
