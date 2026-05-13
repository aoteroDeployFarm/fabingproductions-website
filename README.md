# Fabing Productions — Website

> **Sound. Sight. Stage.** — Full-service production house covering professional recording, podcast production, cinematic video, and live event coordination.

**Live site:** `https://fabingproductions.com`  
**GCP Project:** `botridge` (Project Number: `851146868663`)  
**Firebase Multisite Target:** `fabing` → Site ID `fabing-productions`  
**Repo:** `aoteroDeployFarm/fabingproductions-website`  
**Deploy branch:** `main`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Route Map](#route-map)
4. [Local Development](#local-development)
5. [Environment Variables](#environment-variables)
6. [Firebase Multisite Setup](#firebase-multisite-setup)
7. [Cloudflare Integration](#cloudflare-integration)
8. [CI/CD — GitHub Actions](#cicd--github-actions)
9. [Required IAM Roles](#required-iam-roles)
10. [Build & Deploy](#build--deploy)
11. [Project Structure](#project-structure)
12. [Firestore Schema](#firestore-schema)
13. [Safety Protocol](#safety-protocol)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    fabingproductions.com                 │
│                   (Cloudflare proxy)                    │
└────────────────────┬────────────────────────────────────┘
                     │  Full / Strict SSL
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Firebase Hosting — Site: fabing-productions     │
│         GCP Project: botridge                           │
│         Public dir:  dist-fabing/                       │
│         SPA rewrite: ** → /index.html                   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐   ┌──────────────────────┐
│  React (Vite)   │   │  Firebase Services   │
│  SPA (client)   │   │  ├─ Firestore        │
│  react-router   │   │  ├─ Cloud Functions  │
│  Tailwind v4    │   │  └─ Hosting          │
└─────────────────┘   └──────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS (v4 Vite plugin) | 4 |
| Routing | react-router-dom | 7 |
| SEO | react-helmet-async | 3 |
| Database | Firebase Firestore (Modular v10+) | 12 |
| Backend | Firebase Cloud Functions (Node 20) | v2 |
| Contact form | EmailJS | 4 |
| Animation | react-intersection-observer | 10 |
| CI/CD | GitHub Actions | — |
| CDN / Proxy | Cloudflare (Full/Strict SSL) | — |

---

## Route Map

| Route | Page Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Brand overview — Hero, Services grid, Studio section, Portfolio preview, Contact |
| `/studio` | `StudioFullPage.jsx` | Full facility page — gear list, facility features, audio samples |
| `/work` | `WorkPage.jsx` | Filterable portfolio — masonry grid, category tabs |
| `/book` | `BookPage.jsx` | Booking page — consultation process, pre-filled ContactForm |
| `/services/studio` | `pages/services/StudioPage` | Studio Production deep-dive (SEO-targeted) |
| `/services/podcast` | `pages/services/PodcastPage` | Podcast & Broadcast deep-dive |
| `/services/events` | `pages/services/EventsPage` | Concert & Event Ops deep-dive |
| `/services/video` | `pages/services/VideoPage` | Visual Storytelling deep-dive |

All routes use `createBrowserRouter` + `lazy()` + `Suspense`. The Firebase Hosting SPA rewrite (`** → /index.html`) handles direct navigation and hard refreshes.

---

## Local Development

### Prerequisites

```bash
node -v   # >= 20
npm -v    # >= 10
firebase --version   # >= 13 (npm install -g firebase-tools)
```

### 1. Clone and install

```bash
git clone git@github.com:aoteroDeployFarm/fabingproductions-website.git
cd fabingproductions-website
npm install
cd functions && npm install && cd ..
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local   # or create manually — see §Environment Variables
```

Edit `.env.local` with your Firebase Web App config and EmailJS keys.

### 3. Start Vite dev server

```bash
npm run dev
# → http://localhost:5173  (or 5174 if port is taken)
```

Hot Module Replacement is enabled. Changes to JSX, CSS, and data files update instantly.

### 4. Start Firebase Emulator Suite (optional but recommended)

The emulator runs Firestore (port 8080), Cloud Functions (port 5001), and Hosting (port 5000) locally.

```bash
# Apply the fabing hosting target (one-time setup)
firebase target:apply hosting fabing fabing-productions

# Start all emulators
npm run emulators
# → Emulator UI:  http://localhost:4000
# → Firestore:    http://localhost:8080
# → Functions:    http://localhost:5001
# → Hosting:      http://localhost:5000
```

To seed Firestore with test `productions` documents, use the Emulator UI at `http://localhost:4000`.

To persist emulator data between sessions:

```bash
npm run emulators:export   # saves to .emulator-data/
# add --import .emulator-data to load on next start (edit package.json if needed)
```

### Connecting the frontend to the emulator

Add to `.env.local` to route Firebase calls through the local emulator:

```env
VITE_USE_EMULATOR=true
```

Then update `src/lib/firebase.js` to conditionally call `connectFirestoreEmulator(db, 'localhost', 8080)` when that flag is set.

---

## Environment Variables

All frontend env vars are prefixed `VITE_` and injected at build time by Vite. They must **never** be committed.

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase Web App API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | `botridge.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | `botridge` |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | `botridge.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | `851146868663` |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase App ID (from Console) |
| `VITE_EMAILJS_SERVICE_ID` | ✅ | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | ✅ | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | ✅ | EmailJS public key |

**Local:** store in `.env.local` (git-ignored).  
**CI:** store as GitHub Actions repository secrets (Settings → Secrets → Actions).

---

## Firebase Multisite Setup

This project is deployed to **one of multiple sites** within the `botridge` GCP project. The multisite configuration ensures the Fabing Productions site is fully isolated from any other sites on the same project.

### How it works

`firebase.json` declares a hosting array entry scoped to `target: fabing`:

```json
{
  "hosting": [
    {
      "target": "fabing",
      "public": "dist-fabing",
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  ]
}
```

`.firebaserc` maps the `fabing` target to the `fabing-productions` site ID:

```json
{
  "projects": { "default": "botridge" },
  "targets": {
    "botridge": {
      "hosting": { "fabing": ["fabing-productions"] }
    }
  }
}
```

### One-time target registration

Run this once per machine / CI environment before deploying:

```bash
firebase target:apply hosting fabing fabing-productions
```

### Verify before every deploy

```bash
npm run build
# Confirm dist-fabing/index.html exists
ls dist-fabing/index.html
```

---

## Cloudflare Integration

Traffic to `fabingproductions.com` is proxied through Cloudflare using **Full (Strict)** SSL mode.

| Setting | Value |
|---|---|
| SSL/TLS Mode | Full (Strict) |
| Origin | Firebase Hosting (HTTPS) |
| Cache | Cloudflare manages static assets via Cache-Control headers |
| Purge | CI step calls `POST /zones/:zone_id/purge_cache` after each deploy |

### Cache-Control headers (set in `firebase.json`)

```json
{ "source": "**/*.@(js|css|woff2)", "Cache-Control": "public, max-age=31536000, immutable" }
{ "source": "index.html",           "Cache-Control": "no-cache" }
```

Immutable JS/CSS chunks are fingerprinted by Vite's content hash — safe to cache forever.  
`index.html` is never cached so clients always receive the latest chunk manifest.

### Cloudflare cache purge (CI)

The workflow purges Cloudflare's CDN cache after every successful Firebase deploy.  
Provide these secrets in GitHub → Settings → Secrets:

| Secret | Description |
|---|---|
| `CF_ZONE_ID` | Cloudflare Zone ID for `fabingproductions.com` |
| `CF_API_TOKEN` | Cloudflare API token with **Cache Purge** permission |

The purge step is conditional — the workflow skips it gracefully if either secret is absent.

---

## CI/CD — GitHub Actions

**File:** `.github/workflows/deploy-fabing.yml`  
**Trigger:** push to `main`  
**Target:** `fabing` hosting target only — `botridge.com` is never touched.

### Pipeline stages

```
Checkout → Install (npm ci) → Build (vite build) → Verify dist-fabing/
  → Firebase deploy --only hosting:fabing → Cloudflare cache purge
```

### Concurrency

```yaml
concurrency:
  group: deploy-fabing
  cancel-in-progress: true
```

A new push cancels any in-flight deploy so the latest commit always wins.

### Required secrets

| Secret | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_BOTRIDGE` | JSON key for the GCP Service Account (see §IAM Roles) |
| `VITE_FIREBASE_API_KEY` | Firebase Web config |
| `VITE_FIREBASE_APP_ID` | Firebase Web config |
| *(all other `VITE_*` vars)* | See §Environment Variables |
| `CF_ZONE_ID` | Cloudflare (optional) |
| `CF_API_TOKEN` | Cloudflare (optional) |

---

## Required IAM Roles

The GitHub Actions Service Account (`github-actions@botridge.iam.gserviceaccount.com` or equivalent) needs the following roles in the `botridge` GCP project:

| Role | ID | Why |
|---|---|---|
| Firebase Hosting Admin | `roles/firebasehosting.admin` | Deploy to Firebase Hosting |
| Firebase Admin | `roles/firebase.admin` | Read project config and service targets |
| Service Account Token Creator | `roles/iam.serviceAccountTokenCreator` | Self-sign short-lived tokens for deployment auth |
| Cloud Build Editor | `roles/cloudbuild.builds.editor` | Required by `FirebaseExtended/action-hosting-deploy` |
| API Gateway Viewer | `roles/apigateway.viewer` | Read API configs during deploy validation |

### Grant roles via gcloud

```bash
PROJECT=botridge
SA=github-actions@botridge.iam.gserviceaccount.com

for ROLE in \
  roles/firebasehosting.admin \
  roles/firebase.admin \
  roles/iam.serviceAccountTokenCreator \
  roles/cloudbuild.builds.editor \
  roles/apigateway.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT \
    --member="serviceAccount:$SA" \
    --role="$ROLE"
done
```

### Create & download the key

```bash
gcloud iam service-accounts keys create sa-key.json \
  --iam-account=$SA \
  --project=$PROJECT
```

Copy the contents of `sa-key.json` into the GitHub secret `FIREBASE_SERVICE_ACCOUNT_BOTRIDGE`. Delete the local file immediately after.

---

## Build & Deploy

### Local build (verify output path)

```bash
npm run build
# Output: dist-fabing/
# Chunks: ~17 code-split JS files + CSS
# Verify: dist-fabing/index.html must exist
```

### Manual deploy (hosting only)

```bash
firebase deploy --only hosting:fabing
```

### Manual deploy (rules + indexes only)

```bash
npm run deploy:rules
# equivalent: firebase deploy --only firestore:rules,firestore:indexes
```

### Manual deploy (functions only)

```bash
cd functions && npm run deploy
```

> ⚠️ **Never run `firebase deploy` without `--only hosting:fabing`.** Omitting the flag risks deploying to other hosting targets or overwriting Firestore rules unexpectedly.

---

## Project Structure

```
fabingproductions-website/
├── .github/
│   └── workflows/
│       └── deploy-fabing.yml      # CI/CD — fabing target only
├── functions/
│   ├── src/index.js               # Cloud Functions v2 (health check stub)
│   └── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                    # createBrowserRouter — 8 routes, all lazy()
│   ├── main.jsx                   # ReactDOM root + HelmetProvider
│   ├── index.css                  # Tailwind v4 + custom gold theme vars
│   ├── data/
│   │   └── services.jsx           # Single source of truth for service routes & page configs
│   ├── layouts/
│   │   └── MainLayout.jsx         # Navbar + Outlet + Footer; scroll-to-top on route change
│   ├── lib/
│   │   └── firebase.js            # Firebase v10 modular SDK init (db, functions)
│   ├── components/
│   │   ├── AudioPlayer.jsx        # HTML5 Audio API — play/pause, scrubber, waveform bars
│   │   ├── ContactForm.jsx        # EmailJS form; reads ?purpose= via useSearchParams
│   │   ├── Footer.jsx             # 3-col layout; Service + Navigate links
│   │   ├── Hero.jsx               # Home page hero — "Sound. Sight. Stage."
│   │   ├── Navbar.jsx             # Scroll-aware; Services dropdown; Book CTA ring; mobile menu
│   │   ├── ServiceDetail.jsx      # Reusable template: Hero → Gear → Process → Gallery → CTA
│   │   ├── Services.jsx           # 4-col service grid with "Learn More" route links
│   │   ├── StudioSection.jsx      # Home page studio teaser section
│   │   └── WorkGallery.jsx        # Firestore-backed gallery; defaultCategory/showFilters props
│   └── pages/
│       ├── Home.jsx               # /
│       ├── StudioFullPage.jsx     # /studio
│       ├── WorkPage.jsx           # /work  (masonry grid, sticky filter bar)
│       ├── BookPage.jsx           # /book  (consultation process + ContactForm)
│       └── services/
│           ├── StudioPage.jsx     # /services/studio
│           ├── PodcastPage.jsx    # /services/podcast
│           ├── EventsPage.jsx     # /services/events
│           └── VideoPage.jsx      # /services/video
├── .env.local                     # Local secrets — git-ignored
├── .firebaserc                    # Project + target mappings
├── firebase.json                  # Hosting (fabing target, dist-fabing, SPA rewrite), Firestore, Emulators
├── firestore.rules                # Public read on productions; no writes
├── firestore.indexes.json
├── vite.config.js                 # outDir: dist-fabing; Tailwind v4 plugin
└── package.json
```

---

## Firestore Schema

**Collection:** `productions`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | ✅ | Display name of the production |
| `category` | `string` | ✅ | One of: `"Video"` \| `"Audio"` \| `"Live Events"` |
| `year` | `number` | ✅ | Used for `orderBy('year', 'desc')` |
| `description` | `string` | ✅ | Short description (2–3 sentences) |
| `thumbnailUrl` | `string \| null` | — | Direct URL to thumbnail image |
| `externalUrl` | `string \| null` | — | Link to video, SoundCloud, event recap, etc. |

**Security rules:** `productions` is publicly readable, never writable from the client.

---

## Safety Protocol

> This is a Firebase Multisite project. The `botridge` GCP project hosts multiple sites. Incorrect deploy commands can affect sites other than `fabing-productions`.

**The three rules:**

1. **Always scope deploys:** `firebase deploy --only hosting:fabing`
2. **Always verify the build target:** `dist-fabing/index.html` must exist before deploying
3. **Never run a bare `firebase deploy`** — it deploys all targets in `firebase.json`

The CI/CD workflow enforces (1) and (2) automatically. When running manual deploys, follow the commands in §Build & Deploy exactly.
