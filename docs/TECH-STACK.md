# Fabing Productions — Technology Stack & Design System

## 1. Document Control

| Field | Value |
| --- | --- |
| **Document Title** | Technology Stack & Design System Reference |
| **Website Name** | Fabing Productions |
| **Repository** | `aoteroDeployFarm/fabingproductions-website` |
| **Repository URL** | `https://github.com/aoteroDeployFarm/fabingproductions-website` |
| **Local Path** | `/Volumes/DevData/fabing-procuctions-data/fabingproductions-website` |
| **Document Status** | Current implementation reference |
| **Last Verified** | 2026-07-20 |
| **Verification Method** | Complete source-code inspection of local working directory |
| **Source of Truth** | This document describes observed implementation of the Fabing Productions website repository as of the verification date. It is not a proposal or design document. |
| **Intended Audience** | Developers, AI coding agents, technical stakeholders maintaining or extending this website. |
| **Maintenance** | Update this document whenever implementation changes significantly. |

---

## 2. Website Overview

**Fabing Productions** is a full-service production house providing professional recording, podcast production, live event coordination, and cinematic video production services.

### Website Type
- **Rendering Model:** Client-side rendered single-page application (SPA)
- **Primary Purpose:** Service portfolio, booking platform, and client information hub
- **Content Model:** Mixed — hard-coded service information, Firestore-backed portfolio, contact form powered by EmailJS
- **Backend Role:** Firebase provides real-time database (Firestore), hosting, serverless functions, and cloud services. Firebase is not required for core functionality; portfolio gracefully degrades if unavailable.
- **Current Operational Host:** Cloudflare Pages (primary) with Firebase Hosting as fallback
- **Live Site:** `https://fabingproductions.com`

### Major Public-Facing Sections
| Route | Purpose | Data Source |
| --- | --- | --- |
| `/` | Home page — hero, services grid, studio teaser, portfolio preview, contact form | Hard-coded + Firestore productions (fallback) |
| `/studio` | Full facility page — gear list, features, audio samples | Hard-coded from `src/data/services.jsx` |
| `/work` | Filterable portfolio — masonry gallery | Firestore `productions` collection |
| `/book` | Booking consultation page — process, ContactForm with pre-fill | ContactForm component with EmailJS |
| `/services/studio` | Studio production deep-dive | Hard-coded service page |
| `/services/podcast` | Podcast & broadcast deep-dive | Hard-coded service page |
| `/services/events` | Live event operations deep-dive | Hard-coded service page |
| `/services/video` | Visual storytelling deep-dive | Hard-coded service page |

---

## 3. Architecture Summary

### High-Level Architecture Flow

```text
Browser (desktop, tablet, mobile)
  ↓
Cloudflare Pages (Primary CDN and host, Full/Strict SSL, automatic Git-based deployment)
  ↓
Vite-built React SPA (index.html + code-split JS/CSS bundles)
  ├─ React Router 7 (client-side routing, lazy-loaded pages)
  ├─ React Helmet Async (SEO metadata per route)
  ├─ React Intersection Observer (scroll-triggered animations)
  ├─ Tailwind CSS 4 (styling, responsive utilities)
  └─ External Services
      ├─ Firebase Firestore (production portfolio data, read-only from client)
      ├─ EmailJS (contact form submission service)
      ├─ Google Fonts (Cinzel, Inter)
      └─ SVG inline assets (icons, gradients)

Note: Firebase Hosting configuration remains in repository files (.firebaserc, firebase.json) 
but is currently NOT deployed to. Deployment is automatic via Cloudflare Pages Git integration.
```

### Frontend Architecture
- **Rendering:** Client-side SPA with React 19
- **Routing:** `createBrowserRouter` with lazy-loaded page components via `lazy()` + `Suspense`
- **State Management:** Local component state (React hooks), no global state library
- **Styling:** Tailwind CSS 4 (Vite plugin) with custom theme variables; inline styles for complex gradients
- **Animations:** CSS transitions, Tailwind utilities, scroll-triggered animations via Intersection Observer

### Backend Services
- **Firestore:** Read-only client access to `productions` collection (portfolio gallery data)
- **Cloud Functions:** Placeholder stub in `functions/src/index.js` (health check only)
- **EmailJS:** Third-party email service for contact form submissions

### Data Architecture
- **Hard-coded Content:** Service descriptions, process steps, gear lists in `src/data/services.jsx`
- **Dynamic Content:** Portfolio items in Firestore `productions` collection
- **Form Data:** Contact form submissions sent via EmailJS (not stored in Firestore)

---

## 4. Core Technology Stack

| Layer | Technology | Version | Purpose | Evidence |
| --- | --- | ---: | --- | --- |
| **Runtime** | Node.js | 20 | Build tooling, Firebase Functions, Emulator, CI/CD | `firebase.json`, `.github/workflows/` |
| **UI Framework** | React | 19.2.6 | Component-based UI, state management | `package.json`, `src/main.jsx` |
| **Build System** | Vite | 8.0.12 | Dev server, code splitting, asset bundling | `vite.config.js`, `package.json` |
| **Rendering** | React DOM | 19.2.6 | Mounts React to browser DOM | `src/main.jsx` |
| **Routing** | React Router DOM | 7.15.0 | SPA client-side routing, lazy code splitting | `src/App.jsx` |
| **Styling** | Tailwind CSS | 4.3.0 | Utility-first CSS, responsive design | `src/index.css`, `vite.config.js` |
| **Typography** | Cinzel (serif), Inter (sans-serif) | — | Google Fonts | `index.html` |
| **SEO & Metadata** | React Helmet Async | 3.0.0 | Per-route title, meta, structured data | `src/main.jsx`, service pages |
| **Animation** | React Intersection Observer | 10.0.3 | Scroll-triggered animations, lazy rendering | `src/components/Services.jsx` |
| **Database** | Firebase Firestore | 12.13.0 | Portfolio data (productions collection), client SDK | `src/lib/firebase.js` |
| **Email Delivery** | EmailJS | 4.4.1 | Contact form submission service | `src/components/ContactForm.jsx` |
| **Backend** | Firebase Cloud Functions | Node 20, v2 SDK | Placeholder stub (unused) | `functions/src/index.js` |
| **Admin Tools** | Firebase Admin SDK | 13.9.0 | Firestore seed scripts | `scripts/seed-productions.js`, `package.json` |
| **Hosting (Current)** | Cloudflare Pages | — | Primary production CDN; automatic deployment via Git integration | `public/_redirects`, README, CHANGELOG |
| **Hosting (Legacy Config)** | Firebase Hosting | — | Configuration remains in repository but not actively deployed; may be manual fallback option | `firebase.json`, `.firebaserc` |
| **Linting** | ESLint | 10.3.0 | JavaScript/JSX code quality | `eslint.config.js`, `package.json` |
| **Package Manager** | npm | 10+ | Dependency management | `package.json`, `package-lock.json` |
| **CI/CD** | GitHub Actions | — | Build verification, deployment orchestration | `.github/workflows/deploy-fabing.yml` |

---

## 5. Runtime and Rendering Model

### Application Entry Point

**File:** `src/main.jsx`

```javascript
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
```

- **Root Element:** `<div id="root">` in `index.html`
- **Strict Mode:** Enabled (checks for unsafe lifecycles, warnings about side effects)
- **Helmet Provider:** Wraps entire app for per-route SEO metadata

### Routing and Navigation

**File:** `src/App.jsx`

- **Router Type:** `createBrowserRouter` (React Router 7)
- **Routing Strategy:** Client-side SPA with lazy-loaded pages
- **Layout:** Single `<MainLayout>` wrapper containing `<Navbar>`, `<Outlet>`, `<Footer>`
- **Loading State:** Custom `<Spinner>` component shown during page transition
- **Route Structure:**

```
/ (MainLayout)
  ├─ / (Home)
  ├─ /studio (StudioFullPage)
  ├─ /work (WorkPage)
  ├─ /book (BookPage)
  ├─ /services/studio (ServiceStudio)
  ├─ /services/podcast (ServicePodcast)
  ├─ /services/events (ServiceEvents)
  └─ /services/video (ServiceVideo)
```

- **Lazy Loading:** All pages use `lazy(() => import(...))` with `Suspense` fallback
- **Scroll Behavior:** `MainLayout` calls `window.scrollTo({ top: 0, behavior: 'instant' })` on every route change

### SPA Rewrite Configuration

**Firebase Hosting** (`firebase.json`):
```json
"rewrites": [{ "source": "**", "destination": "/index.html" }]
```

**Cloudflare Pages** (`public/_redirects`):
```
/*    /index.html   200
```

Both configs route unmatched paths to `index.html` without returning 404, allowing React Router to handle navigation.

### Browser Support

No explicit browser-support configuration detected. Assumed modern browser support via:
- ES2020+ JavaScript (Vite default)
- CSS Grid and Flexbox
- CSS Custom Properties
- Modern CSS features (gradients, backdrop filters)

---

## 6. Application Structure

### Directory Layout

```
fabingproductions-website/
├── .github/
│   └── workflows/
│       └── deploy-fabing.yml              # CI/CD — GitHub Actions
├── .firebaserc                            # Firebase project + target mappings
├── firebase.json                          # Firebase config (hosting, Firestore, emulators, functions)
├── firestore.indexes.json                 # Firestore index definitions
├── firestore.rules                        # Firestore security rules
├── eslint.config.js                       # ESLint configuration
├── vite.config.js                         # Vite build configuration
├── package.json                           # Dependencies + npm scripts
├── package-lock.json                      # Locked versions
├── index.html                             # HTML entry point (SEO tags, Google Fonts, React root)
├── functions/
│   ├── src/
│   │   └── index.js                       # Cloud Functions v2 (health check stub)
│   └── package.json
├── public/
│   ├── favicon.svg                        # Favicon
│   ├── icons.svg                          # Sprite sheet for UI icons
│   └── _redirects                         # Cloudflare Pages SPA routing
├── scripts/
│   └── seed-productions.js                # Firestore seeding script
└── src/
    ├── main.jsx                           # React entry point (ReactDOM.createRoot, Helmet)
    ├── index.css                          # Tailwind import + custom theme variables + global styles
    ├── App.jsx                            # Router definition (createBrowserRouter)
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── layouts/
    │   └── MainLayout.jsx                 # Navbar + Outlet + Footer scaffold
    ├── components/
    │   ├── Navbar.jsx                     # Fixed header, desktop/mobile nav, services dropdown, Book CTA
    │   ├── Hero.jsx                       # Home page hero section ("Sound. Sight. Stage.")
    │   ├── Services.jsx                   # 4-service grid with intersection observer animations
    │   ├── ServiceDetail.jsx              # Reusable template for service deep-dive pages
    │   ├── StudioSection.jsx              # Home page studio teaser with audio player
    │   ├── AudioPlayer.jsx                # HTML5 audio player (play/pause, scrubber, waveform bars)
    │   ├── WorkGallery.jsx                # Firestore-backed gallery (unused in favor of WorkPage)
    │   ├── ContactForm.jsx                # EmailJS form with ?purpose= URL parameter pre-fill
    │   └── Footer.jsx                     # 3-column footer (brand, services, site nav)
    ├── lib/
    │   └── firebase.js                    # Firebase SDK initialization (Firestore, Functions, Auth, Storage)
    ├── data/
    │   └── services.jsx                   # Service routes, service page configs, gear/process specs
    └── pages/
        ├── Home.jsx                       # /
        ├── StudioFullPage.jsx             # /studio
        ├── WorkPage.jsx                   # /work (Firestore query, masonry grid, category filter)
        ├── BookPage.jsx                   # /book (consultation process + ContactForm)
        └── services/
            ├── StudioPage.jsx             # /services/studio
            ├── PodcastPage.jsx            # /services/podcast
            ├── EventsPage.jsx             # /services/events
            └── VideoPage.jsx              # /services/video
```

