# The Baobab Group — Website Implementation Plan

Angular (standalone components, signals, lazy-loaded routes) + Tailwind CSS.
Source of truth: `BAOBAB PRD.pdf` and the design screenshots in `home/`, `about/`, `programs/`, `partnership/`, `contact/`, `resources/`, plus `about/important_note.txt` (architecture & conversion standards).

Each phase below should be completed and checked off before moving to the next — later phases depend on earlier ones (esp. the shared UI kit and the Engagement/success flow).

---

## Phase 0 — Foundation ✅ DONE

Angular workspace, tooling, and the architectural skeleton everything else builds on.

- [x] Angular workspace (standalone bootstrap, no NgModules), strict TypeScript
- [x] Tailwind CSS installed + configured with design tokens (brand greens/near-black, type scale, spacing, radii, shadows) pulled from the screenshots
- [x] Folder structure scaffolded: `core/`, `shared/`, `features/`, `layouts/`
- [x] `app.routes.ts` skeleton with lazy-loaded placeholders for every feature route
- [x] ESLint + Prettier configured
- [x] `core/services`: `SeoService` (Title/Meta/OG per route), `AnalyticsService` (event wrapper, provider TBD)
- [x] CI pipeline: format-check, lint, test, build (`.github/workflows/ci.yml`, mirrored by `npm run verify` and the Husky `pre-push` gate)
- [x] `PublicLayout` (header/footer shell wraps `router-outlet`)

Verified via `npm run verify` (Prettier, ESLint, Vitest, `ng build`) all green, plus a live pre-push gate test (broken code blocked the push, fixed code passed through). Unit tests added for `SeoService`, `AnalyticsService`, `errorInterceptor`, and `PublicLayout` per the TDD rule.

---

## Phase 1 — Shared UI Kit

Built once, reused everywhere — this is what keeps every page visually consistent without repeated Tailwind class soup.

- [x] `shared/ui/button` (primary/secondary variants)
- [x] `shared/ui/stat-card`
- [x] `shared/ui/badge` (eyebrow/status labels)
- [x] `shared/ui/logo-strip`
- [x] `shared/ui/accordion` (single-open behavior, ARIA `aria-expanded`)
- [x] `shared/ui/timeline-item`
- [x] `shared/ui/cta-band`
- [x] `shared/ui/card`
- [x] `shared/theater-map` — filter pills + markers, data-driven (consumed later by Home/Programs/About with different inputs)
- [x] `layouts/public-layout`: header (wordmark, nav: Home/Programs/Resources/About Us/Contact Us, persistent "Strategic Partnerships" CTA routed to the engagement entry point) + footer (thematic focus, regional hubs, doctrine & records, contact details, legal links: Security Protocol, Diplomatic Status, Portal Login — link present, no auth area)

---

## Phase 2 — Engagement Feature (shared submit → success flow) ✅ DONE

Build before any page that has a form — 5 different entry points across the site all depend on this.

- [x] `features/engagement/services/engagement.service.ts` — single `submit()` method (mocked/stubbed API call; real CMS/backend is out of scope this phase), returns a reference ID
- [x] `core/models/engagement-request.ts` — typed request model
- [x] `features/engagement/success` — shared success component: checkmark icon, headline, subtext, reference ID, primary CTA (return home), secondary link (send another) — parameterized by confirmation copy so it can serve all 5 flows
- [x] Route wired: `/success` (or similar), accepts params/query for reference ID + source context
- [x] Reactive form validation pattern established (to be reused by contact form, dispatch forms, classified gate)

---

## Phase 3 — Home

- [ ] Hero with 4 live stat counters (km secured, pacts, de-escalation %, states)
- [ ] Trust ribbon
- [ ] Mission block with doctrine download
- [ ] Partner logo strip (`shared/ui/logo-strip`)
- [ ] Track 1.5 model — 3-column (Track 1 / Track 1.5 pivot / Track 2)
- [ ] 4-step conciliation cycle
- [ ] 3 operational theater previews
- [ ] Impact stats row
- [ ] Closing dual-CTA band
- [ ] Home dialogue box wired to `EngagementService`

