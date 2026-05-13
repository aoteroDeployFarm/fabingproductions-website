# Changelog

All notable changes to the Fabing Productions website are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Deployment target:** Firebase Hosting → Site ID `fabingproductions-website` (GCP project `botridge`)  
> **Live URL:** https://fabingproductions-website.web.app  
> **Safety rule:** All deploys use `firebase deploy --only hosting:fabing` — `botridge` and `botridge-admin` sites are never modified.

---

## [Unreleased]

### Planned
- Real audio file assets for AudioPlayer sample tracks
- Studio facility photography for `/studio` page hero and facility cards
- `og-image.jpg` for Open Graph social preview
- `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_APP_ID` filled in → live Firestore client connection
- EmailJS template configuration and send testing
- Cloudflare custom domain `fabingproductions.com` connected to `fabingproductions-website` site
- Cloudflare secrets (`CF_ZONE_ID`, `CF_API_TOKEN`) wired to GitHub Actions
- Analytics integration (Google Analytics 4 or Cloudflare Web Analytics)
- `robots.txt` and `sitemap.xml` for search indexing
- PWA manifest (`manifest.json`) and service worker for offline support
- Performance audit (Lighthouse CI gate in GitHub Actions)

---

## [0.5.0] — 2026-05-13 · Phase 2 · Staging — First Production Deploy

### Added
- **Live hosting site** — `fabingproductions-website` created on GCP project `botridge`; live at `https://fabingproductions-website.web.app`
- **Firestore production seed** — 8 portfolio entries batch-committed to live `productions` collection via Application Default Credentials: 3 Audio, 3 Video, 2 Live Events; ordered by `year desc`

### Changed
- **`.firebaserc`** — `fabing` target remapped from stale `fabing-productions` → `fabingproductions-website`; stale entry removed to prevent multi-site deploy
- **`CHANGELOG.md`** — deployment target header updated to reflect new Site ID and live URL

---

## [0.4.0] — 2026-05-13 · Phase 2 · Staging — Firebase Emulator Integration

### Added
- **`VITE_USE_EMULATOR` flag** — `.env.local` now includes `VITE_USE_EMULATOR=false`; set to `true` to route all Firebase calls through the local Emulator Suite without any code changes
- **Firestore emulator connection** — `connectFirestoreEmulator(db, 'localhost', 8080, { merge: true })`; `{ merge: true }` prevents double-connect crashes on Vite HMR module re-evaluation
- **Functions emulator connection** — `connectFunctionsEmulator(functions, 'localhost', 5001)`
- **`auth` export** — `getAuth(app)` wrapped in try-catch IIFE; gracefully returns `null` when API key is absent (dev without credentials) rather than crashing the app at module load time
- **`storage` export** — `getStorage(app)` wrapped identically; same null-safe pattern
- **`app` export** — Firebase App instance now exported for consumers that need direct access

### Changed
- **`src/lib/firebase.js`** — full refactor: HMR guard via `getApps().length ? getApp() : initializeApp(config)` prevents "Firebase App already exists" error on Vite hot reload; exports expanded from 2 (`db`, `functions`) to 6 (`app`, `db`, `functions`, `auth`, `storage`, + emulator block)
- **`.env.local`** — `VITE_USE_EMULATOR=false` added with inline comment (port references: Firestore :8080, Functions :5001)

---

## [0.3.0] — 2026-05-12 · Phase 1 · Alpha — Multi-Page Architecture

### Added
- **Route:** `/studio` → `StudioFullPage` — full facility page with 6-card facility overview (Isolation Booths, Control Room, Hosted Events, Video-Ready, Green Room, Load-In Access); full gear list across 4 categories (Mic Locker 8 items, Preamps 6, DAW/Interfaces 5, Monitoring 5); AudioPlayer integration; Book CTA
- **Route:** `/work` → `WorkPage` — full-page portfolio with sticky category filter bar (All / Video / Audio / Live Events), masonry CSS grid (every 3rd card `row-span-2` + `aspect-[3/4]`), project count display, per-filter empty states, Firestore schema dev hint
- **Route:** `/book` → `BookPage` — dedicated booking page with 4-card quick-service links (pre-fills `?purpose=`), two-column layout (consultation process timeline left, sticky ContactForm card right), trust statistics (< 24h response, Free consultation, 100% in-house)
- **Navbar CTA ring** — `/book` link styled with outlined border (`border-zinc-600 → border-gold-400`) distinct from plain text nav links; `NavLink` active state gold fill
- **Navbar real routes** — Studio, Work, Book now point to `/studio`, `/work`, `/book` (previously hash anchors `/#studio`, etc.)
- **Mobile menu** — dedicated close button inside slide-down panel; Services expand/collapse group; Book gets bordered CTA block
- **`ContactForm` `embedded` prop** — strips outer `<section>` wrapper so form can be placed inside BookPage's border card cleanly
- **`README.md`** — complete rewrite to Deploy Farm standard: architecture diagram, Firebase Multisite setup, Cloudflare integration, required IAM roles, local dev (Vite + Emulator Suite), environment variables table, project structure, Firestore schema, safety protocol
- **`CHANGELOG.md`** — this file; Keep a Changelog format; three-phase tracking