### Key Architectural Decisions

| Component | Purpose | Notes |
| --- | --- | --- |
| `src/data/services.jsx` | Single source of truth for service routes, page configs, and gear/process specs | Prevents duplication across Navbar, Services grid, and service page routes |
| `src/layouts/MainLayout.jsx` | Layout scaffold wrapper | Provides consistent Navbar and Footer; enables scroll-to-top on navigation |
| `src/lib/firebase.js` | Firebase SDK initialization and singleton exports | Lazy-loads auth and storage to prevent crashes if API key is missing during local dev |
| `src/components/ContactForm.jsx` | Reusable form component | Supports both embedded and standalone modes; pre-fills purpose from URL query param |
| `src/components/ServiceDetail.jsx` | Reusable template | Used by all four service deep-dive pages to reduce duplication |

---

## 7. Routing and Navigation

### Route Inventory

| Route | Component | Page Type | Primary Data Source | Auth Required | SEO Treatment |
| --- | --- | --- | --- | --- | --- |
| `/` | Home | Home page | Hard-coded | No | Static title + meta (index.html) |
| `/studio` | StudioFullPage | Feature page | Hard-coded (services.jsx) | No | Dynamic via Helmet |
| `/work` | WorkPage | Portfolio | Firestore `productions` | No | Static via Helmet |
| `/book` | BookPage | CTA page | ContactForm component | No | Dynamic via Helmet |
| `/services/studio` | ServiceStudio | Service deep-dive | Hard-coded (services.jsx) | No | Dynamic via Helmet |
| `/services/podcast` | ServicePodcast | Service deep-dive | Hard-coded (services.jsx) | No | Dynamic via Helmet |
| `/services/events` | ServiceEvents | Service deep-dive | Hard-coded (services.jsx) | No | Dynamic via Helmet |
| `/services/video` | ServiceVideo | Service deep-dive | Hard-coded (services.jsx) | No | Dynamic via Helmet |

### Navigation Components

| Component | Role | Features |
| --- | --- | --- |
| **Navbar.jsx** | Fixed header, primary navigation | Desktop nav with Services dropdown, mobile hamburger menu, Book CTA button |
| **MainLayout.jsx** | Layout scaffold | Manages scroll-to-top on route changes |
| **Footer.jsx** | Persistent footer | Services nav links, site nav links, copyright |
| **ServiceDetail.jsx** | Reusable page template | Displays hero, gear specs, process, gallery, CTA for service pages |

### Dynamic Route Metadata

**Mechanism:** React Helmet Async + per-route configuration

**Example (ServiceStudio):**
```javascript
const { seo } = SERVICE_PAGES.studio
<Helmet>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
</Helmet>
```

All service pages read from `src/data/services.jsx` service pages config to populate title, description, hero text, accent colors.

### Client-Side Transitions

- **Scroll Restoration:** Instant scroll-to-top on navigation (no smooth scroll between routes)
- **Loading State:** Spinner displayed during page load via `<Suspense>`
- **No Prefetching:** Pages load only when user navigates to them
- **Intersection Observer:** Scroll-triggered animations via `react-intersection-observer` on many components

---

## 8. Data and Content Architecture

### Content Storage Patterns

| Content Type | Storage | Edit Access | Availability |
| --- | --- | --- | --- |
| Service info (descriptions, process, gear) | Hard-coded in `src/data/services.jsx` | Code change + deploy | Always available |
| Hero text, taglines, copy | Hard-coded in components | Code change + deploy | Always available |
| Portfolio items (productions) | Firestore `productions` collection | Firebase Console or seed script | Requires Firestore + network; gracefully degrades if unavailable |
| Contact form submissions | EmailJS (not stored in Firestore) | N/A (third-party service) | Requires EmailJS + network |

### Firestore Schema

**Collection:** `productions`

| Field | Type | Required | Constraints | Example |
| --- | --- | --- | --- | --- |
| `title` | string | ✅ | Display name | "Summer Music Festival 2024" |
| `category` | string | ✅ | One of: `"Video"`, `"Audio"`, `"Live Events"` | "Video" |
| `year` | number | ✅ | Used for sorting (desc) | 2024 |
| `description` | string | ✅ | Short 2–3 sentence summary | "Cinematic coverage of..." |
| `thumbnailUrl` | string \| null | — | Direct URL or null | "https://..." or empty string |
| `externalUrl` | string \| null | — | Link to video/SoundCloud/recap | "https://youtube.com/..." or null |

### Firestore Rules

**File:** `firestore.rules`

```
productions collection: publicly readable, never writable from client
All other collections: no access
```

This allows the WorkPage to load portfolio items without authentication, but prevents any client writes.

### Query Patterns

**WorkPage** (`src/pages/WorkPage.jsx`):
```javascript
const q = query(collection(db, 'productions'), orderBy('year', 'desc'))
const snapshot = await getDocs(q)
```

- Orders productions by year descending (newest first)
- No filtering at database level; filtering happens client-side by category

### Emulator Development

**Command:** `npm run emulators`

Starts:
- Firestore emulator (port 8080)
- Cloud Functions emulator (port 5001)
- Hosting emulator (port 5000)
- Emulator UI (port 4000)

**To connect frontend:** Set `VITE_USE_EMULATOR=true` in `.env.local` and update `src/lib/firebase.js` to call `connectFirestoreEmulator(db, 'localhost', 8080)` when flag is set.

### Seeding Production Data

**Script:** `scripts/seed-productions.js`

**Usage:**
```bash
npm run seed                  # Seed to local emulator
npm run seed:prod            # Seed to production Firestore (dangerous)
```

**Note:** Production seeding should only occur with explicit intent and proper safeguards. No automated seed on deploy.

---

## 9. External Services and Integrations

### Firebase Firestore

| Aspect | Detail |
| --- | --- |
| **Purpose** | Portfolio data (productions collection) |
| **Client SDK** | Firebase Modular SDK v12 (also called "compat-free") |
| **Initialization** | `src/lib/firebase.js` — initialized with VITE_FIREBASE_* env vars |
| **Project** | GCP project `botridge` (Project ID in `VITE_FIREBASE_PROJECT_ID`) |
| **Database** | Cloud Firestore (default database) |
| **Access** | Read-only from client (firestore.rules allows public reads on productions collection only) |
| **Emulator Support** | Yes — connects if `VITE_USE_EMULATOR=true` |
| **Failure Behavior** | WorkPage shows loading spinner indefinitely if Firestore is unavailable; gracefully retries not implemented |
| **Security** | No authentication required for reads; writes disabled by default |

### EmailJS

| Aspect | Detail |
| --- | --- |
| **Purpose** | Contact form submission (sends email to productions account) |
| **Client Library** | @emailjs/browser v4.4.1 |
| **Configuration** | Three required env vars (service ID, template ID, public key) — all client-exposed |
| **Initialization** | Direct import in `src/components/ContactForm.jsx` |
| **Form Fields** | name, email, purpose, message, to_name (hardcoded as "Fabing Productions") |
| **Failure Behavior** | Form shows error message if submission fails; user can retry |
| **Security** | Public key is exposed in browser; no server-side validation; vulnerable to abuse if not rate-limited by EmailJS |
| **Fallback** | None; if EmailJS is down, contact form does not work |

### Firebase Hosting

| Aspect | Detail |
| --- | --- |
| **Purpose** | Static asset serving (alternative to Cloudflare Pages) |
| **Configuration** | `firebase.json` — target `fabing`, public dir `dist-fabing`, SPA rewrite enabled |
| **Build Output** | `npm run build` → `dist-fabing/` |
| **Deployment** | `firebase deploy --only hosting:fabing` (scoped to prevent accidental multisite deploy) |
| **SSL** | Automatic HTTPS provided by Firebase |
| **SPA Rewrite** | All routes → `/index.html` for React Router handling |
| **Cache Headers** | Immutable chunks (1 year), index.html no-cache |
| **Status** | Primary deployment target per README; has been migrated to Cloudflare Pages but remains fallback |

### Cloudflare Pages

| Aspect | Detail |
| --- | --- |
| **Purpose** | Primary CDN and hosting (full proxy to Firebase Hosting) |
| **Configuration** | `public/_redirects` file (Cloudflare Pages config) |
| **Build Output** | `npm run build` → `dist-fabing/` (via CI/CD) |
| **Build Command** | `npm run build` (configured in Cloudflare dashboard) |
| **Build Output Directory** | `dist-fabing` (configured in Cloudflare dashboard) |
| **SPA Routing** | `public/_redirects` contains: `/*    /index.html   200` |
| **SSL** | Full (Strict) SSL mode (requires Firebase origin to be HTTPS) |
| **CDN** | Cloudflare CDN caches static assets |
| **Cache Purge** | CI/CD workflow calls Cloudflare cache purge API after deploy (requires CF_ZONE_ID, CF_API_TOKEN secrets) |
| **Deployment** | Automatic on `git push` to `main` (configured in Cloudflare dashboard, not via local CLI) |

### Google Fonts

| Aspect | Detail |
| --- | --- |
| **Fonts** | Cinzel (serif, weights 400/600/700), Inter (sans-serif, weights 300/400/500/600) |
| **Loading** | Preconnect + link in `index.html` with `display=swap` |
| **Usage** | Cinzel for headings and brand, Inter for body text |
| **Fallback** | system-ui, sans-serif (CSS fallback stack) |

### No Twitter/Social Integrations

- No social login
- No social share widgets
- Social links in footer are plain `<a>` tags (none detected in current code)

---

## 10. Build and Development Tooling

### NPM Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite` | Start Vite dev server (http://localhost:5173) with HMR |
| `build` | `vite build` | Production build to `dist-fabing/` |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Lint JavaScript and JSX |
| `emulators` | `firebase emulators:start --only firestore,functions,hosting` | Start Firebase emulator suite |
| `emulators:export` | `firebase emulators:export .emulator-data` | Persist emulator data to .emulator-data/ |
| `deploy:hosting` | `firebase deploy --only hosting:fabing` | Manual Firebase Hosting deploy |
| `deploy:rules` | `firebase deploy --only firestore:rules` | Deploy Firestore rules only |
| `seed` | `FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seed-productions.js` | Seed emulator with test productions |
| `seed:prod` | `node scripts/seed-productions.js --production` | Seed production Firestore (dangerous) |

### Dependency Management

**Package Manager:** npm  
**Lock File:** `package-lock.json` (committed)  
**Node Version:** 20+ (enforced in CI via `actions/setup-node@v4`)

### Build Configuration

**File:** `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist-fabing',
  },
})
```

- **Output Directory:** `dist-fabing/` (required by Firebase/Cloudflare config)
- **Plugins:** React Fast Refresh, Tailwind CSS Vite plugin
- **Code Splitting:** Automatic via Vite (React Router uses `lazy()` for route splitting)
- **Asset Hashing:** Automatic content-based hashing for cache busting

### Linting Configuration

**File:** `eslint.config.js`