---

## Phase 4 — About Us

- [ ] Hero with mission/vision copy
- [ ] Documentary video embed
- [ ] Two-tone mission/vision panel
- [ ] Partner logo strip (reused)
- [ ] Active program grid (shared component, reused from Programs feature)
- [ ] Interactive theater map (reused `shared/theater-map`)

---

## Phase 5 — Programs (listing + detail)

- [ ] Programs listing: hero (headline + photo)
- [ ] 4 strategic pillars
- [ ] 6-item active program grid (shared component, also used on About)
- [ ] Interactive theater map w/ filter pills driving the grid below it
- [ ] Sovereign dialogue email capture → `EngagementService`
- [ ] Partner logo strip
- [ ] Program detail: dynamic `program/:slug` template (data-driven, one template for all programs)
- [ ] Breadcrumb + reference/clearance metadata
- [ ] Program header
- [ ] 4 KPI stat cards
- [ ] Doctrine narrative with inline stats
- [ ] 3 operational pillars
- [ ] Dated accord milestone timeline
- [ ] Confidential dispatch email capture → `EngagementService`

---

## Phase 6 — Resources

- [ ] Hero with accreditation/cycle/language tags (static language list — no switcher)
- [ ] Featured document card: excerpt, PDF download, addendum email capture → `EngagementService`
- [ ] Filterable treaties archive list
- [ ] Sovereign sanctuary doctrine explainer with classified access gate form → `EngagementService`
- [ ] 3-item data protection summary

---

## Phase 7 — Contact Us

- [ ] Hero with contact details
- [ ] Form panel (first name, last name, email, phone, subject, message) → `EngagementService`
- [ ] Location photo banner
- [ ] FAQ accordion (`shared/ui/accordion`, single-open, first item expanded by default)
- [ ] Closing CTA band

---

## Phase 8 — Hardening & QA

- [ ] SEO: per-route Title/Meta/Open Graph via `SeoService`, semantic HTML (`nav`, `main`, `article`)
- [ ] SSR (Angular Universal) for crawlability + first paint
- [ ] Analytics events wired on every CTA and form submission
- [ ] Accessibility audit (contrast, keyboard nav, ARIA on accordion/timeline/theater-map)
- [ ] `NgOptimizedImage` on all hero/photo assets, OnPush change detection across components
- [ ] Lighthouse / Core Web Vitals pass
- [ ] 404 and error pages
- [ ] Unit tests for shared UI kit + `EngagementService`
- [ ] E2E tests for the primary flow (Home → browse → initiate engagement → submit → success) and the two supporting flows (Programs → detail → dispatch; Resources → classified gate → success)

---

## Final Sign-off Checklist (PRD traceability)

**Site map**
- [ ] Home
- [ ] Programs (listing)
- [ ] Program detail
- [ ] Resources
- [ ] About Us
- [ ] Contact Us
- [ ] Success confirmation (shared)

**Global**
- [ ] Header nav + persistent "Strategic Partnerships" CTA (same destination from every page)
- [ ] Footer (thematic focus, regional hubs, doctrine & records, contact, legal links)
- [ ] All 5 email-capture CTAs resolve to the single shared success component

**Interaction notes**
- [ ] Theater map filter pills drive both markers and program grid
- [ ] FAQ accordion allows only one open item at a time
- [ ] No dead-click CTAs anywhere on the site

**Explicitly out of scope this phase (confirm NOT built)**
- [ ] No real CMS/backend (mocked/stubbed submissions only)
- [ ] No language switcher
- [ ] No authenticated portal login

**Success criteria**
- [ ] Every CTA resolves to a real destination
- [ ] All 5 form entry points connect to the single shared success state
- [ ] Nav, filters, and accordion are functionally interactive, not static
