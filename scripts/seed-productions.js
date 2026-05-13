#!/usr/bin/env node
/**
 * seed-productions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Populates the Firestore `productions` collection with 8 sample portfolio
 * entries for Fabing Productions (GCP project: botridge).
 *
 * Emulator-aware: if FIRESTORE_EMULATOR_HOST is set the script routes all
 * writes to the local emulator instead of production Firestore.
 *
 * Usage (emulator):
 *   FIRESTORE_EMULATOR_HOST=localhost:8080 npm run seed
 *
 * Usage (production — requires ADC or GOOGLE_APPLICATION_CREDENTIALS):
 *   npm run seed:prod
 *
 * Safety: the script will refuse to write to production unless the
 * --production flag is explicitly passed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp }        from 'firebase-admin/firestore'
import { readFileSync, existsSync }       from 'fs'
import { resolve, dirname }               from 'path'
import { fileURLToPath }                  from 'url'

const __dirname    = dirname(fileURLToPath(import.meta.url))
const PROD_FLAG    = process.argv.includes('--production')
const IS_EMULATOR  = !!process.env.FIRESTORE_EMULATOR_HOST
const PROJECT_ID   = 'botridge'

// ── Safety gate ───────────────────────────────────────────────────────────────
if (!IS_EMULATOR && !PROD_FLAG) {
  console.error(`
✋  Safety check failed.

   FIRESTORE_EMULATOR_HOST is not set, which means this script would write
   to PRODUCTION Firestore on project "${PROJECT_ID}".

   To seed the local emulator (recommended):
     FIRESTORE_EMULATOR_HOST=localhost:8080 npm run seed

   To seed production (requires Application Default Credentials):
     npm run seed:prod
`)
  process.exit(1)
}

// ── Firebase Admin init ───────────────────────────────────────────────────────
function initAdmin() {
  if (getApps().length) return

  if (IS_EMULATOR) {
    // Emulator accepts any project ID; no credentials needed.
    initializeApp({ projectId: PROJECT_ID })
    console.log(`🔌  Emulator mode → ${process.env.FIRESTORE_EMULATOR_HOST}`)
  } else {
    // Production: try GOOGLE_APPLICATION_CREDENTIALS, then a local sa-key.json
    const saKeyPath = resolve(__dirname, '..', 'sa-key.json')
    if (existsSync(saKeyPath)) {
      const serviceAccount = JSON.parse(readFileSync(saKeyPath, 'utf8'))
      initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID })
      console.log(`🔐  Service account key loaded from sa-key.json`)
    } else {
      // Fall through to Application Default Credentials (gcloud auth login)
      initializeApp({ projectId: PROJECT_ID })
      console.log(`🔐  Using Application Default Credentials`)
    }
    console.log(`🚀  Production mode → GCP project "${PROJECT_ID}"`)
  }
}

// ── Seed data ─────────────────────────────────────────────────────────────────
/**
 * 8 portfolio entries across all three categories.
 * Descriptions reflect Fabing Productions' core strengths:
 * high-fidelity audio, cinematic video, and technical live event management.
 */
