# The Baobab Group — Backend & Registry Console Implementation Plan

FastAPI (Python 3.12) + PostgreSQL 16 + Cloudflare R2, with the admin UI built as an Angular feature inside this repo.

Companion to `design/IMPLEMENTATION_PLAN.md`, which covers the public site (Phases 0–8, complete). This document covers what PRD §8 deferred as "CMS/backend — this phase is a static prototype only", minus the CMS.

Phases run in order; later phases depend on earlier ones. Each phase is done only when every box under it is ticked.

---

## 0 — Scope and fixed decisions


| Decision              | Choice                                                     |
| --------------------- | ---------------------------------------------------------- |
| Runtime               | FastAPI, Python 3.12                                       |
| Store                 | PostgreSQL 16                                              |
| Data access           | `asyncpg` directly — **no ORM**                            |
| Schema changes        | Numbered plain-SQL files — **no Alembic**                  |
| File storage          | Cloudflare R2, private bucket, presigned URLs              |
| CMS                   | **None this phase** — content stays in typed TS data files |
| Track 1.5 access gate | Request-and-review, not token verification                 |
| Admin UI              | Angular, in this repo, at `/console`                       |


**In scope:** persisting and notifying all seven engagement submissions; the Track 1.5 access-request workflow; document storage and delivery; the Registry Console.

**Out of scope:** a CMS (programs, treaties archive, partner logos, FAQ and stats stay as typed TypeScript constants and change by deploy); multi-language switching; any public authenticated area beyond the console.

### Scope correction against the PRD

PRD §4 describes **five** email-capture points. The built site has **seven** — Partnerships was added after the PRD, and Programs carries both a listing-level and a detail-level capture. The `EngagementSource` union in `src/app/core/models/engagement-request.ts` is authoritative:

```
home-dialogue
programs-sovereign-dialogue
program-confidential-dispatch
resources-addendum
resources-classified-access
contact-form
partnerships-dialogue
```



### The defect this project closes

`EngagementService.submit()` (`src/app/features/engagement/services/engagement.service.ts`) discards its payload (`void request`), fabricates a reference ID in the browser, and resolves after a 300 ms delay. Every visitor who completes a form sees a success modal quoting a `BB-…` reference for a submission that was never sent, stored, or read. Nothing else in this plan matters more than that.

---



## 1 — Service skeleton and deploy pipeline — ~2 days

- [ ] FastAPI app: `app/api/v1/`, `app/schemas/` (Pydantic), `app/repositories/` (all SQL), `app/services/`, `app/core/config.py`, `sql/`
- [ ] Pydantic Settings for all configuration — no hardcoded values, mirroring the front end's rule
- [ ] `asyncpg` pool opened on startup, closed on shutdown, injected as a FastAPI dependency
- [ ] `statement_timeout` (5s) and `idle_in_transaction_session_timeout` set on the pool; `jit=off` on a small instance
- [ ] Ruff + mypy strict in CI; pytest against a throwaway Postgres
- [ ] `GET /healthz` — liveness plus a Postgres round-trip
- [ ] Netlify `/api/*` rewrite live and verified **before any endpoint exists**

```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://api.thebaobabgroup.org/:splat"
  status = 200   # rewrite, not a 302
  force = true
```

`src/environments/environment.prod.ts` already sets `apiBaseUrl: '/api'`. Keep that literal. The rewrite removes CORS preflight entirely, keeps the admin session cookie first-party, and means no environment change between local and production. Locally, `apiBaseUrl` points at `http://localhost:8000/api` and FastAPI's `CORSMiddleware` allows `http://localhost:4200` and nothing else.

**SSR caution:** Angular prerenders routes at build time. No form submission happens during render, so the API is never called server-side — but do not add API calls to page components' construction paths, or prerender starts depending on a live service and builds fail when it is down.

---



## 2 — Schema, SQL files and the migration runner — ~1.5 days

- [ ] `sql/migrations/0001_initial.sql` with the four tables below
- [ ] Migration runner (~40 lines): wraps each file in a transaction, records it in `schema_migrations(version, applied_at, checksum)`, runs on deploy rather than on import
- [ ] Runner refuses to start if a previously applied file's checksum changed
- [ ] Startup assertion comparing the live `source` CHECK constraint against the Python enum — refuses to boot on drift
- [ ] Seed `documents` with the two real files and one admin user
- [ ] Extensions: `citext`, `pgcrypto`