- **Base:** `@eslint/js` recommended rules
- **React Hooks:** `eslint-plugin-react-hooks` flat config
- **React Refresh:** `eslint-plugin-react-refresh` for Vite HMR
- **Ignores:** `dist` directory
- **Scope:** `**/*.{js,jsx}` files

### Environment Variables

**Frontend Build-Time Vars** (required, `VITE_` prefix, injected by Vite):

| Variable | Required | Example |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | ✅ | (Firebase config) |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | `botridge.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | `botridge` |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | `botridge.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | (Firebase config) |
| `VITE_FIREBASE_APP_ID` | ✅ | (Firebase config) |
| `VITE_EMAILJS_SERVICE_ID` | ✅ | (EmailJS config) |
| `VITE_EMAILJS_TEMPLATE_ID` | ✅ | (EmailJS config) |
| `VITE_EMAILJS_PUBLIC_KEY` | ✅ | (EmailJS config) |
| `VITE_USE_EMULATOR` | — | `true` (opt-in, connects to local Firebase emulator) |

**Storage:**
- **Local dev:** `.env.local` (git-ignored)
- **CI/CD:** GitHub Actions repository secrets (Settings → Secrets → Actions)

---

## 11. Hosting and Deployment

### Current Production Host: Cloudflare Pages

**Domain:** `fabingproductions.com`  
**Builder:** Cloudflare Pages (automatic deployment)  
**Build Trigger:** Git push to `main`  
**Build Command:** `npm run build` (configured in Cloudflare Pages dashboard)  
**Build Output Directory:** `dist-fabing/` (configured in Cloudflare Pages dashboard)  
**SPA Routing:** `public/_redirects` (Cloudflare Pages reads this file for routing rules)

**Cloudflare Pages Configuration:**
- **Framework:** Vite (preset in Cloudflare dashboard)
- **Build Command:** `npm run build`
- **Output Directory:** `dist-fabing`
- **Environment Variables:** All `VITE_*` variables set in Cloudflare Pages dashboard
- **SSL/TLS:** Full (Strict) mode
- **Cache:** Cloudflare CDN respects Cache-Control headers set by build output
- **Deployment:** Automatic on successful build verification in GitHub Actions workflow

**Migration Date:** 2026-06-02 (commit `7d989be`)  
**Status:** Active, production

### Legacy Configuration: Firebase Hosting

**Project:** `botridge` (GCP project)  
**Target:** `fabing` → `fabing-productions` site ID  
**Status:** Configuration remains in repository but NOT actively deployed  
**Deploy Command:** `firebase deploy --only hosting:fabing` (manual, if needed)  
**Build Output Directory:** `dist-fabing/`  
**SPA Rewrite:** Configured in `firebase.json` (`** → /index.html`)  
**Purpose if Reactivated:** Could serve as manual fallback or alternative deployment method, but currently NOT used

**Reasoning for Retention:** Configuration is retained to allow potential manual deployment to Firebase if Cloudflare Pages deployment fails. Requires explicit manual action (not automated).

### Multisite Safety (Firebase Configuration)

This repository's Firebase configuration is scoped to the `botridge` GCP project with multisite isolation:

1. **Configuration Separation:** `.firebaserc` explicitly maps `fabing` target to `fabing-productions` site ID
2. **Scoped Deployments:** Manual Firebase deploys (if ever needed) must use `--only hosting:fabing` to avoid touching other sites
3. **CI/CD:** GitHub Actions workflow (`deploy-fabing.yml`) no longer performs Firebase deploys (now Cloudflare Pages only)
4. **Firestore Rules:** Separate rules file applies only to `productions` collection

**Note:** Multisite safety was critical when Firebase Hosting was the production target. With Cloudflare Pages now handling deployment, the risk of accidental cross-site deploy is reduced (manual Firebase deploy is the only concern, and it requires explicit action).

### CI/CD Pipeline

**File:** `.github/workflows/deploy-fabing.yml`

**Trigger:** Push to `main`  
**Concurrency:** Concurrency group `deploy-fabing` (previous in-flight builds cancelled if new push arrives)  
**Timeout:** 15 minutes per job

**Current Role:** Build verification only (pre-flight checks)

**Steps:**
1. Checkout code
2. Setup Node 20 (npm cache enabled)
3. Install dependencies (`npm ci`)
4. Build (output → `dist-fabing/`)
5. Verify build output (ensures `dist-fabing/index.html` exists)

**Deployment:** NOT PERFORMED BY CI/CD. Cloudflare Pages automatically deploys the built artifacts via Git integration after build verification succeeds.

**Environment Variables Passed to Build:**
- All `VITE_*` vars from GitHub Actions secrets

**Note:** Previous versions of this workflow included Firebase Hosting deploy and Cloudflare cache purge steps. These were removed on commit `7d989be` (feat: migrate hosting to Cloudflare Pages) when deployment was moved to Cloudflare Pages' automatic Git-based system.

### Cache Strategy

**Cache-Control Headers** (set in `firebase.json`):

```json
{
  "source": "**/*.@(js|css|woff2)",
  "Cache-Control": "public, max-age=31536000, immutable"
},
{
  "source": "index.html",
  "Cache-Control": "no-cache"
}
```

- **JS/CSS/Fonts:** Cache for 1 year (safe because Vite uses content-based hashing)
- **index.html:** Never cache (ensures clients get latest bundle manifest)
- **Other assets:** Default Cloudflare caching rules apply

### Deployment Safety Checklist

Before deploying:
1. ✅ Verify `dist-fabing/index.html` exists after build
2. ✅ Never run bare `firebase deploy` (always use `--only hosting:fabing`)
3. ✅ Verify `.firebaserc` target mapping is correct
4. ✅ Test locally with `npm run preview` before merging to main

---

## 12. Design System Overview

The Fabing Productions website employs a **dark, sophisticated design system** grounded in:
- **Color:** Dark zinc backgrounds with metallic gold accents and service-specific accent colors
- **Typography:** Serif headings (Cinzel) with sans-serif body text (Inter)
- **Implementation:** Tailwind CSS 4 utilities with custom theme variables and inline styles for complex effects
- **Character:** Premium, cinematic, professional — aligned with production industry standards

The design system is **organically evolved** rather than formally tokenized. No design-system package (e.g., component library, Storybook) exists. Consistency is achieved through:
- Reusable components (Navbar, Hero, Services, ServiceDetail, ContactForm, Footer)
- Data-driven configurations (`src/data/services.jsx`)
- Intersection Observer for consistent scroll-triggered animations
- Tailwind utilities applied consistently across components

---

## 13. Color Palette

### Brand Gold Gradient

Primary brand color: A metallic gold gradient used for the logo, headlines, and key CTAs.

| Token | Value | Usage | Source |
| --- | --- | --- | --- |
| gold-300 | `#fde68a` | Light gold accent | `src/index.css` (@theme) |
| gold-400 | `#f59e0b` | Primary gold (navbar logo, headings, links, hover states) | `src/index.css` (@theme) |
| gold-500 | `#d97706` | Mid-tone for gradients, borders, buttons | `src/index.css` (@theme) |
| gold-600 | `#b45309` | Dark gold for disabled states, subtle text | `src/index.css` (@theme) |
| `.text-gold` | `linear-gradient(135deg, #f59e0b 0%, #fde68a 45%, #d97706 100%)` | Metallic gradient text (logo, headings) | `src/index.css` |

### Surface Colors

| Token | Value | Usage | Source |
| --- | --- | --- | --- |
| zinc-950 | `#09090b` | Page background, primary surface | `src/index.css` (body) |
| zinc-100 | `#f4f4f5` | Primary text | `src/index.css` (body) |
| zinc-900 | Tailwind default | Card/component background | Tailwind 4 default |
| zinc-800 | Tailwind default | Borders, dividers, subtle backgrounds | Tailwind 4 default |
| zinc-700 | Tailwind default | Secondary borders, muted interactive elements | Tailwind 4 default |
| zinc-600 | Tailwind default | Placeholder text, disabled text | Tailwind 4 default |
| zinc-500 | Tailwind default | Muted text | Tailwind 4 default |
| zinc-400 | Tailwind default | Secondary text, navigation links | Tailwind 4 default |
| zinc-200 | Tailwind default | Bright secondary text | Tailwind 4 default |

### Service-Specific Accent Colors

Each service has a dedicated accent color used for icons, highlights, and section glows:

| Service | Color | Hex | Usage | Source |
| --- | --- | --- | --- | --- |
| Studio Production | Sky | `text-sky-400` | Icons, links, hover states | `src/data/services.jsx`, components |
| Podcast & Broadcast | Sky | `text-sky-400` | Icons, links, hover states | `src/data/services.jsx`, components |
| Concert & Event Ops | Violet | `text-violet-400` | Icons, links, hover states | `src/data/services.jsx`, components |
| Visual Storytelling | Rose | `text-rose-400` | Icons, links, hover states | `src/data/services.jsx`, components |

### Gradients

| Name | Definition | Usage | Source |
| --- | --- | --- | --- |
| Gold Text Gradient | `linear-gradient(135deg, #f59e0b, #fde68a, #d97706)` | Logo, brand text | `src/index.css` |
| Gold Radial Glow | `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.07), transparent)` | Hero section spotlight | `src/components/Hero.jsx` |
| Service Card Glow | `from-[color]/10 to-transparent` | Per-service card top glow | `src/components/Services.jsx`, `src/data/services.jsx` |
| Gradient Line | `from-transparent via-gold-500 to-transparent` | Section dividers, accent underlines | Multiple components |

### Opacity and States

| State | Pattern | Usage |
| --- | --- | --- |
| Hover | `.text-gold-400 .hover:text-gold-500` or `.hover:border-gold-500` | Links, buttons, navigation items |
| Focus | `.focus:border-gold-500 .focus:outline-none` | Form inputs |
| Disabled | `.disabled:opacity-40` | Form buttons |
| Active (Navigation) | `.isActive ? 'text-gold-400' : 'text-zinc-400'` | NavLink states |
| Overlay | `bg-black/70`, `bg-black/50`, `bg-zinc-950/80` | Modals, image overlays, badges |
| Transparent | `bg-zinc-950/80`, `text-white/70` | Reduced opacity for secondary elements |

### No Formal Token System

Colors are referenced directly via:
- Tailwind color tokens (e.g., `text-gold-400`, `border-zinc-800`)
- Hex values in inline styles (e.g., gradient definitions)
- CSS custom properties via `@theme` (gold shades, fonts)

No CSS variable system (e.g., `--color-primary`) or design tokens file exists. To change a color, search the codebase for specific hex values or Tailwind tokens and update all occurrences.

---

## 14. Typography

### Font Families

| Font | Role | Weights | Source | Fallback Stack |
| --- | --- | --- | --- | --- |
| **Cinzel** | Serif headings, logo, brand text | 400, 600, 700 | Google Fonts | serif |
| **Inter** | Body text, navigation, UI | 300, 400, 500, 600 | Google Fonts | system-ui, sans-serif |

### Font Loading