### Changed
- `App.jsx` — added `/studio`, `/work`, `/book` alongside existing `/services/*`; renamed `PageShell` → `Page` for brevity; added `StudioFullPage`, `WorkPage`, `BookPage` lazy imports
- Code-split output: 17 chunks total; Firebase SDK isolated at ~250 kB; each service page ~0.17 kB

---

## [0.2.0] — 2026-05-12 · Phase 1 · Alpha — Service Deep-Dives & Routing Foundation

### Added
- **`createBrowserRouter`** with `RouterProvider` replacing the single-page layout
- **`MainLayout`** — persistent Navbar + Footer + `<Outlet>`; `window.scrollTo` on route change
- **`src/data/services.jsx`** — single source of truth for `SERVICE_ROUTES` (nav links) and `SERVICE_PAGES` (full page configs with SEO title/description, hero copy, gear specs, process steps, Firestore category, contact purpose)
- **Service deep-dive routes** (`/services/studio`, `/services/podcast`, `/services/events`, `/services/video`) — all lazy-loaded
- **`ServiceDetail.jsx`** template — Service Hero (breadcrumb, eyebrow, stacked headline) → Gear & Tech (4-col spec groups) → The Process (numbered 1-2-3 with connector) → Filtered `WorkGallery` → Book CTA
- **Gear & process content** for all 4 service pillars (Studio, Podcast, Events, Video) — mic lockers, console specs, camera kits, workflow steps
- **Navbar** — hover+click Services dropdown with arrow pip and active-gold `NavLink`; animated hamburger → slide-down panel; closes on route change
- **`Services.jsx`** grid — each card has a "Learn More →" `<Link>` to its service route
- **`WorkGallery`** — `defaultCategory`, `showFilters`, `sectionTitle`, `emptyMessage` props; service pages pass `showFilters=false` + pre-set category
- **`ContactForm`** — `useSearchParams()` reads `?purpose=` on mount and pre-selects the Purpose dropdown
- **`Footer`** — 3-col layout (Brand / Services links / Navigate links); all internal links use `<Link>`
- **`react-helmet-async`** — `HelmetProvider` in `main.jsx`; each page/service sets unique `<title>` and `<meta name="description">`
- **`index.html`** SEO — JSON-LD `LocalBusiness` structured data; Open Graph tags; Twitter Card; canonical URL

### Changed
- `App.jsx` — migrated from flat component tree to `RouterProvider` + lazy routes
- `main.jsx` — wrapped app in `HelmetProvider`
- `StudioSection.jsx` — internal links converted from `<a href>` to `<Link>`

---

## [0.1.0] — 2026-05-12 · Phase 1 · Alpha — Brand Refresh & Service Expansion

### Added
- **Hero** — "Sound. Sight. Stage." stacked headline; sub-headline "Crafting stories through professional recording, cinematic video, and live event production."; three CTAs
- **`Services.jsx`** — 4-column responsive grid (`sm:grid-cols-2 lg:grid-cols-4`) with four service pillars: Studio Production (gold), Podcast & Broadcast (sky), Concert & Event Ops (violet), Visual Storytelling (rose); per-pillar icon, description, capability pills, top glow gradient
- **`StudioSection.jsx`** — facility overview (Isolation Booths, Control Room, Hosted Events, Video-Ready); two-column layout with `AudioPlayer`; Book Studio Time CTA
- **`AudioPlayer.jsx`** — HTML5 Audio API; play/pause, click-to-seek scrubber, decorative waveform bars (48 static bars, pseudo-random heights), time display; one active track at a time; graceful "coming soon" state for empty `src`
- **`ContactForm`** — "Purpose of Inquiry" `<select>` with four options (Recording Session, Podcast Production, Live Event Booking, Video Production, Other); submit disabled until service selected; success state with "Send another message" reset
- **`WorkGallery`** — category filter tabs (All / Video / Audio / Live Events) with per-pillar badge colours; per-category placeholder icons; empty state per filter; dev-only Firestore schema hint
- **`index.html`** SEO — `<title>`, `<meta name="description">`, `<meta name="keywords">`, Open Graph, Twitter Card, JSON-LD `LocalBusiness` structured data
- **`Footer`** — expanded with brand tagline, service keyword string, nav links
- **Navbar** — eyebrow text updated to "Video · Audio · Live Events"