```
engagement_submissions
  id              uuid        pk, default gen_random_uuid()
  reference_id    text        unique, not null   -- 'BB-…', server-issued
  source          text        not null           -- EngagementSource enum, CHECK constrained
  name            text        not null
  email           citext      not null
  message         text        null
  metadata        jsonb       not null default '{}'
  status          text        not null default 'new'   -- new | read | actioned | spam
  ip_hash         text        null               -- sha256(ip + salt), for rate limiting only
  user_agent      text        null
  submitted_at    timestamptz not null default now()
  index on (source, submitted_at desc), (status), (email)

access_requests
  id               uuid        pk
  submission_id    uuid        fk → engagement_submissions(id), unique
  delegation_token text        null              -- as supplied; never trusted as auth
  institution      text        null
  state            text        not null default 'pending'  -- pending | approved | denied | expired
  decided_by       uuid        fk → admin_users(id), null
  decided_at       timestamptz null
  decision_note    text        null
  grant_token      text        null, unique      -- hashed; issued on approval
  grant_expires_at timestamptz null

documents
  id              uuid        pk
  slug            text        unique             -- 'doctrine-summary', 'sanctuary-doctrine'
  title           text        not null
  storage_key     text        not null           -- R2 object key
  classification  text        not null           -- public | restricted
  updated_at      timestamptz not null

admin_users
  id, email (citext unique), password_hash, role, created_at, last_login_at
```

**Reference ID format:** keep the shape the front end already promises — `BB-{base36 timestamp}-{6 chars}` — but issue it server-side. The front end must stop generating it.

---



## 3 — `POST /engagements`, the core endpoint — ~3 days

- [ ] Tests written first: one per source asserting a stored row, plus rejections for bad email, oversized message, unknown source, filled honeypot
- [ ] Pydantic discriminated union on `source` for per-source required fields
- [ ] Persist, issue reference ID, queue notification, return 201
- [ ] Field-level 422 shaped so Angular can map errors back to form controls

```jsonc
// POST /api/v1/engagements
{
  "source": "resources-classified-access",   // one of 7, enum-validated
  "name": "…",                               // 1–200 chars
  "email": "…",                              // RFC-validated + MX-checked
  "message": "…",                            // optional, ≤ 5000
  "metadata": { "…": "…" },                  // optional, ≤ 20 keys, values ≤ 500
  "hp": ""                                   // honeypot: non-empty ⇒ accept silently, discard
}

// 201 Created
{ "referenceId": "BB-M2K9X1-7QF4AZ", "submittedAt": "2026-09-16T10:22:41Z" }

// 422 — field-level
{ "detail": [ { "loc": ["body","email"], "msg": "Enter a valid email address" } ] }

// 429
{ "detail": "Too many requests. Try again in a few minutes." }
```

Per-source rules: `contact-form` requires a message and carries phone and subject in metadata; `program-confidential-dispatch` needs only an email, with the program slug in metadata; the dialogue forms need name and email.

---



## 4 — Angular integration — ~2 days

- [ ] `src/app/core/api/api-client.ts` — wraps `HttpClient` with `environment.apiBaseUrl`
- [ ] `src/app/core/api/engagement.api.ts` — typed request/response
- [ ] `EngagementService.submit()` delegates to it and stops fabricating reference IDs
- [ ] The seven form components keep their current interface — no template or spec changes
- [ ] **Shared submit path gains a** `submitting` **signal, an error branch, and a success guard** (see below)
- [ ] Full suite green (`npm test`), then `npm run verify`



### Blocking defect this phase must fix

All seven components subscribe like this:

```ts
this.engagementService.submit({…}).subscribe((response) => {
  this.analyticsService.trackFormSubmit(…);
  this.successModalService.show(…);
  this.form.reset();
});
```

There is **no error callback and no pending state**. Today that is harmless — the stub cannot fail. The moment it becomes a real HTTP call, any 422, 429, timeout or outage leaves the button live, the form untouched and the user with no feedback. A submit that appears to do nothing is worse than the current fake success, because the visitor retries and the operator gets duplicates.

Fix in the shared submit path, not seven times over:

- [ ] `submitting` signal disabling the button and preventing double submission
- [ ] Error branch mapping 422 `loc` onto the offending control; 429 and 5xx rendered as a readable message beside the button
- [ ] Success modal opens only on a 2xx carrying a server reference ID