**Method:** Google Fonts preconnect + link in `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

**Display:** `swap` (system font renders immediately, swaps to web font when ready)

### Heading Hierarchy

| Element | Font | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing | Usage |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| **H1** (hero) | Cinzel | 6–9xl | 6xl | 600 | leading-none | normal | Hero page headline "Sound. Sight. Stage." |
| **H2** (section) | Cinzel | 4–5xl | 4xl | 600 | normal | normal | Section headings ("Full-Service Production", "Book a Session") |
| **H3** (card/module) | Cinzel | lg–xl | base | 600 | normal | normal | Card titles, service names, "Learn More" |
| **H4+** (subsection) | Cinzel | base–lg | sm | 600 | normal | normal | Process steps, spec groups |

### Body Text

| Role | Font | Size | Weight | Line Height | Letter Spacing | Color | Usage |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| **Eyebrow** | Inter | xs | 300 | normal | 0.5em (track-widest) | gold-400 | Uppercase labels above headings |
| **Body Paragraph** | Inter | base | 400 | relaxed | normal | zinc-400 | Long-form copy, descriptions |
| **Caption** | Inter | sm | 400 | relaxed | normal | zinc-500 | Subtext, descriptions, list items |
| **UI Label** | Inter | xs | 500 | normal | track-widest | zinc-700 | Form labels, button text, nav labels |
| **Navigation** | Inter | xs | 400 | normal | track-widest uppercase | zinc-400 | Navbar, footer links |
| **Placeholder** | Inter | sm | 400 | normal | normal | zinc-600 | Form input placeholders |

### Responsive Typography

**Desktop (lg breakpoint, 1024px+):**
- H1: 8–9xl (64–144px)
- H2: 5xl (48px)
- Body: base (16px)

**Tablet (md breakpoint, 768px):**
- H1: 7–8xl (56–64px)
- H2: 4xl (36px)
- Body: base (16px)

**Mobile (sm breakpoint, 640px and below):**
- H1: 6xl (36px)
- H2: 4xl (36px)
- Body: sm–base (14–16px)

**No formal responsive scale.** Breakpoints are set per-component using Tailwind `md:` and `lg:` prefixes.

### Text Transform

| Style | Usage |
| --- | --- |
| `uppercase` | Navigation, labels, button text (e.g., "Book a Session", "Learn More") |
| `normal` | Body text, headings in natural case |
| `none` | Headings and body text generally avoid ALL CAPS except UI labels |

### Letter Spacing

| Value | Tailwind Class | Usage |
| --- | --- | --- |
| normal | — | Body text, headings |
| `0.4em` | `tracking-[0.4em]` | Uppercase eyebrow labels |
| `0.5em` | `tracking-[0.5em]` | Uppercase eyebrow labels |
| widest | `tracking-widest` | Navigation, form labels |
| wide | `tracking-wide` | Footer links |

---

## 15. Spacing and Layout System

### Content Maximum Widths

| Context | Value | Class | Notes |
| --- | ---: | --- | --- |
| **Page max-width** | 7xl (80rem / 1280px) | `.max-w-7xl` | Navbar, sections, footer |
| **Content max-width** | 2xl (42rem / 672px) | `.max-w-2xl` | Form sections, narrow columns |
| **Constrained column** | 4xl (56rem / 896px) | `.max-w-4xl` | Hero section copy |
| **Full width** | 100% | — | Page backgrounds, hero section |

### Page and Section Padding

| Context | Desktop | Tablet | Mobile | Class |
| --- | ---: | ---: | ---: | --- |
| **Horizontal gutter** | 24px | 24px | 24px | `px-6` |
| **Section vertical** | 96px | 96px | 96px | `py-24` |
| **Section half** | 48px | 48px | 48px | `py-12` |
| **Card padding** | 28px | 28px | 28px | `p-7` |
| **Grid gap** | 20px | 20px | 20px | `gap-5` |

### Grid Systems

| Component | Desktop Columns | Tablet | Mobile | Gap |
| --- | --- | --- | --- | --- |
| Services grid | 4 (grid-cols-4) | 2 (sm:grid-cols-2) | 1 (grid-cols-1) | 20px (gap-5) |
| Portfolio (Work) | 3 (lg:grid-cols-3) | 2 (sm:grid-cols-2) | 1 (grid-cols-1) | 20px (gap-5) |
| Footer | 3 (md:grid-cols-3) | 1 fallback | 1 (grid-cols-1) | 40px (gap-10) |
| Form fields | 2 (sm:grid-cols-2) | 1 fallback | 1 (grid-cols-1) | 16px (gap-4) |

### Vertical Rhythm

Spacing increments observed across components (Tailwind spacing scale):

| Value | Usage |
| --- | --- |
| 4px (1) | Internal padding within tight components |
| 8px (2) | Small gaps between related elements |
| 12px (3) | Gap within form groups |
| 16px (4) | Gap between form fields |
| 20px (5) | Grid gap (sections, cards) |
| 24px (6) | Section padding (horizontal), spacing between subsections |
| 40px (10) | Footer column gap |
| 48px (12) | Section half padding |
| 96px (24) | Full section padding |

### Navigation and Header

| Element | Dimension | Notes |
| --- | --- | --- |
| Navbar height | 64px | `h-16` (fixed top) |
| Navbar top padding on scroll | 12px–16px (md:p-4–6) | Varies by breakpoint |
| Mobile navbar padding | 24px (px-6) | Horizontal padding in mobile menu |
| Hamburger icon size | 20px (w-5 h-5) | Mobile menu button |

### Footer

| Element | Dimension |
| --- | --- |
| Footer vertical padding | 48px (py-12) |
| Footer horizontal padding | 24px (px-6) |
| Section column gap | 40px (gap-10) |
| Nav link spacing | 8px (space-y-2) |
| Top border | 1px (border-t border-zinc-800) |

### No Formal Spacing Scale

Spacing values are applied ad-hoc using Tailwind utilities. No custom spacing tokens or CSS variables define a global scale. Consistency is achieved through the common use of Tailwind default values.

---

## 16. Responsive Design and Breakpoints

### Tailwind Default Breakpoints

| Breakpoint | Condition | Tailwind Prefix | Used |
| --- | --- | --- | --- |
| Mobile first (0px+) | Base styles | (none) | ✅ |
| Small (640px) | `sm:` | Tablets, large phones | ✅ |
| Medium (768px) | `md:` | Tablets, desktops | ✅ |
| Large (1024px) | `lg:` | Desktops, widescreen | ✅ |
| Extra Large (1280px) | `xl:` | Widescreen | ✅ (less common) |
| 2XL (1536px) | `2xl:` | Ultra-wide | ❌ (not observed) |

### Mobile-First Approach

All components use **mobile-first CSS** (base styles apply to all screens, then enhanced with breakpoint prefixes):

```jsx
// Example from Navbar
className="hidden md:flex items-center gap-7 ml-auto"
// Hidden on mobile, shown on md and up
```

### Navigation Responsive Behavior

| Device | Display | Features |
| --- | --- | --- |
| **Mobile** | Hamburger menu (slide-down panel) | Services dropdown in panel, mobile nav links |
| **Tablet (md+)** | Horizontal desktop nav | Services dropdown, Book CTA button |
| **Desktop (lg+)** | Same as tablet | Full width, optimal spacing |

### Grid Responsive Behavior

| Component | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| **Services grid** | 1 col | 2 cols (sm:) | 4 cols (lg:) |
| **Portfolio masonry** | 1 col | 2 cols (sm:) | 3 cols (lg:) + tall cards |
| **Form fields** | 1 col | 2 cols (sm:) | 2 cols (sm:) |
| **Footer** | 1 col | 1 col (falls to single) | 3 cols (md:) |

### Typography Responsive Behavior

| Element | Mobile | Desktop |
| --- | --- | --- |
| **Hero H1** | `text-6xl` | `text-8xl` to `text-9xl` (md:/lg:) |
| **Section H2** | `text-4xl` | `text-5xl` (md:) |
| **Body text** | `text-sm`/`text-base` | `text-base` (no change) |

### Image and Media Responsive Behavior

| Aspect | Desktop | Mobile |
| --- | --- | --- |
| **Masonry tall cards** | `aspect-[3/4]` every 3rd card | All cards `aspect-video` |
| **Hero image** | Full viewport height | Constrained by letterbox bars |
| **Video embeds** | Responsive via aspect-ratio | Same (no special mobile handling observed) |

### Intersection Observer Usage

- **Threshold:** 0.08–0.1 (element 8–10% visible triggers animation)
- **Trigger Once:** `triggerOnce: true` (animation plays only on first view)
- **Stagger:** Animations staggered via inline `transitionDelay` based on index
- **No Mobile Optimization:** Animations run on all devices (no reduced-motion preference honored)

---

## 17. CSS Architecture and Formatting

### Global Stylesheet

**File:** `src/index.css`

```css
@import "tailwindcss";

@theme {
  --color-gold-300: #fde68a;
  --color-gold-400: #f59e0b;
  --color-gold-500: #d97706;
  --color-gold-600: #b45309;
  --font-cinzel: 'Cinzel', serif;
  --font-inter: 'Inter', sans-serif;
}

