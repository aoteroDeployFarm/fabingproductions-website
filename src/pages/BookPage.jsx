import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import ContactForm from '../components/ContactForm'

// ── Consultation process data ──────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Submit Your Inquiry',
    desc: 'Fill out the form below — select your service, describe the project, and share any reference material or deadline. We read every submission the same day.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Free Consultation Call',
    desc: 'Within one business day, we\'ll set up a 20-minute call to align on vision, timeline, budget, and deliverables — no commitment required on your end.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M3 12h12" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Proposal & Scheduling',
    desc: 'We send a detailed production proposal — scope, pricing, and a suggested schedule. Once approved, you\'re locked in and we start pre-production.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Production Begins',
    desc: 'Your dedicated engineer or director leads the project from the first session through final delivery — with milestone check-ins so you\'re never in the dark.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
]

const SERVICE_CARDS = [
  {
    label: 'Recording Session',
    href: '/book?purpose=Recording+Session',
    desc: 'Music recording, mixing & mastering.',
    color: 'text-gold-400',
    border: 'hover:border-gold-600/40',
  },
  {
    label: 'Podcast Production',
    href: '/book?purpose=Podcast+Production',
    desc: 'Multi-cam podcast & live broadcast.',
    color: 'text-sky-400',
    border: 'hover:border-sky-600/40',
  },
  {
    label: 'Live Event Booking',
    href: '/book?purpose=Live+Event+Booking',
    desc: 'Concert sound, lighting & coordination.',
    color: 'text-violet-400',
    border: 'hover:border-violet-600/40',
  },
  {
    label: 'Video Production',
    href: '/book?purpose=Video+Production',
    desc: 'Music videos, commercial & cinematic.',
    color: 'text-rose-400',
    border: 'hover:border-rose-600/40',
  },
]

// ── Components ────────────────────────────────────────────────────────────────

function ProcessStep({ step, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const isLast = index === PROCESS_STEPS.length - 1
  return (
    <div
      ref={ref}
      className={`relative flex gap-5 transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
      }`}
      style={{ transitionDelay: `${index * 110}ms` }}
    >
      {/* Left: number + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-gold-400 bg-zinc-950 relative z-10">
          {step.icon}
        </div>
        {!isLast && <div className="flex-1 w-px bg-zinc-800 my-1 min-h-[32px]" />}
      </div>

      {/* Right: content */}
      <div className={`pb-8 ${isLast ? '' : ''}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-cinzel text-xs text-zinc-700 tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
            {step.number}
          </span>
          <h3 className="text-zinc-100 text-sm font-semibold">{step.title}</h3>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </div>
  )
}

function ServiceQuickLink({ card, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <Link
      ref={ref}
      to={card.href}
      className={`group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 ${card.border} transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div>
        <p className={`text-xs tracking-widest uppercase font-medium mb-1 ${card.color}`}>{card.label}</p>
        <p className="text-zinc-500 text-xs">{card.desc}</p>
      </div>
      <svg className="w-4 h-4 text-zinc-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookPage() {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <>
      <Helmet>
        <title>Book a Session | Fabing Productions</title>
        <meta
          name="description"
          content="Book a recording session, podcast production, live event, or video shoot with Fabing Productions. Free consultation — get a response within one business day."
        />
        <meta property="og:title" content="Book a Session | Fabing Productions" />
        <meta property="og:description" content="Start your project with a free consultation. Recording, podcast, live events, and video production." />
      </Helmet>

      {/* ── Page hero ── */}
      <section className="relative pt-32 pb-12 px-6 bg-zinc-950 border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-6 text-xs tracking-widest uppercase text-zinc-600">
            <Link to="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold-400">Book</span>
          </nav>
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Get Started</p>
          <h1
            className="font-cinzel text-5xl md:text-6xl font-semibold text-zinc-100 mb-4 leading-none"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Book a Session
          </h1>
          <p className="text-zinc-400 text-base font-light max-w-xl leading-relaxed">
            Free consultation. One-business-day response. No commitment required until you approve the proposal.
          </p>
        </div>
      </section>

      {/* ── Quick service links ── */}
      <section className="py-10 px-6 bg-zinc-900/30 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">Jump to a service</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SERVICE_CARDS.map((card, i) => (
              <ServiceQuickLink key={card.label} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content: Process + Form ── */}
      <section className="py-16 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — consultation process */}
            <div
              ref={ref}
              className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">How It Works</p>
              <h2 className="font-cinzel text-3xl font-semibold text-zinc-100 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                From Inquiry<br />to Production
              </h2>
              <div className="mt-4 mb-8 w-12 h-px bg-gradient-to-r from-gold-500 to-transparent" />

              <div>
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStep key={step.number} step={step} index={i} />
                ))}
              </div>

              {/* Trust signals */}
              <div className="mt-2 pt-8 border-t border-zinc-800/60 grid grid-cols-3 gap-4 text-center">
                {[
                  { stat: '< 24h', label: 'Response time' },
                  { stat: 'Free',  label: 'Consultation' },
                  { stat: '100%',  label: 'In-house team' },
                ].map(({ stat, label }) => (
                  <div key={label}>
                    <p className="font-cinzel text-xl font-semibold text-gold-400" style={{ fontFamily: "'Cinzel', serif" }}>{stat}</p>
                    <p className="text-zinc-600 text-xs tracking-wide mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — contact form (no wrapper section padding) */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-zinc-900 border border-zinc-800 p-8">
                <ContactForm embedded />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