Already in place: `provideHttpClient(withInterceptors([errorInterceptor]))` in `app.config.ts`, and `errorInterceptor` itself. The global error path is built and simply has no traffic yet. `EngagementService`'s `Observable` signature was shaped for exactly this swap.

---



## 5 — Notifications — ~2 days

- [ ] Internal alert email, routed by source
- [ ] Acknowledgement to the sender quoting the reference ID
- [ ] Sent from a background task with retry, so a slow provider never delays the HTTP response
- [ ] Transactional provider with a verified sending domain: SPF, DKIM, DMARC

Without correct DNS the acknowledgements land in spam and the site fails silently in a new way.

---



## 6 — Track 1.5 request-and-review gate — ~3 days

- [ ] A `resources-classified-access` submission also creates a `pending` access request (one transaction)
- [ ] Delegation token stored as an unverified claim, shown to the reviewer as context only
- [ ] Approval issues a hashed, single-use, time-limited grant and emails the link
- [ ] `GET /api/v1/access/{grant_token}` redeems once, then redirects to a presigned document URL
- [ ] Denial and expiry recorded, not silent
- [ ] **Front-end copy change** (below)



### Copy change — required

The classified-access success text currently reads as clearance confirmed. It must not imply access was granted:

> ~~"Clearance dispatch confirmed."~~
> **"Access request lodged — your accreditation is under review by the secretariat. If approved, a single-use access link will be sent to this address within two working days."**

Name the decision, the channel and the window. This is the one string that makes the gate honest.

---



## 7 — Document storage and delivery — ~1 day

- [x] Private R2 bucket, no public development URL enabled
- [ ] `aioboto3` against `https://<account>.r2.cloudflarestorage.com` with `region_name="auto"` (R2 speaks S3 SigV4)
- [ ] Presign `get_object` per request — 10 minutes public, 5 minutes restricted; never store a presigned URL
- [ ] Upload with `ContentDisposition: attachment; filename="…"` and explicit `application/pdf`
- [ ] Lifecycle rule keeping old revisions 90 days
- [ ] `GET /api/v1/documents/{slug}` → 302 to the presigned URL

**Fixes a live 404.** `src/app/features/home/components/mission-block/mission-block.html:23` links `/documents/baobab-doctrine-summary.pdf`, and `public/` contains only `favicon.ico` and `images/` — the homepage doctrine download is broken in production today. Repoint it at `/api/v1/documents/doctrine-summary` and let the API redirect.

---



## 8 — Registry Console (Angular, in this repo) — ~5 days

Built per the signed-off mockup. FastAPI stays a pure JSON API — no Jinja2, no server-rendered admin. Reuses the `core/api/` layer from Phase 4.

### 8a — Prerender boundary (do this first)

`src/app/app.routes.server.ts` ends with `{ path: '**', renderMode: RenderMode.Prerender }`. Left alone, the build will prerender `/console` and write static HTML for an authenticated screen into `dist/`.

- [ ] Add an explicit client-rendered entry **above** the wildcard

```ts
export const serverRoutes: ServerRoute[] = [
  { path: 'programs/:slug', renderMode: RenderMode.Prerender, getPrerenderParams },
  { path: 'console/**', renderMode: RenderMode.Client }, // never prerendered
  { path: '**', renderMode: RenderMode.Prerender },
];
```

- [ ] Build assertion failing if `dist/` contains a `console/` directory
- [ ] `noindex, nofollow` on every console route via `SeoService`; `/console` disallowed in `robots.txt`



### 8b — Route and structure

- [ ] `console` as a **sibling** of `PublicLayout` in `app.routes.ts`, not a child — its own shell, no public header/footer/SEO inheritance

```ts
{ path: 'console',
  loadChildren: () => import('./features/console/console.routes')
    .then((m) => m.CONSOLE_ROUTES) }
```

- [ ] `features/console/` with `pages/` (submissions, access-requests, documents, sign-in), `components/` (filter bar, detail drawer, decision panel), `services/`, `models/`
- [ ] Bundle check confirming a public page load pulls in none of it



### 8c — Auth

- [ ] `POST /api/v1/admin/session` sets an `HttpOnly; Secure; SameSite=Strict` cookie; Angular sends it with `withCredentials: true` and never sees the token
- [ ] Functional `authGuard` on console routes; 401 redirects to `/console/sign-in` with a return URL
- [ ] Guard is SSR-safe — returns `true` on the server and lets the API be the authority, or the build breaks on a missing `document`
- [ ] Double-submit CSRF token on every mutating admin call