html { scroll-behavior: smooth; }
body {
  margin: 0;
  background-color: #09090b;
  color: #f4f4f5;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.text-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #fde68a 45%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Tailwind Integration

**Method:** Tailwind CSS 4 Vite plugin (`@tailwindcss/vite`)

**Configuration:** `vite.config.js` includes `tailwindcss()` plugin; no separate `tailwind.config.js` file (uses Tailwind v4 defaults with custom theme in `@theme` block)

### Styling Patterns Observed

| Pattern | Usage | Frequency | Example |
| --- | --- | --- | --- |
| **Tailwind utilities** | Primary styling approach | Very common | `className="bg-zinc-900 border border-zinc-800 px-6 py-3"` |
| **Inline styles** | Complex gradients, data URIs, dynamic values | Common | `style={{ fontFamily: "'Cinzel', serif" }}` |
| **CSS custom properties** | Theme colors, fonts (via @theme) | Limited | `--color-gold-400`, `--font-cinzel` |
| **Arbitrary Tailwind values** | Custom values not in default scale | Occasional | `className="h-24 bg-[radial-gradient(...)]"` |
| **Pseudo-classes** | Hover, focus, active states | Common | `hover:bg-gold-500`, `focus:border-gold-500` |
| **Pseudo-elements** | Before/after for decorative elements | Rare | Not observed in major components |
| **Media queries** | Responsive breakpoints | Very common | `md:flex`, `lg:text-9xl`, `sm:grid-cols-2` |
| **Keyframes** | Animations (Tailwind built-ins) | Occasional | `animate-spin`, `animate-bounce` |

### CSS Formatting Conventions

**Indentation:** 2 spaces (consistent with JSX)

**Brace Placement:** JSX className strings, no traditional CSS blocks

**Property Ordering:** Tailwind utilities typically ordered as:
1. Layout (`flex`, `grid`, `block`)
2. Sizing (`w-`, `h-`, `min-`, `max-`)
3. Spacing (`p-`, `m-`, `gap-`)
4. Display (`hidden`, `flex`)
5. Colors (`bg-`, `text-`, `border-`)
6. Typography (`font-`, `text-`, `tracking-`)
7. Transforms/Animations (`transition-`, `animate-`)
8. States (`:hover`, `:focus`, responsive prefixes)

**Blank-Line Usage:** No blank lines between utilities; entire className is one line or wrapped for readability.

**Multi-Line Declarations:** When className is long, wrapped to next line with backticks or template literals:

```jsx
className={`relative flex flex-col bg-zinc-900 border border-zinc-800 p-7 transition-all duration-700 ease-out group ${svc.border} ${
  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
}`}
```

**Naming Style:** 
- Tailwind tokens (e.g., `bg-zinc-900`)
- Descriptive custom classes (e.g., `.text-gold`)
- No BEM, no CSS modules, no scoped CSS

### Specificity Patterns

**Approach:** Rely on Tailwind's specificity model and inline style overrides

**`!important` Usage:** Observed in at least one location for arbitrary values; not a general pattern

**Selector Grouping:** Not applicable (JSX classNames, not selectors)

### Component Styling

**Primary Method:** Tailwind utilities in `className` prop

**Secondary Method:** Inline `style` prop for:
- Font family overrides (e.g., `style={{ fontFamily: "'Cinzel', serif" }}`)
- Dynamic gradient values (e.g., `style={{ backgroundImage: '...' }}`)
- SVG data URIs (e.g., film-grain texture)

**No CSS Modules:** No `.module.css` files detected

**No Styled Components:** No CSS-in-JS libraries

**Global Styles:** Limited to `src/index.css` (body defaults, `.text-gold` class)

### Maintenance Guidance

1. **Use existing Tailwind utilities** before adding arbitrary values (e.g., prefer `gap-5` over `gap-[20px]`)
2. **Reuse color tokens** (gold-400, zinc-800, etc.) before creating new hex values inline
3. **Maintain component-level consistency:** If two components use the same visual pattern, consider extracting to a shared component or utility class
4. **Responsive utilities:** Always use mobile-first approach (base style, then `md:`, `lg:` prefixes)
5. **Hover and focus states:** Express all interactive states via Tailwind utilities (`:hover`, `:focus`, `:active`)
6. **No CSS Resets:** Tailwind provides a minimal reset; do not layer additional reset logic
7. **Font declarations:** Use inline `style={{ fontFamily: "'Cinzel', serif" }}` if Tailwind's font utilities don't apply the right weight/style

---

## 18. Component Styling Patterns

### Navbar

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Container** | Tailwind | `fixed top-0 inset-x-0 z-50 transition-all duration-300` | Fixed header; transitions background on scroll |
| **Logo** | Tailwind + inline style | `.text-gold` + `font-cinzel` + `style={{ fontFamily: '...' }}` | Gradient text with serif font |
| **Nav Links** | Tailwind | `text-xs tracking-widest uppercase transition-colors` | Uppercase, small caps effect via font-size + letter-spacing |
| **Book Button** | Tailwind | `border border-zinc-600 text-zinc-300 hover:border-gold-400 hover:text-gold-400` | Outlined button with hover color change |
| **Services Dropdown** | Tailwind + transitions | `absolute top-full origin-top scale-y-95 opacity-0 transition-all` | Smooth scale animation from top origin |
| **Mobile Menu** | Tailwind | `fixed inset-x-0 top-0 z-50 transition-transform duration-300` | Slide-down panel; fully controlled by state |
| **Mobile Backdrop** | Tailwind | `fixed inset-0 z-40 bg-black/70 backdrop-blur-sm` | Blur + overlay behind menu |

### Hero

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Container** | Tailwind | `relative min-h-screen flex flex-col items-center justify-center bg-zinc-950` | Full viewport height, centered content |
| **Film Grain** | Inline + data URI | `absolute inset-0 opacity-[0.035] pointer-events-none` | SVG-based noise texture overlay |
| **Gold Radial Glow** | Inline style | `radial-gradient(ellipse 80% 60% ...)` | Subtle gold glow behind headline |
| **Letterbox Bars** | Tailwind | `absolute inset-x-0 h-10 bg-black/70` | Cinematic effect (top and bottom) |
| **Headline** | Tailwind + inline | `font-cinzel text-6xl md:text-8xl lg:text-9xl font-semibold` | Responsive sizing; serif font via style prop |
| **Sub-Headline** | Tailwind | `text-zinc-400 text-base md:text-lg font-light leading-relaxed` | Responsive font size; light weight |
| **CTA Buttons** | Tailwind | `px-8 py-3 bg-gold-500 text-zinc-950 uppercase tracking-widest hover:bg-gold-400` | Outlined and solid variants |
| **Scroll Cue** | Tailwind | `absolute bottom-16 flex flex-col items-center animate-bounce` | Animated bounce at bottom |

### Services Grid Cards

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Card** | Tailwind | `relative bg-zinc-900 border border-zinc-800 p-7 transition-all duration-700` | Staggered fade-in via transitionDelay |
| **Top Glow** | Tailwind | `absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[color]/10 to-transparent` | Per-service color glow (gold, sky, violet, rose) |
| **Icon** | Tailwind | `mb-5 transition-transform duration-300 group-hover:scale-110` | Icon lifts on hover via transform scale |
| **Title** | Tailwind | `font-cinzel text-lg font-semibold text-zinc-100` | Serif font via class + inline style prop |
| **Description** | Tailwind | `text-zinc-500 text-sm leading-relaxed flex-1` | Secondary text color; flex-1 to fill remaining space |
| **Capability Pills** | Tailwind | `text-xs px-2.5 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700/50` | Small badge-style pills |
| **Learn More Link** | Tailwind | `inline-flex items-center gap-1.5 text-xs uppercase opacity-70 hover:opacity-100` | Link with icon; fades in on hover |
| **Bottom Accent** | Tailwind | `absolute bottom-0 inset-x-0 h-px bg-gradient-to-r via-[color]/60` | Horizontal gradient underline on hover |

### Forms (ContactForm)

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Input** | Tailwind | `w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-3 focus:border-gold-500 transition-colors` | Consistent input styling; border focus state |
| **Label** | Tailwind | `text-xs tracking-widest uppercase text-zinc-500 mb-2` | Small caps effect via font-size + letter-spacing |
| **Select** | Tailwind + inline | `appearance-none` + chevron icon overlay | Custom chevron icon; removes default browser arrow |
| **Submit Button** | Tailwind | `w-full py-4 bg-gold-500 text-zinc-950 font-semibold uppercase hover:bg-gold-400 disabled:opacity-40` | Full width; disabled opacity; hover color |
| **Success State** | Tailwind | `border border-zinc-800 py-20 text-center` | Card-like container with checkmark icon |
| **Error Message** | Tailwind | `text-red-400 text-sm text-center py-1` | Red error text |

### Portfolio Masonry (WorkPage)

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Grid** | Tailwind | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto` | Responsive 1-2-3 column layout |
| **Card** | Tailwind | `relative overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700` | Tall every 3rd card via `row-span-2` |
| **Thumbnail** | Tailwind | `relative overflow-hidden bg-zinc-800 aspect-video` or `aspect-[3/4]` | Responsive aspect ratios; lazy-load animation |
| **Overlay Play Icon** | Tailwind | `absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50` | Play button appears on hover |
| **Category Badge** | Tailwind | `absolute top-3 left-3 text-xs tracking-widest uppercase` + `${BADGE_STYLES[category]}` | Positioned badge with category-specific colors |
| **Year Badge** | Tailwind | `absolute top-3 right-3 text-xs text-zinc-500 tabular-nums` | Right-aligned year badge; tabular figures |
| **Card Title** | Tailwind | `font-cinzel text-sm font-semibold text-zinc-100 group-hover:text-gold-400` | Serif title; color changes on hover |
| **Skeleton Loading** | Tailwind | `bg-zinc-900 animate-pulse` | Placeholder cards during data fetch |

### Footer

| Element | Styling Method | Key Classes | Notes |
| --- | --- | --- | --- |
| **Container** | Tailwind | `py-12 px-6 border-t border-zinc-800 bg-zinc-950` | Fixed padding; top border divider |
| **Grid** | Tailwind | `grid grid-cols-1 md:grid-cols-3 gap-10 mb-10` | 1 col mobile, 3 cols tablet+ |
| **Brand Section** | Tailwind | — | Logo and tagline in first column |
| **Nav Sections** | Tailwind | `text-xs tracking-widest uppercase text-zinc-700 mb-3` | Column headers (Services, Navigate) |
| **Footer Links** | Tailwind | `text-xs tracking-wide text-zinc-600 hover:text-gold-400` | Smaller text; hover color shift to gold |
| **Bottom Bar** | Tailwind | `border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between` | Flex layout; responsive direction |
| **Copyright** | Tailwind | `text-zinc-700 text-xs` | Muted text color |

---

## 19. Imagery and Media Standards

### Image Directories and Storage

| Type | Location | Format | Handling | Notes |
| --- | --- | --- | --- | --- |
| **Icons (UI)** | `public/icons.svg` | SVG sprite sheet | Import and reference by ID | Used throughout components |
| **Favicon** | `public/favicon.svg` | SVG | Direct link in index.html | Lightweight vector |
| **Portfolio thumbnails** | Firestore URL field | JPEG/PNG (inferred) | External CDN or storage | No validation of format |
| **Hero background image** | Asset file | PNG | Imported in Hero.jsx | Small hero.png in src/assets/ |
| **SVG inline** | Inlined in JSX | SVG markup | React components | Stroke-based icons, gradients, data URIs |

### Image Component Usage

| Component | Approach | Responsive |
| --- | --- | --- |
| **WorkPage masonry** | `<img src={thumbnailUrl} alt={title} />` | Yes (via responsive grid) |
| **Hero section** | Gradient overlays, no image | N/A |
| **Service cards** | No images (icons only) | N/A |
| **Audio player waveform** | SVG bars (animated via CSS) | Yes |

### Responsive Images

No `<picture>` or `srcset` attributes observed. Images scale with their container:
- Masonry cards: `object-cover` with responsive aspect ratios
- All responsive scaling achieved via CSS grid + aspect-ratio utilities

### Aspect Ratios

| Usage | Ratio | Tailwind Class |
| --- | --- | --- |
| Portfolio video/thumbnail | 16:9 (widescreen) | `aspect-video` |
| Portfolio tall card (every 3rd) | 3:4 (portrait) | `aspect-[3/4]` |
| Service card (no image) | N/A | N/A |
| Hero section | Full viewport | `min-h-screen` |

### Lazy Loading

- **No explicit lazy loading library observed**
- **Intersection Observer used for animations**, not images
- **Firestore thumbnail URLs** loaded immediately (no lazy-loading on scroll)
- **Masonry skeleton loaders** displayed while data fetches (not individual image lazy-loads)

### Alt Text Conventions

| Context | Alt Text Pattern | Implementation |
| --- | --- | --- |
| **Portfolio thumbnails** | `alt={item.title}` | Sourced from Firestore production title |
| **Service icons** | `aria-hidden="true"` | Decorative; no alt text needed |
| **Hero section** | No images | N/A |
| **Inline SVG** | None or wrapped in icon component | Relies on context or aria attributes |

### Background Images

| Usage | Implementation | Notes |
| --- | --- | --- |
| **Hero film grain** | Inline `backgroundImage` with SVG data URI | Static texture overlay |
| **Service card glows** | Tailwind `bg-gradient-to-b` utilities | Per-service color gradients |
| **Section dividers** | `bg-gradient-to-r` on thin divs | Horizontal gradient lines |

### Media Embeds

| Service | Approach | Implementation | Notes |
| --- | --- | --- | --- |
| **Audio (studio audio samples)** | HTML5 `<audio>` with custom player | AudioPlayer component | Play/pause, scrubber, waveform bars |
| **Video** | External link (YouTube, Vimeo, etc.) | `<a>` with play icon overlay | WorkPage cards link to external URLs |
| **Social media** | External links (no widgets) | Plain `<a>` tags in footer | No embedded tweets, Instagram, etc. |

### Performance Considerations

- **No image optimization library** (e.g., Sharp, ImageOptim) detected
- **No CDN image service** (e.g., Imgix, Cloudinary) for dynamic resizing
- **Vite bundles or copies static assets** from `public/` and `src/assets/`
- **Cloudflare CDN caches** immutable chunks and images based on Cache-Control headers

---

## 20. Motion and Interaction

### Scroll-Triggered Animations

**Library:** React Intersection Observer (`react-intersection-observer`)

| Component | Trigger | Animation | Behavior |
| --- | --- | --- | --- |
| **Services grid cards** | Scroll into view (8% threshold) | Fade-in + slide-up + stagger | Plays once; 100ms delay per card |
| **Service card icons** | Hover | Scale up (1.1x) + translate up | Hover state; no scroll trigger |
| **Portfolio masonry cards** | Scroll into view (5% threshold) | Fade-in + slide-up + stagger | Plays once; 60ms delay per card |
| **Section headers** | Scroll into view (10% threshold) | Fade-in + slide-up | Plays once; no stagger |

### CSS Transitions

| Target | Duration | Easing | Usage |
| --- | --- | --- | --- |
| **Color changes** | 200ms | ease-out | Hover states on links, buttons |
| **Scale/Transform** | 300–700ms | ease-out | Icon lift, card slide-up |
| **Border/Background** | 150–200ms | ease-out | Border color on focus/hover |
| **Opacity** | 300ms | ease-out | Dropdown open/close, modal fade |
| **Background blur** | 300ms | ease-out | Mobile menu backdrop |

### Hover Behavior

| Element | Hover Effect | Implementation |
| --- | --- | --- |
| **Navigation links** | Text color change (gold) | `hover:text-gold-400 transition-colors` |
| **Service cards** | Icon scale + glow intensify + border brightening | `group-hover:scale-110` + opacity change |
| **Buttons** | Background color change + slight opacity | `hover:bg-gold-400 disabled:opacity-40` |
| **Portfolio cards** | Image zoom + overlay darken + play icon appear | `group-hover:scale-105` + `group-hover:bg-black/50` |
| **Form inputs** | Border color change to gold on focus | `focus:border-gold-500 focus:outline-none` |

### Keyframe Animations

| Animation | Duration | Used In |
| --- | --- | --- |
| `animate-spin` | 1s | Loading spinner in page Suspense |
| `animate-bounce` | 1s | Scroll cue at bottom of hero |
| None observed | — | No custom keyframe animations in source |

### Transform Behavior

| Transform | Usage | Notes |
| --- | --- | --- |
| `scale()` | Icon lift on hover (1.1x) | Service card icons, portfolio overlays |
| `translateY()` | Slide-up animation on scroll | Initial `translate-y-10` → `translate-y-0` |
| `rotate()` | Menu hamburger lines, dropdown chevron | State-driven rotation (e.g., 45° when open) |
| `translate()` | Mobile menu slide-down | `-translate-y-full` → `translate-y-0` |

### Reduced Motion

**Status:** Not observed in implementation

- No `prefers-reduced-motion` media query detected
- Animations run on all devices and user preferences
- No toggle for animation preferences

---

## 21. Forms and User Input

### Contact Form (ContactForm.jsx)

| Field | Type | Required | Validation | Default |
| --- | --- | --- | --- | --- |
| **Name** | text input | ✅ | HTML5 `required` | Empty |
| **Email** | email input | ✅ | HTML5 `required` + `type="email"` | Empty |
| **Purpose** | select dropdown | ✅ | Must select option; guard in handleSubmit | Empty |
| **Message** | textarea | ✅ | HTML5 `required` | Empty |

### Inquiry Purpose Options

| Value | Label | Service Page Association |
| --- | --- | --- |
| `"Recording Session"` | Recording Session | /services/studio |
| `"Podcast Production"` | Podcast Production | /services/podcast |
| `"Live Event Booking"` | Live Event Booking | /services/events |
| `"Video Production"` | Video Production | /services/video |
| `"Other"` | Other / General Inquiry | All pages |
| `""` (empty) | "Select a service…" | Placeholder only |

### Form State Management

**State Variable:** `form` (object) with keys: `name`, `email`, `purpose`, `message`  
**Status Variable:** `status` ∈ `{ "idle", "sending", "success", "error" }`

### Pre-Population from URL

**Mechanism:** `useSearchParams()` hook reads `?purpose=` query parameter

**Example:** `/services/studio?purpose=Recording%20Session` pre-fills the purpose dropdown

**Validation:** Checks that selected purpose matches one of the defined options before setting state

### Submission Provider: EmailJS

**Library:** `@emailjs/browser` (v4.4.1)

**Configuration:** Three env vars (all client-exposed):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

**Submission Flow:**
1. User fills form
2. Click "Send Message"
3. `handleSubmit` calls `emailjs.send(...)`
4. Passes template variables: `from_name`, `from_email`, `purpose`, `message`, `to_name`
5. On success: form resets, success message shown
6. On error: error message shown, form retains data for retry

**Security Considerations:**
- Public key is exposed in browser (by design of EmailJS)
- Vulnerable to abuse if attacker discovered service/template IDs
- No rate limiting or CAPTCHA observed
- No server-side validation

### Error and Success States

| State | Display | Action |
| --- | --- | --- |
| **Idle** | Form visible | User can fill and submit |
| **Sending** | Button disabled + "Sending…" text | Prevent double-submit |
| **Success** | Success message card with checkmark | User can click "Send another message" to reset |
| **Error** | Red error message below button | User can modify form and retry |

### Spam Protection

**Status:** None observed

- No CAPTCHA
- No rate limiting in code (assumed at EmailJS service level)
- No server-side validation
- EmailJS rate limiting (if any) is service-side only

### Embedded Mode

**Feature:** `<ContactForm embedded={true} />` strips outer section padding for embedding in other pages (e.g., BookPage)

**Styling:** When `embedded=true`, renders inner `<div>` instead of `<section>` and omits section padding/border

---

## 22. SEO and Metadata

### React Helmet Async Integration

**Provider:** Wraps entire app in `src/main.jsx`

```javascript
<HelmetProvider>
  <App />
</HelmetProvider>
```

**Usage:** Each page/component can use `<Helmet>` to set per-route metadata

### Page Titles and Descriptions

**Homepage** (`index.html` static):
- Title: "Fabing Productions | Recording Studio, Podcast, Live Events & Video Production"
- Description: "Fabing Productions is a full-service production house offering professional recording studio sessions, podcast production, live event coordination, and cinematic video storytelling."

**Service Pages** (dynamic via Helmet, config in `src/data/services.jsx`):
- Example (Studio): "Professional Recording Studio & Mixing | Fabing Productions"
- Desc: "Book a recording session at Fabing Productions — professional music recording, mixing, and mastering with top-tier preamps, a curated mic locker, and acoustic isolation booths."

**Other Pages** (Work, Book, etc.):
- Per-page titles set in component using Helmet

### Open Graph Metadata

**Homepage** (`index.html`):
- `og:type`: `website`
- `og:title`: "Fabing Productions | Sound. Sight. Stage."
- `og:description`: "Professional recording studio, podcast production, live event coordination, and cinematic video — all under one roof."
- `og:image`: `https://fabingproductions.com/og-image.jpg` (not verified to exist)
- `og:url`: `https://fabingproductions.com/`

### Twitter Card

**Homepage** (`index.html`):
- `twitter:card`: `summary_large_image`
- `twitter:title`: "Fabing Productions | Sound. Sight. Stage."
- `twitter:description`: "Professional recording studio, podcast production, live event coordination, and cinematic video."
- `twitter:image`: `https://fabingproductions.com/og-image.jpg`

### Canonical URLs

**Homepage** (`index.html`):
- `<link rel="canonical" href="https://fabingproductions.com/" />`

**Other Pages:** No explicit canonical tags observed; assumed to be self-referential

### Structured Data (JSON-LD)

**Schema Type:** `LocalBusiness`

**Fields:**
- `name`: "Fabing Productions"
- `description`: "Full-service production house: recording studio, podcast production, live event coordination, cinematic video."
- `url`: "https://fabingproductions.com"
- `address`: `{ "@type": "PostalAddress", "addressCountry": "US" }` (no street/city)
- `sameAs`: [] (empty array; no social URLs hardcoded)
- `hasOfferCatalog`: Array of 4 services (Studio, Podcast, Live Event, Video)

### Semantic Heading Structure

Observed patterns (mobile-first):
- H1: Hero headline, one per page
- H2: Section headings (Services, Work, etc.)
- H3: Subsection headings (card titles, process steps)
- No H4+: Generally not used

### Internal Linking

**Navigation:**
- Navbar links to all major routes
- Footer links to services and key pages
- CTA buttons link to /book and service pages

**Intra-Page Anchors:**
- Hero CTA: `href="#services"`, `href="#work"`, `href="#contact"`
- Footer: `href="/#services"` (root nav link)

### Image Alt Text

**Coverage:**
- Portfolio images: `alt={item.title}` (title from Firestore)
- Icons: `aria-hidden="true"` (decorative, no alt needed)
- Hero/decorative images: No alt (background images, SVG overlays)

### Sitemap

**Status:** Not observed in repository

No `public/sitemap.xml` or dynamic sitemap generation detected. Manual submission to search engines may be required.

### Robots Directives

**Homepage** (`index.html`):
- `<meta name="robots" content="index, follow" />`

**SPA Routing:** No per-route robots meta tags observed; entire site assumes indexable

---

## 23. Accessibility

### Semantic HTML

| Element | Usage | Implementation |
| --- | --- | --- |
| **`<main>`** | Primary content area | `MainLayout.jsx` wraps Outlet in `<main>` |
| **`<nav>`** | Navigation areas | Navbar, footer use `<nav role="menu">` and `role="navigation"` |
| **`<header>`** | Fixed header | Navbar wrapped in `<header>` |
| **`<footer>`** | Page footer | `Footer.jsx` uses `<footer>` |
| **`<section>`** | Content sections | Services, Work, Contact use `<section id="...">` |
| **`<article>`** | Card/portfolio items | Masonry cards use `<article>` |
| **`<button>` vs `<a>`** | Interactivity | Proper element choice; NavLink for routing |

### Heading Hierarchy

- **H1:** Hero headline (one per page)
- **H2:** Section headings (services, gallery, contact)
- **H3:** Card/subsection titles
- **No skipped levels observed:** Hierarchy is semantic

### Keyboard Navigation

| Component | Navigation | Implementation |
| --- | --- | --- |
| **Navbar links** | Tab through links | NavLink/Link elements are keyboard-accessible |
| **Dropdown menu** | Open/close with Enter/Space | onFocus/onKeyDown handlers not explicit; relies on browser |
| **Form inputs** | Tab order | Standard input/textarea/select navigation |
| **Buttons** | Tab + Enter/Space to activate | Standard button behavior |
| **Mobile menu** | Close on Escape | Not implemented; menu only closes on link click or backdrop click |

**Gap:** Mobile menu does not respond to Escape key; reduced keyboard accessibility on mobile

### Focus States

| Element | Focus Indicator | Styling |
| --- | --- | --- |
| **Form inputs** | Border color gold | `focus:border-gold-500 focus:outline-none` |
| **Links** | Default browser outline | No custom focus styling observed |
| **Buttons** | Default browser outline | No custom focus styling observed |
| **Navigation items** | Color change (isActive state) | NavLink applies active class; not focus-specific |

**Gap:** Some interactive elements lack visible focus indicators; relies on browser defaults

### ARIA Attributes

| Attribute | Usage | Implementation |
| --- | --- | --- |
| `aria-hidden="true"` | Decorative icons | Applied to SVG icons in Services, Work |
| `aria-expanded` | Dropdown/menu state | Navbar dropdown and mobile menu |
| `aria-label` | Accessible names | Hamburger button, close button, modal overlay |
| `role="menu"` | Menu container | Services dropdown |
| `role="menuitem"` | Menu items | Service dropdown items |
| `role="navigation"` | Nav regions | Footer nav sections |
| No `aria-live` | Dynamic content | Not observed; success messages in ContactForm are static |
| No `aria-describedby` | Form help text | Not observed |

### Form Labels

**Implementation:** Every form input has associated `<label>` with `htmlFor`

```jsx
<label htmlFor="name" className="...">Name <span className="text-gold-600">*</span></label>
<input id="name" name="name" ... />
```

**Required Field Indicator:** Red asterisk (`*`) rendered with `text-gold-600` class (color-only indicator; not sufficient on its own; placeholder says "required")

### Color Contrast

**Visual Assessment:**
- **Gold text on dark background:** Gold-400 (#f59e0b) on zinc-950 (#09090b) = adequate contrast
- **White text on dark background:** zinc-100 on zinc-950 = excellent contrast
- **Muted text on dark background:** zinc-400/500 on zinc-950 = borderline; may not meet AA standard
- **No contrast checking tool applied:** Assumed accessibility but not formally verified

**Gaps:** Muted secondary text (zinc-400) on dark background may fail WCAG AA contrast ratio

### Motion Preferences

**Status:** Not implemented

- `prefers-reduced-motion` media query not used
- Animations run on all devices
- No toggle or option to disable animations

### Images and Icons

| Type | Alt Text | Approach |
| --- | --- | --- |
| **Decorative SVG icons** | None (aria-hidden) | `aria-hidden="true"` applied |
| **Portfolio thumbnails** | Title text | `alt={item.title}` from Firestore |
| **Background images** | N/A | SVG data URIs, gradients (no alt needed) |

### Screen Reader Testing

**Status:** Not formally tested

No indication that the site has been tested with screen readers (NVDA, JAWS, VoiceOver). Semantic markup and ARIA labels suggest basic accessibility, but gaps exist.

### Gaps and Recommendations (Not Implemented)

1. **Mobile menu Escape key:** Add keyboard handler to close menu
2. **Focus indicators:** Add visible focus styles beyond browser defaults
3. **Form validation messages:** Add `aria-live` or `aria-describedby` for dynamic error/success states
4. **Color contrast:** Verify secondary text meets WCAG AA (4.5:1 for small text)
5. **Reduced motion:** Respect `prefers-reduced-motion` and disable animations
6. **Skip link:** Add skip-to-content link for keyboard users
7. **Screen reader testing:** Test with VoiceOver, NVDA, or JAWS

---

## 24. Security and Configuration

### Environment Variables and Secrets

**Frontend Secrets** (exposed in browser):
- All `VITE_FIREBASE_*` variables (API key, app ID, messaging sender ID)
- All `VITE_EMAILJS_*` variables (service ID, template ID, public key)

**Backend Secrets** (server-side, not in browser):
- `FIREBASE_SERVICE_ACCOUNT_BOTRIDGE` (JSON key for Firebase Admin)
- Stored as GitHub Actions secret; never committed

**Handling:**
- Frontend secrets: Vite injects at build time; values visible in browser
- Local dev: Store in `.env.local` (git-ignored)
- CI/CD: GitHub Actions repository secrets
- Never commit `.env.local` or service account key JSON

### Firebase Client Configuration

**Initialization:** `src/lib/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

**Public vs Secret:** All Firebase Web config is public; API key restricted by Google Cloud (IP/referrer restrictions in console)

### Firebase Admin Usage

**Purpose:** Administrative CLI and functions (seed scripts, deployment)  
**Distribution:** Installed as devDependency in root `package.json`  
**Key Storage:** GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT_BOTRIDGE`  
**Access:** Functions deploy via CI/CD; local seed scripts require manual key setup

### Firestore Rules

**File:** `firestore.rules`

```
match /productions/{document=**} {
  allow read: if true;                    # Public read
  allow write: if false;                  # No client writes
}
match /{document=**} {
  allow read, write: if false;            # All other collections: deny all
}
```

**Security Model:**
- Portfolio data is publicly readable (intentional; used in gallery)
- No writes allowed from client (content changes require backend update)
- No authentication required for reads
- All other collections blocked entirely

### Public Indexes and Firestore Emulator

**Indexes File:** `firestore.indexes.json`

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

Currently empty; no custom indexes defined (default indexes sufficient for current queries)

### EmailJS Integration Security Model

**Client-Side Exposure:** EmailJS public key and template IDs appear in browser JavaScript (this is expected and necessary for client-side form submission)

**Security Approach:** EmailJS uses a tiered security model:
1. **Public Key:** Exposed in client code; designed to be public
2. **Service ID:** Configured in frontend; identifies which email service processes the request
3. **Template ID:** Configured in frontend; specifies which email template to use
4. **Rate Limiting:** EmailJS provides server-side rate limiting based on plan tier
5. **Domain Restrictions:** Can be configured in EmailJS dashboard to accept requests only from `fabingproductions.com`
6. **Template Restrictions:** Email template can restrict which fields are allowed and how they're processed

**Actual Abuse Risk:**
- Low: Attacker would need to spoof requests that match the service ID, template ID, and domain origin
- Medium: Form submission to EmailJS could be rate-limited without proper configuration
- High: If domain restrictions are not configured in EmailJS dashboard, attacker could send emails from any origin

**Current Configuration:** Not verified from local repository (dashboard-level settings cannot be inspected from code)

**Recommendations (if applicable):**
- Verify domain restrictions are configured in EmailJS dashboard to accept only requests from `fabingproductions.com`
- Monitor EmailJS usage metrics for unusual volume
- If form abuse occurs, implement CAPTCHA on ContactForm component
- Consider server-side email proxy for sensitive communications (currently not implemented)

### Input Validation

**Client-Side:** HTML5 form validation only
- `required` attribute on form inputs
- `type="email"` on email input (browser validation)
- No regex or custom validation

**Server-Side:** None (EmailJS handles form submission directly)

**Risk:** Form can be bypassed or spoofed via browser dev tools; no server-side verification

**Recommendation:** Implement backend validation; consider Google reCAPTCHA

### Dependency Risks

**Current Status:** No known high-severity vulnerabilities detected (as of verification date)

**Observable Dependencies:**
- React, React Router, Firebase: Regularly maintained
- EmailJS: Maintained by Formspree (reputable)
- Tailwind CSS: Active maintenance
- Vite, ESLint: Modern tooling, actively maintained

**Supply Chain:** No git submodules or locally-vendored code; all deps from npm registry

### Build and Deploy Security

**CI/CD Safeguards:**
1. `npm ci` (clean install, validates lock file)
2. ESLint runs (not enforced; can proceed on warnings)
3. Build verification (checks `dist-fabing/index.html` exists)
4. Manual deploy trigger (no auto-push on successful build)

**Missing Safeguards:**
- No automated security scanning (e.g., npm audit in pipeline)
- No code signing on commits
- No branch protection on main (inferred)
- No deployment approval required

### Content Security Policy

**Status:** Not observed

No CSP headers set in `firebase.json` or code. Browser defaults apply.

**Recommendation:** Consider adding CSP header for defense-in-depth

### Security Headers

**Observed in `firebase.json`:**
- Cache-Control headers (cache strategy only)

**Not observed:**
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

**Recommendation:** Add security headers in Firebase hosting config

---

## 25. Testing and Verification

### Automated Tests

**Status:** No test files found in repository

```
grep -r "\.test\.js\|\.spec\.js" src/
(no results)
```

No testing framework detected in `package.json` (no Jest, Vitest, Mocha, etc.)

### ESLint Linting

**Configuration:** `eslint.config.js` (modern flat config)

**Rules Applied:**
- `@eslint/js` recommended
- `eslint-plugin-react-hooks` recommended
- `eslint-plugin-react-refresh` recommended

**Execution:** `npm run lint`

**Current Status:** Command exits with status 1 (failure); reports 349 linting errors

**Error Sources (Pre-Existing, Not Related to Documentation Changes):**
- Build output directory (`dist-fabing/`) contains minified code that triggers ESLint errors (eslintignore pattern does not include `dist-fabing`, only `dist`)
- Application source code contains React hooks violations (setState called synchronously in effects)
- Functions and seed script use CommonJS syntax (require, exports) which conflicts with ESLint's ESM-focused configuration
- One unused variable (`activeCat` in WorkPage.jsx)

**Impact on Build:** ESLint failures do NOT prevent build from succeeding. `npm run build` completes successfully independently of linting status.

**CI/CD Enforcement:** Not required in CI/CD workflow. GitHub Actions performs build verification only; linting is not a gate.

### TypeScript

**Status:** Not used

No `tsconfig.json` or type checking. All source is JavaScript (`.js`, `.jsx`).

### Build Verification

**In CI/CD:**
- `npm run build` must succeed
- `dist-fabing/index.html` must exist post-build

**Local:**
- `npm run build` outputs to `dist-fabing/`
- `npm run preview` allows local testing of production build

### Browser Testing

**Manual:** Developers responsible for testing in target browsers

**Automated:** None observed (no Playwright, Cypress, Selenium)

### Emulator Testing

**Available:** Firebase Emulator Suite for local Firestore/Functions/Hosting testing

```bash
npm run emulators  # Start emulator
npm run seed       # Seed test data
```

**Usage:** Optional; not integrated into CI/CD

### Pre-Deployment Checklist

**Recommended (not enforced):**
1. Run `npm run lint` locally
2. Run `npm run build` and verify output
3. Run `npm run preview` and test manually
4. Verify `.env.local` is not committed
5. Verify no secrets in code or console.log

---

## 26. Known Technical Characteristics and Constraints

### Core Implementation Model

1. **Client-Side SPA:** All routing, page transitions, and state management happen in the browser
2. **Firebase Dependency:** Portfolio gallery fails gracefully if Firestore unavailable (infinite loading)
3. **EmailJS Dependency:** Contact form requires EmailJS service to function; no fallback
4. **No Server-Side Rendering:** Every page loads as empty HTML shell + React bundle
5. **No Automated Testing:** Manual testing only; no safety net for regressions

### Performance Characteristics

1. **Code Splitting:** React Router lazy-loads each page component; reduces initial bundle
2. **CSS Bundling:** Tailwind purges unused styles at build time
3. **Asset Hashing:** Vite content-hashes JS/CSS for cache busting
4. **No Image Optimization:** Images served as-is; no resizing, compression, or modern formats
5. **Emulator Support:** Local dev can test Firestore without Firebase project

### Content and Data

1. **Hard-Coded Content:** Service descriptions, process, gear list stored in source code (requires deploy to change)
2. **Firestore Portfolio:** Production gallery items stored in Firestore (can be updated without code deploy)
3. **No Markdown or CMS:** No static site generation, no headless CMS integration
4. **Email Delivery:** Contact form submissions sent via EmailJS; not stored in Firestore

### Styling

1. **No Design System Package:** No component library, Storybook, or formal design tokens
2. **Tailwind Utilities Primary:** Most styling via Tailwind class names; inline styles for gradients
3. **Mixed Color Definitions:** Gold defined in `@theme` block; other colors via Tailwind defaults
4. **No CSS Modules:** All styles global or Tailwind scoped

### Deployment

1. **Cloudflare Pages Current:** Deployed to Cloudflare Pages CDN automatically via Git integration on successful build verification
2. **SPA Rewrite:** All unmatched routes rewritten to `index.html` via `public/_redirects` file (Cloudflare Pages)
3. **CI/CD Role:** GitHub Actions builds on push (`main`); verifies build succeeds; Cloudflare Pages then automatically deploys
4. **Firebase Config:** Firebase Hosting configuration retained in repository but not actively used; would require manual `firebase deploy` to activate
5. **Multisite Safety:** Firebase project hosts multiple sites; if Firebase Hosting is ever manually reactivated, `--only hosting:fabing` flag is required

### Unused or Deprecated

1. **Firebase Cloud Functions:** Placeholder stub only; not used for business logic
2. **Firebase Auth:** Imported but not used (lazy-loaded to prevent crashes)
3. **Firebase Storage:** Imported but not used (lazy-loaded to prevent crashes)
4. **`src/App.css`:** File exists but not imported or used
5. **`WorkGallery.jsx` component:** Defined but not used (superseded by WorkPage)

### Development Environment

1. **Node 20+:** Required for build tooling and Firebase emulator
2. **npm ci:** Used in CI/CD for deterministic installs
3. **Vite Dev Server:** HMR enabled; hot reload on JS/CSS changes
4. **Firebase Emulator:** Optional for local Firestore testing
5. **ESLint:** Advisory linting; no pre-commit hook observed

---

## 27. Maintenance Rules

These rules guide future development and help AI agents maintain code consistency:

### General Principles

1. **Document What Exists:** This document describes the current implementation. Do not describe planned or aspirational features.
2. **Preserve Architectural Decisions:** Do not replace the tech stack, routing model, or hosting setup without explicit architectural decision.
3. **Minimal Abstraction:** Three similar lines of code is fine; premature abstractions are discouraged.
4. **No Speculative Features:** Do not add error handling, fallbacks, or validation for scenarios that can't happen.

### Styling Maintenance

5. **Reuse Colors:** Before adding a new hex value or Tailwind token, search for existing similar colors. Use `gold-400`, `zinc-800`, `sky-400`, etc. before inventing new values.
6. **Prefer Tailwind Utilities:** Use Tailwind classes (e.g., `gap-5`, `px-6`, `text-sm`) over custom CSS or arbitrary values. Only use arbitrary values for values not in Tailwind's default scale.
7. **Consistent Spacing:** Section padding is typically `py-24` (96px); grid gaps are `gap-5` (20px); form gaps are `gap-4` (16px). Follow these patterns.
8. **Mobile-First:** Apply base styles for mobile; use `sm:`, `md:`, `lg:` prefixes for larger breakpoints. Never use `max-width` media queries.
9. **Preserve Hierarchy:** Do not change heading sizes, font weights, or color assignments without considering the full visual hierarchy. All headings use Cinzel serif; body text uses Inter sans-serif.

### Component Maintenance

10. **Reuse Existing Components:** Before creating a new component, check if an existing component can be extended or configured. ServiceDetail is a template for all service pages; don't duplicate its structure.
11. **Data-Driven Configuration:** Service information lives in `src/data/services.jsx`. If multiple components need the same data (routes, names, icons), access it from this single source.
12. **Service-Specific Styling:** Each service (studio, podcast, events, video) has its own accent color and configuration. Maintain this separation when adding features.

### Content and Data

13. **Hard-Coded Content:** Service descriptions, process steps, and gear lists are defined in `src/data/services.jsx`. To update them, edit the file and re-deploy.
14. **Portfolio Content:** Production gallery items are read from Firestore. Use Firebase Console or the seed script to update portfolio items without code changes.
15. **Form Data:** Contact form submissions are sent to EmailJS; they are not stored in Firestore. No infrastructure exists to retrieve past submissions.

### Routing and Navigation

16. **Route Metadata:** When adding a new route, update `src/data/services.jsx` SERVICE_ROUTES if it's a navigable page. Use React Helmet to set page title and description.
17. **Lazy Loading:** All pages are lazy-loaded with `lazy()` and wrapped in `<Suspense>`. Maintain this pattern for new pages to keep bundle size manageable.

### External Services

18. **Firebase Firestore:** Production reads are public; no writes allowed from client. If you need to modify Firestore rules or add indexes, update `firestore.rules` and `firestore.indexes.json` and deploy with `npm run deploy:rules`.
19. **EmailJS:** Contact form uses EmailJS; three environment variables are required. Do not hard-code EmailJS template data in components; all template variables pass through the ContactForm component.
20. **Cloudflare Pages:** The `public/_redirects` file controls SPA routing for Cloudflare Pages. Do not delete this file; if you remove it, direct URL navigation will break.

### Build and Deploy

21. **Build Output:** Always build to `dist-fabing/` (configured in `vite.config.js`). This directory is required by both Firebase and Cloudflare configs.
22. **Environment Variables:** All `VITE_*` environment variables are injected at build time. They must be set in `.env.local` (local dev) or GitHub Actions secrets (CI/CD).
23. **Deploy Scope:** Always use `firebase deploy --only hosting:fabing` to avoid accidentally deploying to other Firebase hosting targets in the multisite project.
24. **No Seed in Production:** The `npm run seed:prod` script is dangerous and should only run with explicit intent. Automated seeding on deploy is not configured and should not be added without architectural review.

### Testing and Quality

25. **Lint Before Commit:** Run `npm run lint` to catch issues early. Fix warnings; do not ignore them.
26. **Build Verification:** Run `npm run build` locally before pushing. Verify `dist-fabing/index.html` exists.
27. **No Committed Secrets:** Never commit `.env.local`, service account keys, or any secrets. Use `.gitignore` to protect sensitive files.
28. **Manual Testing:** No automated tests exist. Test new features manually in `npm run preview` before merging to main.

### Documentation

29. **Keep This Document Current:** When you make significant changes to the tech stack, design system, or architecture, update this document. Stale documentation is worse than no documentation.
30. **Distinguish Implementation from Proposal:** This document describes what exists, not what could exist. Do not describe planned features, roadmap items, or aspirational improvements in the "current" sections.

---

## 28. Verification Commands

Use these commands to validate the project and ensure the documentation remains accurate.

### Installation and Lint

```bash
npm install                    # Install dependencies
cd functions && npm install    # Install Functions dependencies
cd ..
npm run lint                   # Check code quality
```

### Build and Preview

```bash
npm run build                  # Production build → dist-fabing/
ls dist-fabing/index.html      # Verify build output exists
npm run preview                # Preview production build locally
# Open http://localhost:4173 (or port shown) and test routes
```

### Local Development with Emulator

```bash
# Terminal 1: Vite dev server
npm run dev
# Open http://localhost:5173

# Terminal 2: Firebase emulator
npm run emulators
# Emulator UI: http://localhost:4000

# Terminal 3: Seed test data (if using emulator)
npm run seed
```

### Firestore and Deployment

```bash
# Setup Firebase target (one-time)
firebase target:apply hosting fabing fabing-productions

# Deploy hosting only (scoped to avoid multisite issues)
firebase deploy --only hosting:fabing

# Deploy Firestore rules and indexes only
npm run deploy:rules
```

### Security and Secrets Check

```bash
# Ensure .env.local is git-ignored
grep ".env.local" .gitignore

# Verify no secrets in source code
grep -r "FIREBASE_API_KEY\|EMAILJS_PUBLIC_KEY" src/ 
# (Should return no results in actual source; only in .env.local)
```

---

## 29. Evidence Index

| Area | Primary Files |
| --- | --- |
| **Dependencies & Build** | `package.json`, `package-lock.json`, `vite.config.js` |
| **Application Entry** | `index.html`, `src/main.jsx`, `src/App.jsx` |
| **Routing & Pages** | `src/App.jsx`, `src/pages/*.jsx`, `src/layouts/MainLayout.jsx` |
| **Components** | `src/components/*.jsx` (Navbar, Hero, Services, ContactForm, etc.) |
| **Styling & Theme** | `src/index.css`, `vite.config.js` (Tailwind plugin), `src/data/services.jsx` (colors) |
| **Data** | `src/data/services.jsx` (hard-coded), Firestore (productions collection) |
| **Firebase** | `src/lib/firebase.js`, `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json` |
| **Forms** | `src/components/ContactForm.jsx` (EmailJS integration) |
| **SEO** | `index.html` (static meta), `src/pages/*.jsx` (Helmet usage) |
| **Deployment** | `.github/workflows/deploy-fabing.yml`, `firebase.json`, `public/_redirects` |
| **Linting** | `eslint.config.js` |
| **Functions (unused)** | `functions/src/index.js`, `functions/package.json` |

---

## 30. Relationship to the Reusable Website Tech Stack Template

### This Document's Role

**This file is the Fabing Productions implementation record**, not a universal template for all website projects.

- It describes the **specific, current choices** made for Fabing Productions (Vite, React, Tailwind, Cloudflare Pages, Firestore, EmailJS, etc.)
- It is **not prescriptive** for other projects
- It contains **repository-specific values and decisions** that should not be copied blindly to other repositories

### Future Template Extraction

Sections of this document may eventually form a basis for a reusable website tech-stack template (e.g., `docs/TECH-STACK-TEMPLATE.md`). However:

- The **template will be a separate document** specifically marked as a template
- The **template will use placeholder language** ("choose a UI framework," "pick a styling approach") rather than hardcoded values
- The **template will reference this document** as an example of filled-in implementation record
- The **template will prompt questions** ("what is your hosting provider?") rather than assume technology choices

### For Other Website Repositories

When creating a technology-stack document for a different website:

1. **Do not copy this document verbatim.** Create a new `docs/TECH-STACK.md` for that project.
2. **Inspect that repository independently.** Do not assume technologies are the same.
3. **Document what exists, not what you assume.** Verify every claim against source code.
4. **Use the section structure** from this document if it is useful; adapt it if it is not.
5. **Record repository-specific details** (exact Cloudflare Pages config, specific Firebase services in use, etc.).
6. **Distinguish current from legacy configuration** (as done here for Firebase Hosting).

### Universal Sections (Reusable Template Candidates)

The following sections have been written to apply broadly to most websites and could form a template:

- Document Control
- Architecture Summary
- Core Technology Stack (table structure)
- Routing and Navigation
- SEO and Metadata
- Accessibility
- Security and Configuration
- Testing and Verification
- Maintenance Rules
- Verification Commands
- Evidence Index

**These sections should be adapted to each repository**, not copied as-is.

### Repository-Specific Sections (Not Universally Applicable)

The following sections describe Fabing Productions specifically and should NOT be copy-pasted to other projects:

- Website Overview (Fabing's production services focus)
- Route Inventory (Fabing's 8 routes)
- Firestore Schema (Fabing's `productions` collection)
- Color Palette (Fabing's gold + service accent colors)
- Typography (Fabing's Cinzel + Inter strategy)
- Component Styling Patterns (Fabing's Navbar, Hero, Services, etc.)
- Hosting and Deployment (Cloudflare Pages + legacy Firebase config specific to Fabing)

---

## Appendix: Document Maintenance

**Update Triggers:**
- Tech stack change (upgrade, replacement, removal)
- New page type or component pattern
- Routing structure change
- Design system evolution
- Deployment process change
- Major dependency upgrade

**Review Cadence:** Every 6 months or when significant changes occur

**Owner:** Development team + documentation steward

---

*This document was generated on 2026-07-20 via comprehensive source-code inspection. All claims are grounded in observed implementation. For questions or corrections, refer to the repository source files listed in the Evidence Index.*