### Changed
- `WorkGallery` category `Events` → `"Live Events"` (Firestore field value updated to match)

---

## [0.0.1] — 2026-05-12 · Phase 1 · Alpha — Foundation

### Added
- **Vite 8 + React 19** scaffolded with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin; custom theme tokens: gold palette (`gold-300` → `gold-600`), Cinzel + Inter font families
- **`vite.config.js`** — `outDir: 'dist-fabing'`; build output locked to `dist-fabing/` (never `dist/`)
- **Firebase v10 Modular SDK** — `getFirestore`, `getFunctions` initialized from env vars
- **`firebase.json`** — Firebase Multisite config; `target: fabing` → `public: dist-fabing`; SPA rewrite (`** → /index.html`); immutable cache headers for JS/CSS; no-cache for `index.html`
- **`.firebaserc`** — `botridge` project; `targets.botridge.hosting.fabing = ["fabing-productions"]`
- **`firestore.rules`** — public read on `productions`; all writes denied from client
- **`Hero.jsx`** — full-screen cinematic hero; film-grain overlay; gold radial spotlight; letterbox bars; scroll indicator
- **`WorkGallery.jsx`** — Firestore `productions` collection fetch (`orderBy year desc`); card grid with thumbnail, play overlay, category badge; skeleton loaders
- **`ContactForm.jsx`** — EmailJS integration; name, email, subject, message; success/error states
- **`Navbar.jsx`** — scroll-aware transparency → frosted glass; links to section anchors
- **`Footer.jsx`** — copyright, brand name
- **`.github/workflows/deploy-fabing.yml`** — triggers on `main` push; `npm ci` → `vite build` → verify `dist-fabing/index.html` → `firebase deploy --only hosting:fabing` → Cloudflare cache purge; concurrency cancel-in-progress
- **`functions/`** — Cloud Functions v2 scaffold (`health` HTTP endpoint)
- **`.env.local`** — template with all required `VITE_*` keys (git-ignored)

### Infrastructure
- GCP Project: `botridge` (851146868663)
- Firebase Multisite target: `fabing` → `fabing-productions`
- Cloudflare: Full/Strict SSL; cache purge on deploy via CI
- GitHub repo: `aoteroDeployFarm/fabingproductions-website`

---

## Known Issues

These items are tracked for resolution in upcoming milestones.

| # | Severity | Area | Description | Target |
|---|---|---|---|---|
| KI-001 | Medium | AudioPlayer | `src: ''` on all demo tracks — no audio plays; placeholder state shows | Before v1.0 |
| KI-002 | Medium | Studio/Work pages | No real photography assets — facility cards and hero show no imagery | Before v1.0 |
| KI-003 | Low | SEO | `og-image.jpg` not yet created — OG social preview has no image | Before v1.0 |
| KI-004 | Low | ContactForm | EmailJS service/template IDs not configured — form sends fail silently | Before v1.0 |
| KI-005 | Low | WorkGallery | Firestore `productions` collection empty — all portfolio pages show empty state | Before v1.0 |
| KI-006 | Low | Cloudflare | `CF_ZONE_ID` and `CF_API_TOKEN` secrets not set — cache purge step skipped in CI | Before v1.0 |
| KI-007 | Low | Performance | No Lighthouse CI gate — build doesn't enforce Core Web Vitals thresholds | v1.1 |
| KI-008 | Info | Functions | Cloud Functions deploy untested — health endpoint not verified against emulator | v1.1 |

---

## Release Phases

| Phase | Version Range | Status | Description |
|---|---|---|---|
| **Development (Alpha)** | 0.0.1 – 0.3.x | ✅ Complete | Local scaffolding, component buildout, routing |
| **Staging / Fixes** | 0.4.x – 0.9.x | 🔄 In progress | Emulator integration, asset integration, Firebase data seeding, QA |
| **Production (Live)** | 1.0.0 | ⏳ Upcoming | Full deploy to `fabingproductions.com` via `fabing-productions` site |

---

[Unreleased]: https://github.com/aoteroDeployFarm/fabingproductions-website/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/aoteroDeployFarm/fabingproductions-website/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/aoteroDeployFarm/fabingproductions-website/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/aoteroDeployFarm/fabingproductions-website/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/aoteroDeployFarm/fabingproductions-website/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/aoteroDeployFarm/fabingproductions-website/releases/tag/v0.0.1