Do **not** put a JWT in `localStorage`. Any XSS would hand over the whole submissions registry.

### 8d — Shared UI additions

Each recurs across all three console screens, so per `CLAUDE.md` they belong in `shared/ui/`, not inside the console feature:

- [ ] `shared/ui/data-table` — signal inputs for columns and rows, row-click output, keyboard row activation, horizontal scroll container
- [ ] `shared/ui/drawer` — focus trap, Escape to close, focus returned to the invoking row, `aria-modal` (same contract as the existing `modal`)
- [ ] `shared/ui/toast` — `aria-live="polite"`, service-driven, mirroring `SuccessModalService`

Reuse `button`, `badge`, `modal`, `form-field` as-is. State is Signals in a `ConsoleStore` service — the "service for shared app state" tier. Nothing here justifies NgRx.

### 8e — Admin endpoints


| Method & path                                    | Purpose                                                        |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `GET /api/v1/admin/engagements`                  | Paginated, filterable by source, status, date                  |
| `PATCH /api/v1/admin/engagements/{id}`           | Set status — read, actioned, spam                              |
| `GET /api/v1/admin/access-requests`              | The pending review queue                                       |
| `POST /api/v1/admin/access-requests/{id}/decide` | Approve or deny; approval issues the grant and sends the email |




### Cost of building the console in Angular

Two days more than a server-rendered admin, and the public site's build now contains an authenticated area — so prerender config, robots rules and bundle boundaries become things that can regress silently. Steps 8a–8c exist to make that regression loud. In exchange: one codebase, the existing design system, and the console covered by the same Husky pre-push gate as everything else.

---



## 9 — Abuse resistance — ~2 days

Public unauthenticated forms on a site that names heads of state will be scraped and spammed.

- [ ] Honeypot field
- [ ] Minimum time-to-submit
- [ ] Per-IP-hash and per-email rate limits
- [ ] Cloudflare Turnstile on the two highest-value forms if volume warrants it
- [ ] Only a salted hash of the IP is stored, never the address

---



## 10 — Writing the SQL safely

Not a phase — a standing discipline that applies from Phase 2 onward. Dropping the ORM removes the layer that was implicitly preventing injection, so the protection becomes an explicit, enforced convention.

### 1. Every value is a placeholder, always

`asyncpg` uses native protocol-level parameters (`$1`, `$2`) which are never parsed as SQL, so a parameterised query cannot be injected regardless of the value. It also refuses multiple statements in one `execute()`, closing the stacked-query path.

```python
# app/repositories/engagements.py
INSERT_SUBMISSION = """
    INSERT INTO engagement_submissions
        (reference_id, source, name, email, message, metadata, ip_hash, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
    RETURNING reference_id, submitted_at
"""

async def insert_submission(conn: Connection, s: SubmissionIn) -> Record:
    return await conn.fetchrow(
        INSERT_SUBMISSION,
        s.reference_id, s.source.value, s.name, s.email,
        s.message, json.dumps(s.metadata), s.ip_hash, s.user_agent,
    )
```

- [ ] **No f-string,** `%`**,** `.format()` **or** `+` **ever touches a SQL string.** Enforced in CI: Ruff `S608` plus a grep gate over `app/repositories/` failing the build on an f-string containing `SELECT`, `INSERT`, `UPDATE` or `DELETE`

One reviewer having a bad afternoon is exactly how this defect ships. Ban it mechanically, not in a style guide.

### 2. Identifiers come from allow-lists, never from input

Placeholders bind values, not table or column names — so the console's `?sort=` and `?filter=` parameters are the genuine risk surface.

```python
SORTS = {"newest": "submitted_at DESC", "oldest": "submitted_at ASC"}
order_by = SORTS[sort]  # KeyError → 422. The value is never user text.
```



### 3. All SQL lives in the repository layer

- [ ] `app/repositories/` is the only package permitted to hold SQL or import `asyncpg`
- [ ] Routers and services call typed repository functions taking and returning Pydantic models

This keeps the injection surface to a few auditable files and gives the grep gate a precise directory to police.

### 4. The application role is least-privilege

- [ ] Runtime user gets `SELECT, INSERT, UPDATE` on exactly the tables it needs — no `DELETE` on submissions, no DDL, not the owner
- [ ] Migrations run as a separate, higher-privileged role used only by the deploy step

