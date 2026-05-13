import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { SERVICE_ROUTES } from '../data/services'

// Map service card id → route path
const ROUTE_MAP = Object.fromEntries(SERVICE_ROUTES.map(r => [r.id, r.path]))

// ── Icons ────────────────────────────────────────────────────────────────────

function IconMic() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
        d="M5 10a7 7 0 0014 0M12 21v-4M8 21h8" />
    </svg>
  )
}

function IconHeadphones() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
        d="M3 18v-6a9 9 0 0118 0v6" />
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
    </svg>
  )
}

function IconStage() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        d="M9 3h6l1 4H8L9 3z" />
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
        d="M8 7L5 20M16 7l3 13M5 14h14" />
      <circle cx="12" cy="6.5" r="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function IconFilm() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
        d="M7 4v16M17 4v16M2 9h5M17 9h5M2 15h5M17 15h5" />
    </svg>
  )
}

// ── Service data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'studio',
    label: 'Studio Production',
    icon: <IconMic />,
    color: 'text-gold-400',
    border: 'hover:border-gold-600/40',
    glow: 'from-gold-500/10',
    pills: ['Recording', 'Mixing', 'Mastering', 'Live Tracking'],
    description:
      'High-fidelity music recording, mixing, and mastering. A dedicated space for artists and bands to capture their sound with precision.',
  },
  {
    id: 'podcast',
    label: 'Podcast & Broadcast',
    icon: <IconHeadphones />,
    color: 'text-sky-400',
    border: 'hover:border-sky-600/40',
    glow: 'from-sky-500/10',
    pills: ['Podcast', 'Live Stream', 'Multi-Cam', 'ISO Audio'],
    description:
      'Full-service podcast production and live-streamed broadcasts with professional multi-cam direction and isolated audio tracking.',
  },
  {
    id: 'events',
    label: 'Concert & Event Ops',
    icon: <IconStage />,
    color: 'text-violet-400',
    border: 'hover:border-violet-600/40',
    glow: 'from-violet-500/10',
    pills: ['FOH Sound', 'Stage Lighting', 'LED Walls', 'Coordination'],
    description:
      'Full-scale live event coordination — from front-of-house sound to stage lighting and immersive visuals for concerts and corporate events.',
  },
  {
    id: 'video',
    label: 'Visual Storytelling',
    icon: <IconFilm />,
    color: 'text-rose-400',
    border: 'hover:border-rose-600/40',
    glow: 'from-rose-500/10',
    pills: ['Music Videos', 'Commercial', 'Color Grade', 'VFX'],
    description:
      'Cinematic video production, music videos, and commercial content — direction, cinematography, editing, and color grading under one roof.',
  },
]

// ── Card ─────────────────────────────────────────────────────────────────────

function ServiceCard({ svc, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <article
      ref={ref}
      className={`relative flex flex-col bg-zinc-900 border border-zinc-800 p-7 transition-all duration-700 ease-out group ${svc.border} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Per-pillar top glow */}
      <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${svc.glow} to-transparent pointer-events-none opacity-60`} />

      {/* Icon */}
      <div className={`relative mb-5 ${svc.color} transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-[-2px]`}>
        {svc.icon}
      </div>

      {/* Title */}
      <h3
        className={`font-cinzel text-lg font-semibold text-zinc-100 mb-3 transition-colors duration-200 group-hover:${svc.color.replace('text-', 'text-')}`}
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {svc.label}
      </h3>

      {/* Description */}
      <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">{svc.description}</p>

      {/* Capability pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {svc.pills.map(p => (
          <span
            key={p}
            className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-400 tracking-wide border border-zinc-700/50"
          >
            {p}
          </span>
        ))}
      </div>

      {/* Learn More link */}
      {ROUTE_MAP[svc.id] && (
        <Link
          to={ROUTE_MAP[svc.id]}
          className={`mt-auto inline-flex items-center gap-1.5 text-xs tracking-widest uppercase ${svc.color} opacity-70 hover:opacity-100 transition-opacity duration-200`}
          aria-label={`Learn more about ${svc.label}`}
        >
          Learn More
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Bottom accent on hover */}
      <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${svc.glow.replace('from-', 'via-').replace('/10', '/60')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </article>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-14 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">What We Do</p>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Full-Service Production
          </h2>
          <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="mt-5 text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
            Four disciplines. One creative team. Every project produced end-to-end.
          </p>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-12 text-center">
          <Link
            to="/#contact"
            className="inline-block px-8 py-3 border border-zinc-700 text-zinc-400 text-sm tracking-widest uppercase hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