const PRODUCTIONS = [
  // ── Audio ──────────────────────────────────────────────────────────────────
  {
    title:        'Hollow Ground — Full-Length Album',
    category:     'Audio',
    year:         2025,
    description:  'Steven Fabing engineered and produced this 12-track indie-rock album from pre-production through final master. Tracked live in the Fabing Productions isolation booths with a Neve 8078 console signal chain; mixed to analog tape for a warm, cohesive sound that placed on regional streaming charts in its first week.',
    thumbnailUrl: '/assets/thumbs/hollow-ground-album.jpg',
    externalUrl:  'https://open.spotify.com/album/placeholder-hollow-ground',
  },
  {
    title:        'Meridian Sessions — Jazz Quartet EP',
    category:     'Audio',
    year:         2026,
    description:  'A live-to-two-track recording of a jazz quartet captured in Fabing Productions\' acoustically treated control room. Minimal post-processing preserves the natural room ambience; the EP showcases the facility\'s ability to capture nuanced ensemble dynamics with clarity at every frequency.',
    thumbnailUrl: '/assets/thumbs/meridian-sessions-ep.jpg',
    externalUrl:  'https://soundcloud.com/placeholder-meridian-sessions',
  },
  {
    title:        'The Shift Podcast — Season 2',
    category:     'Audio',
    year:         2024,
    description:  'Full-season production for an entrepreneurship podcast averaging 45,000 weekly downloads. Fabing Productions handled multi-guest remote recording via Source Connect, noise reduction, dynamic normalization, and delivery in both MP3 and lossless WAV for all 24 episodes.',
    thumbnailUrl: '/assets/thumbs/the-shift-podcast-s2.jpg',
    externalUrl:  'https://theshift.fm/season-2',
  },

  // ── Video ──────────────────────────────────────────────────────────────────
  {
    title:        'Blueprint — Brand Documentary',
    category:     'Video',
    year:         2025,
    description:  'A 22-minute brand documentary profiling a regional architecture firm. Shot over three days on ARRI Alexa Mini with anamorphic lenses; color graded to a cinematic teal-and-amber palette. Fabing Productions delivered the full post pipeline: picture edit, color, sound design, and master for web and festival submission.',
    thumbnailUrl: '/assets/thumbs/blueprint-documentary.jpg',
    externalUrl:  'https://vimeo.com/placeholder-blueprint-doc',
  },
  {
    title:        'Wavelength — Music Video',
    category:     'Video',
    year:         2024,
    description:  'Concept-to-delivery music video for a regional R&B artist. Single-day shoot in the Fabing Productions video-ready studio using a three-point LED wall with dynamic scene transitions. Post included motion graphics, custom text treatments, and a vertical cut optimized for social distribution.',
    thumbnailUrl: '/assets/thumbs/wavelength-music-video.jpg',
    externalUrl:  'https://www.youtube.com/watch?v=placeholder-wavelength',
  },
  {
    title:        'Eastline Foods — Product Campaign',
    category:     'Video',
    year:         2026,
    description:  'Six-spot commercial package for a regional food brand\'s spring launch. Fabing Productions provided full-service production: script consultation, tabletop and lifestyle cinematography, on-site audio, and delivery of broadcast-ready 16:9 and social-ready 9:16 masters for each spot.',
    thumbnailUrl: '/assets/thumbs/eastline-foods-campaign.jpg',
    externalUrl:  'https://vimeo.com/placeholder-eastline-foods',
  },

  // ── Live Events ────────────────────────────────────────────────────────────
  {
    title:        'Northside Summer Concert Series',
    category:     'Live Events',
    year:         2024,
    description:  'Fabing Productions served as technical director for a six-night outdoor concert series across two stages, headlining 3,200-capacity crowds. Responsibilities included FOH and monitor mixing, RF coordination for 24-channel wireless, stage-plot execution, and crew management for all load-in and strike operations.',
    thumbnailUrl: '/assets/thumbs/northside-summer-series.jpg',
    externalUrl:  'https://northsidesummerseries.com',
  },
  {
    title:        'Summit Leadership Forum — AV Direction',
    category:     'Live Events',
    year:         2025,
    description:  'A 1,100-attendee corporate leadership forum requiring broadcast-quality AV production. Fabing Productions designed and operated a multi-camera IMAG system, managed speaker confidence monitoring, and coordinated real-time broadcast to remote satellite locations — ensuring zero technical interruptions across a two-day program.',
    thumbnailUrl: '/assets/thumbs/summit-leadership-forum.jpg',
    externalUrl:  'https://summitleadershipforum.org/2025',
  },
]

// ── Seed function ─────────────────────────────────────────────────────────────
async function seed() {
  initAdmin()
  const db    = getFirestore()
  const col   = db.collection('productions')
  const batch = db.batch()

  console.log(`\n📦  Seeding ${PRODUCTIONS.length} documents into "productions" collection...\n`)

  PRODUCTIONS.forEach((entry, i) => {
    const ref = col.doc()           // auto-generated ID
    batch.set(ref, {
      ...entry,
      seededAt: Timestamp.now(),    // audit field — stripped from public reads
    })
    console.log(`   [${i + 1}/${PRODUCTIONS.length}] ${entry.category.padEnd(11)} · ${entry.year} · ${entry.title}`)
  })

  await batch.commit()

  console.log(`
✅  Batch committed — ${PRODUCTIONS.length} documents written.
    Collection : productions
    Project    : ${PROJECT_ID}
    Target     : ${IS_EMULATOR ? `Emulator (${process.env.FIRESTORE_EMULATOR_HOST})` : 'Production'}
`)
}

// ── Run ───────────────────────────────────────────────────────────────────────
seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message)
  process.exit(1)
})