If an injection ever lands, it lands in a role that cannot drop a table.

### 5. Bound the blast radius at the connection

- [ ] Explicit transactions for the multi-statement paths — submission + access-request creation, approval + grant issue — so a partial write is impossible

---



## 11 — Resilience and defensive design — ~3 days

The plan up to here is defensive about **malice** (injection, spam, least privilege) but only patchily about **failure**. This section closes that. The governing principle: every component this system depends on — Postgres, R2, the email provider, the visitor's network — will be unavailable at some point, and the visitor must never be told something succeeded when it did not. That is the exact failure the whole project exists to end; reintroducing it through an unhandled outage would be the same bug in a new costume.

### 11a — Idempotency (the duplicate-submission gap)

Phase 4 notes that a visitor whose submit appears to fail will retry, and the operator gets duplicates. Error states reduce that; they do not fix it. A request that times out at the client may already have committed server-side.

- [ ] Client generates a UUID per form-fill (not per attempt) and sends it as an `Idempotency-Key` header
- [ ] `engagement_submissions` gains `idempotency_key text unique null`
- [ ] Insert uses `ON CONFLICT (idempotency_key) DO NOTHING`, then returns the existing row's reference ID
- [ ] Key is regenerated only after a confirmed success, so a genuine second enquiry is never swallowed

A retry then returns the **same** reference ID rather than creating a second record. This is what makes the phase 4 retry button safe.

### 11b — Progressive enhancement of the forms

This is the one place the plan currently fails Resilient Web Design outright. Public page content is prerendered and readable without JavaScript, but all seven forms are Angular reactive forms: with JS broken, blocked, or still loading, they are inert. For an audience behind ministry proxies and on intermittent Sahel connectivity, that is a real conversion loss, not a theoretical one.

- [ ] Decide explicitly: accept the JS dependency, or add a no-JS path
- [ ] If accepted — document it, and ensure every form is wrapped in a real `<form>` with a `mailto:` or contact-address fallback visible in the markup
- [ ] If not accepted — each form posts to a real endpoint that content-negotiates: JSON for the SPA, a 303 redirect to the success page for a plain form post
- [ ] Either way: the secretariat email address appears near every form, so a visitor whose submission fails has a route that does not depend on this system at all

Recommended: the content-negotiating endpoint. It costs roughly a day and makes the primary conversion flow independent of client-side JS.

### 11c — Client-side network resilience

- [ ] One automatic retry with jittered backoff on network error and 5xx only — never on 4xx, never on a request that may have committed without an idempotency key
- [ ] Explicit request timeout (10s) so a hung connection surfaces as an error rather than a permanently disabled button
- [ ] Offline detection: if `navigator.onLine` is false, say so specifically instead of showing a generic failure
- [ ] Form values preserved on every failure path — never clear the form except on confirmed success



### 11d — Outbound call isolation

The API depends on R2 and an email provider. Neither may be allowed to take the request path down with it.

- [ ] Explicit connect and read timeouts on every R2 and email call — no unbounded waits
- [ ] Email is already out-of-band (phase 5); confirm a failed send **cannot** fail the submission that triggered it
- [ ] Dead-letter table for notifications that exhaust their retries, surfaced in the console — a silently undelivered alert is the original defect again
- [ ] R2 unavailability degrades to a readable "document temporarily unavailable" page, not a 500
- [ ] Circuit breaker on the email provider if failures exceed a threshold, so retries do not pile up behind a dead dependency



### 11e — Degraded mode when Postgres is unavailable

- [ ] Decide the behaviour: fail closed with an honest message, or spool to disk and replay
- [ ] Whichever is chosen, the visitor is told plainly that it did not go through and given the secretariat address
- [ ] `/healthz` distinguishes "process alive" from "database reachable" so the host restarts the right thing
- [ ] Rate limiting fails **closed** on backing-store failure for mutating endpoints, and open for reads



### 11f — Concurrency and races

Two of these are live bugs in the current design, not hypotheticals.

- [ ] **Grant redemption must be atomic.** A single-use link redeemed twice concurrently will both succeed under a naive read-then-write. Redeem with a conditional update — `UPDATE access_requests SET state='redeemed' WHERE grant_token=$1 AND state='approved' RETURNING …` — and treat zero rows as already used
- [ ] **Two reviewers deciding the same request.** The console must send the expected current state and get a 409 on mismatch, rather than the second decision silently overwriting the first
- [ ] Console lists tolerate stale data: refetch after every mutation rather than patching local state optimistically



