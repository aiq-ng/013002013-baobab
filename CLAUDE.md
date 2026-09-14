# Baobab Website — Project Rules

Read this file, `design/IMPLEMENTATION_PLAN.md`, and `design/about/important_note.txt` before starting or resuming any implementation work. `important_note.txt` is the source of truth for both the architecture and the conversion/UX standard this site must meet — the rules below are derived from it and exist so those standards get checked at build time, not discovered in review.

All design source material (2x exports and the PRD notes) lives under `design/`, organized by page (`design/home/`, `design/about/`, `design/programs/`, `design/partnership/`, `design/contact/`, `design/resources/`). The Angular app source is kept separate from this folder.

## Design fidelity

- [ ] Before building any page, open its 2x export(s) in `design/<page>/` and read exact copy, spacing proportions, and colors from them — don't paraphrase or approximate text content.
- [ ] Match layout, spacing, and color as closely as the export allows. If a value is genuinely ambiguous from the export, flag it to the user instead of guessing.
- [ ] Every page must implement the design's mobile variant too, not just desktop — check for a mobile/desktop pair in the exports before marking a page done.

## Architecture rules (from important_note.txt §1–8)

- [ ] **Feature-based structure only** — no dumping components in one shared `components/` folder. Every business feature lives under `features/<name>/` with its own `components/`, `pages/` (or top-level page component), `services/`, `models/`.
- [ ] **Standalone components + lazy-loaded routes** for every feature — no NgModules, no eagerly-loaded feature routes.
- [ ] **Reusable UI system in `shared/ui/`** before building pages that need it — button, input, modal, card, table, badge, alert, accordion, stat-card, etc. If two pages need the same visual pattern, it belongs in `shared/ui/`, not duplicated.
- [ ] **No repeated long Tailwind class strings.** Any class combination used more than once becomes a shared component or a Tailwind `@apply`/token, not copy-pasted.
- [ ] **Tailwind design tokens defined globally** (brand colors, font sizes, spacing, radii, shadows, breakpoints) in `tailwind.config` before any page styling begins — pages consume tokens, they don't invent new one-off values.
- [ ] **State management by scale, not by default**: Signals for local/component state, a service for shared app state, NgRx only if a genuinely complex global state need actually appears. Don't add NgRx speculatively.
- [ ] **Centralized API layer** in `core/api/` + `core/interceptors/` — one HTTP interceptor, one auth/token handling path, one global error handler, typed request/response models, explicit loading/error states. No feature calls `HttpClient` directly.
- [ ] **Performance defaults**: lazy loading, route-level code splitting, `OnPush` change detection, Signals, optimized/`NgOptimizedImage` images, and avoid pulling in a third-party library when Angular/Tailwind already covers the need.
- [ ] **Mobile-first responsive Tailwind** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4` pattern) — every major component verified at mobile, tablet, and desktop before it's considered done.
- [ ] **Quality gates**: ESLint + Prettier clean, strict TypeScript (no implicit `any`), environment config (not hardcoded values), unit tests for critical logic, E2E tests for the primary conversion flows, CI passing — before a phase is marked complete.

## Conversion/UX standard (from important_note.txt §1–10 top half)

- [ ] **One primary CTA per section.** If a section design shows a secondary action too, it must be visually subordinate (secondary button style), never competing.
- [ ] **Every form** (contact, dispatch, classified-access gate) has real client-side validation with useful error messages — never a silent or dead submit.
- [ ] **No dead-click CTAs** — every button/link resolves to a real route or the shared success flow (per PRD plus the added Partnerships page, all 6 email-capture CTAs → one shared success component).
- [ ] **Semantic HTML + metadata**: `nav`/`main`/`article`/`footer` used correctly, per-route `Title`/`Meta`/Open Graph via `SeoService` — set up per page as it's built, not retrofitted.
- [ ] **Accessible by default**: sufficient contrast, keyboard navigation, ARIA on interactive shared components (accordion, theater-map filter pills, modals) — build this into the shared UI kit once, so every consumer inherits it.
- [ ] **No unnecessary popups or animation** — anything decorative that isn't in the design doesn't get added.
- [ ] **Trust elements treated as first-class**: partner logo strips, stat cards, and testimonials/case-study patterns are shared components, reused verbatim wherever the design repeats them (Home/About/Partnerships/Programs), not rebuilt per page.

## Process rule

- [ ] Work through `design/IMPLEMENTATION_PLAN.md` phases in order — don't start a later phase's page work before the shared UI kit (Phase 1) and Engagement/success flow (Phase 2) exist, since almost every page depends on both.
- [ ] At the end of each phase, walk its checklist items in this file and in `design/IMPLEMENTATION_PLAN.md` and confirm each is actually true before moving on.

## TDD & test discipline

- [ ] **Write the test before the implementation.** For any new component, service, pipe, or interceptor: write a failing spec first (render/behavior for components, inputs/outputs for services), then implement until it passes. Don't write implementation code first and backfill a spec after.
- [ ] **Run the full test suite after every implementation change** — `npm test` (all specs, not just the one touched) — before considering a unit of work done. A change that isn't proven not to break existing specs isn't finished.
- [ ] `npm test` / `ng test` must run the entire spec suite with a single command — no manual listing of files. Keep every `*.spec.ts` discoverable by the default test config; don't hand-pick which specs run.
- [ ] **Pre-push gate**: a git hook (Husky `pre-push`) runs format-check → lint → full test suite → build before any `git push` is allowed to leave the machine. A push is blocked if any step fails — no `--no-verify` bypass.
- [ ] Critical logic (services, form validation, the shared Engagement submit→success flow, shared UI kit components) always gets unit tests. Primary conversion flows (contact form, dispatch forms, classified-access gate) get E2E coverage per Phase 8 — TDD applies at the unit level throughout, E2E is added once the flow exists end-to-end.
