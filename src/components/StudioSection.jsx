import { useInView } from 'react-intersection-observer'
import AudioPlayer from './AudioPlayer'

// ---------------------------------------------------------------------------
// Replace src values with real audio URLs or imported assets once available.
// An empty src string renders a "coming soon" placeholder gracefully.
// ---------------------------------------------------------------------------

const DEMO_TRACKS = [
  {
    id: 'mix-1',
    title: 'Full Band Mix — Room A',
    artist: 'Fabing Productions Studio',
    src: '',   // e.g. '/audio/band-mix-room-a.mp3'
  },
  {
    id: 'mix-2',
    title: 'Acoustic Session — Vocal + Guitar',
    artist: 'Fabing Productions Studio',
    src: '',
  },
  {
    id: 'mix-3',
    title: 'Mastered Single — Radio Edit',
    artist: 'Fabing Productions Studio',
    src: '',
  },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          d="M9 3a3 3 0 000 6h6a3 3 0 000-6H9zM3 10h18M9 14h6M12 14v7" />
      </svg>
    ),
    title: 'Isolation Booths',
    desc: 'Acoustically treated rooms for drum tracking, vocal recording, and live instrument capture.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
    title: 'Control Room',
    desc: 'Industry-standard mixing console, reference monitors, and outboard gear for critical listening.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Hosted Events',
    desc: 'The studio space doubles as a venue for private listening sessions, small showcases, and label showcases.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Video-Ready',
    desc: 'Built-in camera rigs and stage lighting for live session recordings and content capture.',
  },
]

// ── Facility feature tile ────────────────────────────────────────────────────

function FeatureTile({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`flex gap-4 transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex-shrink-0 w-9 h-9 border border-zinc-800 flex items-center justify-center text-gold-400">
        {item.icon}
      </div>
      <div>
        <h4 className="text-zinc-200 text-sm font-medium mb-1">{item.title}</h4>
        <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function StudioSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 })

  return (
    <section id="studio" className="py-24 px-6 bg-zinc-900/40 border-y border-zinc-800/60">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className={`mb-14 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">The Facility</p>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            The Studio
          </h2>
          <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="mt-5 text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            A professional recording environment built for artists and bands — with the
            infrastructure to host events, shoots, and live broadcasts.
          </p>
        </div>

        {/* Two-column layout: facility features + audio player */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — facility details */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((item, i) => (
                <FeatureTile key={item.title} item={item} index={i} />
              ))}
            </div>

            <a
              href="#contact"
              className="inline-block mt-2 px-7 py-3 bg-gold-500 text-zinc-950 font-semibold text-xs tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
            >
              Book Studio Time
            </a>
          </div>

          {/* Right — audio samples */}
          <div>
            <p className="text-zinc-500 text-xs tracking-[0.35em] uppercase mb-5">
              Studio Samples
            </p>
            <AudioPlayer tracks={DEMO_TRACKS} />
            <p className="mt-4 text-zinc-700 text-xs text-center">
              Press play to hear our mixing and mastering work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