### 11g — Observability

Currently there is no way to know the system is failing except a visitor complaining.

- [ ] Structured JSON logging with a request ID, propagated to the client and shown in error messages so a report is traceable
- [ ] Never log email addresses, message bodies, delegation tokens or grant tokens
- [ ] Error tracking (Sentry or equivalent) on both the API and the Angular app
- [ ] Alerts on: submission rate dropping to zero for 6h (silent-failure detector), dead-letter depth above zero, access-request queue older than the review SLA, 5xx rate
- [ ] A synthetic canary posting a test submission hourly and alerting if the round trip breaks

The zero-submissions alert matters most. The failure mode this project exists to fix was invisible for months precisely because nothing watched for absence.

### 11h — Backup and restore

Not mentioned anywhere in the plan so far, and this database holds named diplomatic and ministerial contacts.

- [ ] Automated daily backups with point-in-time recovery, retention agreed with the secretariat
- [ ] Backups encrypted at rest and stored outside the primary provider
- [ ] **A restore rehearsed at least once before launch.** An untested backup is not a backup
- [ ] Documented recovery-point and recovery-time objectives



### 11i — Defensive input handling at the edge

- [ ] Request body size cap (e.g. 64 kB) enforced before parsing, not after
- [ ] Reject unexpected top-level fields rather than ignoring them (`model_config = ConfigDict(extra="forbid")`)
- [ ] Bound metadata key count and value length, as already specified in phase 3, and enforce it in the schema rather than in a handler
- [ ] Normalise and case-fold emails on write so duplicate detection and rate limiting cannot be evaded by casing
- [ ] Strip control characters from stored text; render everything in the console as text, never as HTML

---



## 12 — Test and release gates — ~2 days

- [ ] API: pytest against real Postgres — every source, every validation rejection, rate limiting, and the full grant lifecycle including redemption twice and after expiry
- [ ] Injection-shaped fixtures (quotes, `--`, `;DROP`, a 10 kB metadata value) asserting they round-trip as literal text
- [ ] A test that the app role cannot `DELETE` or run DDL
- [ ] Playwright: conversion flows assert a real network call and a real server reference ID, plus the failure path
- [ ] Console: unit specs for the guard, the store and the three new shared components
- [ ] Console E2E: sign-in → review queue → approve; and an unauthenticated `/console` visit redirects rather than rendering
- [ ] Husky pre-push gate extended to cover the API
- [ ] Resilience tests: duplicate submit with the same idempotency key returns one row; concurrent grant redemption succeeds exactly once; a failing email provider does not fail the submission; the API returns a readable error with Postgres stopped

TDD rules from `CLAUDE.md` apply throughout: failing spec first, then implementation, then the full suite.

---



## 13 — Cutover — ~1 day

- [ ] Ship the API first; let it run against the still-stubbed front end
- [ ] Release the front-end change behind a flag
- [ ] Verify a real submission end to end in production
- [ ] Confirm the internal alert arrives
- [ ] Only then remove the stub

Rolling back is a front-end deploy, not a database operation.

---



## Effort

**Roughly 28 working days** for one engineer across the full scope. Phases 1–5 alone — about 10 days — close the defect that matters and make every form on the site real. Section 11 adds roughly 3 days and is the difference between a system that works and one that keeps working.

---



## Open questions — decide before Phase 6

- [ ] **Who reviews access requests, and within what window?** Request-and-review only works if a named person is accountable for the queue. An unattended queue is a slower version of the current failure.
- [ ] **Which inbox receives alerts, per source?** Partnership and contact submissions probably do not go to the same reader.
- [ ] **Is the delegation secretarial token ever issued today?** If credentials already exist, Phase 6 could verify rather than review — a different and stricter build.
- [ ] **Grant expiry and review SLA.** The console mockup and visitor copy currently say 72 hours and two working days. Both are placeholders; pick real numbers, because they are written into what visitors are promised.
- [ ] **Do denied requests get an email?** Currently they get none. Accredited institutions may expect an answer either way.



## Standing risk — data protection

The Resources page publishes a three-item data-protection summary. From Phase 3 that summary becomes a claim about a real database holding named individuals at ministries and multilateral bodies.

- [ ] Confirm the retention period
- [ ] Confirm who may read the console
- [ ] Confirm where the data physically resides
- [ ] Confirm the on-site copy matches what the backend actually does