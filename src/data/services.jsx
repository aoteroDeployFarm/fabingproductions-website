// Central service registry — consumed by Navbar, Services grid, and service page routes.

export const SERVICE_ROUTES = [
  { id: 'studio',  path: '/services/studio',  label: 'Studio Production',    short: 'Studio'  },
  { id: 'podcast', path: '/services/podcast', label: 'Podcast & Broadcast',  short: 'Podcast' },
  { id: 'events',  path: '/services/events',  label: 'Concert & Event Ops',  short: 'Events'  },
  { id: 'video',   path: '/services/video',   label: 'Visual Storytelling',  short: 'Video'   },
]

// Full page configs — one per route
export const SERVICE_PAGES = {
  studio: {
    seo: {
      title: 'Professional Recording Studio & Mixing | Fabing Productions',
      description:
        'Book a recording session at Fabing Productions — professional music recording, mixing, and mastering with top-tier preamps, a curated mic locker, and acoustic isolation booths.',
    },
    hero: {
      eyebrow: 'Studio Production',
      headline: 'Where Sound\nBecomes Art.',
      sub: 'Professional recording, mixing, and mastering for artists and bands who demand more from their studio experience.',
      color: 'text-gold-400',
    },
    accent: { text: 'text-gold-400', border: 'border-gold-500/30', glow: 'from-gold-500/10' },
    category: 'Audio',
    contactPurpose: 'Recording Session',
    specs: [
      {
        group: 'Mic Locker — Drums',
        items: ['Sennheiser', 'Audix', 'Telefunken', 'Rode', 'AKG'],
      },
      {
        group: 'Mic Locker — Instruments',
        items: ['Sennheiser', 'Audix', 'Telefunken', 'Rode', 'AKG', 'Shure'],
      },
      {
        group: 'Mic Locker — Vocals',
        items: ['SE Electronics', 'Sennheiser', 'Audix', 'Shure', 'AKG', 'Rode'],
      },
      {
        group: 'Preamps',
        items: ['Midas', 'Lunatech', 'Allen & Heath', 'PreSonus', 'MOTU'],
      },
      {
        group: 'DAW / Interfaces',
        items: ['Studio One', 'Studio Pro', 'Midas', 'Allen & Heath', 'PreSonus', 'MOTU'],
      },
      {
        group: 'Monitoring',
        items: ['Kali Audio', 'Sony', 'Beyerdynamic', 'Turbosound'],
      },
    ],
    process: [
      {
        step: '01',
        title: 'Pre-Production Consult',
        desc: 'We sit down (virtually or in-person) to discuss song structure, tempo, arrangement, and the sonic reference points that excite you. First session is always a consult.',
      },
      {
        step: '02',
        title: 'Tracking Day',
        desc: 'Isolation booths ready, click tracks locked, engineer on the board. Multiple takes comped to perfection — no clock-watching pressure.',
      },
      {
        step: '03',
        title: 'Mix & Master Delivery',
        desc: 'Stems organized and archived. Mixed to your reference, mastered, and delivered as WAV + MP3 optimized for streaming, broadcast, and vinyl.',
      },
    ],
  },

  podcast: {
    seo: {
      title: 'Professional Podcast Production & Live Broadcast | Fabing Productions',
      description:
        'Full-service podcast production and live-stream broadcasting — multi-cam video, isolated audio tracking, and end-to-end distribution to all major platforms.',
    },
    hero: {
      eyebrow: 'Podcast & Broadcast',
      headline: 'Every Episode,\nBroadcast-Ready.',
      sub: 'Full-service podcast production and live-streamed broadcasts with professional multi-cam direction and isolated audio tracking.',
      color: 'text-sky-400',
    },
    accent: { text: 'text-sky-400', border: 'border-sky-500/30', glow: 'from-sky-500/10' },
    category: 'Audio',
    contactPurpose: 'Podcast Production',
    specs: [
      {
        group: 'Mic Locker',
        items: ['Sennheiser', 'Audix', 'Telefunken', 'Rode', 'AKG', 'Shure'],
      },
      {
        group: 'Recording',
        items: ['Isolated Multi-Track', 'ATEM Mini Extreme ISO', 'Sony D-LOG'],
      },
      {
        group: 'Video',
        items: ['Sony', 'GoPro', 'DJI'],
      },
      {
        group: 'Streaming',
        items: ['BlackMagic', 'OSee'],
      },
    ],
    process: [
      {
        step: '01',
        title: 'Format & Content Planning',
        desc: 'Episode structure, intro/outro music, segment breakdown, branding assets, and a repeatable show-notes template — before the mics are ever switched on.',
      },
      {
        step: '02',
        title: 'Record & Stream',
        desc: 'On-site or remote. Multi-cam director calls the shots, real-time audio monitoring catches issues live, and chat moderation keeps your audience engaged.',
      },
      {
        step: '03',
        title: 'Post-Production & Distribution',
        desc: 'Edit, music bed, sound design, chapter markers, transcript, and one-click push to all major podcast directories and social clips.',
      },
    ],
  },

  events: {
    seo: {
      title: 'Live Event Production & Concert Sound | Fabing Productions',
      description:
        'End-to-end live event coordination — FOH sound engineering, PA system deployment, and on-site crew management from load-in to strike.',
    },
    hero: {
      eyebrow: 'Concert & Event Ops',
      headline: 'From Concept\nTo Final Curtain.',
      sub: 'Full-scale event coordination — front-of-house sound engineering, PA system deployment, and on-site crew management from load-in to strike.',
      color: 'text-violet-400',
    },
    accent: { text: 'text-violet-400', border: 'border-violet-500/30', glow: 'from-violet-500/10' },
    category: 'Live Events',
    contactPurpose: 'Live Event Booking',
    specs: [
      {
        group: 'Consoles',
        items: ['Midas', 'Allen & Heath'],
      },
      {
        group: 'PA System',
        items: ['Turbosound'],
      },
      {
        group: 'Lighting',
        items: ['LightKey', 'ADJ', "U'King"],
      },
    ],
    process: [
      {
        step: '01',
        title: 'Site Survey & Tech Rider',
        desc: 'We walk the venue, build the technical rider, coordinate with venue staff on power drops, rigging points, and load-in logistics — weeks before show day.',
      },
      {
        step: '02',
        title: 'Load-In & Soundcheck',
        desc: 'Crew arrives at call time, full rig build and focus, line check, artist soundcheck, and a show-ready sign-off before doors open.',
      },
      {
        step: '03',
        title: 'Live Show & Strike',
        desc: 'FOH engineer and lighting operator run the show cue-by-cue. Full derig and load-out once the venue is clear.',
      },
    ],
  },

  video: {
    seo: {
      title: 'Cinematic Video Production & Music Videos | Fabing Productions',
      description:
        'Cinematic video production, music videos, and commercial content — direction, cinematography, color grading, and post-production delivered end-to-end.',
    },
    hero: {
      eyebrow: 'Visual Storytelling',
      headline: 'Frames That Refuse\nTo Be Ignored.',
      sub: 'Cinematic video production, music videos, and commercial content — direction, camera, color, and delivery all in one place.',
      color: 'text-rose-400',
    },
    accent: { text: 'text-rose-400', border: 'border-rose-500/30', glow: 'from-rose-500/10' },
    category: 'Video',
    contactPurpose: 'Video Production',
    specs: [
      {
        group: 'Cameras',
        items: ['Sony', 'DJI', 'GoPro'],
      },
      {
        group: 'Lenses',
        items: ['Sony', 'Viltrox', 'Tamron'],
      },
      {
        group: 'Lighting',
        items: ['LightKey', 'ADJ', "U'King"],
      },
      {
        group: 'Post Production',
        items: ['DaVinci Resolve', 'Studio Pro'],
      },
    ],
    process: [
      {
        step: '01',
        title: 'Creative Development',
        desc: 'Concept, moodboard, shot list, location scout, talent casting, and a full pre-production deck delivered before shoot day so everyone arrives aligned.',
      },
      {
        step: '02',
        title: 'Production Day',
        desc: 'Director and DP lead the set. AC, gaffer, and grip team keep the machine running. On-set client playback for real-time approvals — no surprises in post.',
      },
      {
        step: '03',
        title: 'Post & Delivery',
        desc: 'Rough cut review, color grade, sound design, motion graphics, and final deliverable in broadcast + digital specs. Archival drives provided.',
      },
    ],
  },
}
