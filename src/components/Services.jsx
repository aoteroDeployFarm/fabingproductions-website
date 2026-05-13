import { useInView } from 'react-intersection-observer'

// --- SVG icons -----------------------------------------------------------

function IconFilm() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
        d="M7 4v16M17 4v16M2 9h5M17 9h5M2 15h5M17 15h5" />
    </svg>
  )
}

function IconWaveform() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
        d="M2 12h2M4 12c0-2 1-4 2-4s2 2 2 4-1 4-2 4-2-2-2-4zM10 12c0-3.5 1-6 2-6s2 2.5 2 6-1 6-2 6-2-2.5-2-6zM16 12c0-2 1-4 2-4s2 2 2 4-1 4-2 4-2-2-2-4zM20 12h2" />
    </svg>
  )
}

function IconStageLight() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      {/* Spotlight housing */}
      <path stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
        d="M9 3h6l1 4H8L9 3z" />
      {/* Beam */}
      <path stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
        d="M8 7L5 20M16 7l3 13M8 7h8" />
      {/* Spread lines */}
      <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"
        d="M5.5 13.5l-2 1M18.5 13.5l2 1M11 20l-.5 2M13 20l.5 2" />
      {/* Lens circle */}
      <circle cx="12" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

// --- Service data --------------------------------------------------------

const SERVICES = [
  {
    id: 'video',
    label: 'Visual Production',
    icon: <IconFilm />,
    tagline: 'Stories that move people.',
    description:
      'From commercial campaigns and music videos to short films and branded content — we handle concept, direction, cinematography, editing, color grading, and VFX under one roof.',
    capabilities: [
      'Cinematography & Direction',
      'Color Grading & VFX',
      'Branded & Commercial Content',
      'Music Videos & Narratives',
    ],
    accent: 'from-gold-500/20 to-transparent',
  },
  {
    id: 'audio',
    label: 'Audio Engineering',
    icon: <IconWaveform />,
    tagline: 'Sound that shapes emotion.',
    description:
      'Professional recording, mixing, and mastering for music, podcasts, voice-over, and post-production audio. Our acoustically treated studio and field-recording rigs cover every format.',
    capabilities: [
      'Music Recording & Mixing',
      'Podcast & Voice-Over',
      'Film & Video Post Audio',
      'Sound Design & Foley',
    ],
    accent: 'from-sky-500/10 to-transparent',
  },
  {
    id: 'events',
    label: 'Event Production',
    icon: <IconStageLight />,
    tagline: 'Experiences audiences remember.',
    description:
      'End-to-end technical management for concerts, corporate showcases, and large-scale events — live sound, stage design, video playback, lighting rigs, and on-site crew coordination.',
    capabilities: [
      'Live Sound & PA Systems',
      'Stage Design & Lighting',
      'Video Playback & LED Walls',
      'Technical Coordination',
    ],
    accent: 'from-violet-500/10 to-transparent',
  },
]

// --- Card ----------------------------------------------------------------

function ServiceCard({ service, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <article
      ref={ref}
      className={`relative flex flex-col bg-zinc-900 border border-zinc-800 p-8 transition-all duration-700 ease-out group hover:border-zinc-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Subtle top-gradient accent per pillar */}
      <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${service.accent} opacity-40 pointer-events-none`} />

      {/* Icon */}
      <div className="relative mb-6 text-gold-400 group-hover:text-gold-300 transition-colors duration-300">
        {service.icon}
      </div>

      {/* Heading */}
      <h3
        className="font-cinzel text-xl font-semibold text-zinc-100 mb-2 group-hover:text-gold-400 transition-colors duration-300"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {service.label}
      </h3>

      <p className="text-gold-500/70 text-xs tracking-widest uppercase mb-4">
        {service.tagline}
      </p>

      <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
        {service.description}
      </p>

      {/* Capability list */}
      <ul className="space-y-2">
        {service.capabilities.map(cap => (
          <li key={cap} className="flex items-center gap-3 text-xs text-zinc-500 tracking-wide">
            <span className="w-3 h-px bg-gold-600 flex-shrink-0" />
            {cap}
          </li>
        ))}
      </ul>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}

// --- Section -------------------------------------------------------------

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 px-6 bg-zinc-950/80">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">What We Do</p>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Full-Service Production
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="mt-6 text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Three distinct disciplines. One creative team. Seamlessly delivered under one roof.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
