import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import WorkGallery from './WorkGallery'

// ── Hero ──────────────────────────────────────────────────────────────────────

function ServiceHero({ hero, accent }) {
  const lines = hero.headline.split('\n')
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-950 pt-20">
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(0,0,0,0)_0%,transparent_100%)] pointer-events-none`} />
      <div className="absolute top-0 inset-x-0 h-8 bg-black/60" />
      <div className="absolute bottom-0 inset-x-0 h-8 bg-black/60" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 mb-8 text-xs tracking-widest uppercase text-zinc-600">
          <Link to="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <span>/</span>
          <span className={accent.text}>Services</span>
          <span>/</span>
          <span className="text-zinc-400">{hero.eyebrow}</span>
        </nav>

        <p className={`${accent.text} text-xs tracking-[0.4em] uppercase mb-5 font-light`}>
          {hero.eyebrow}
        </p>

        <h1
          className="font-cinzel text-5xl md:text-7xl font-semibold leading-none mb-8"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              className={`block ${i === 0 ? 'text-gold' : 'text-zinc-200'}`}
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="text-zinc-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
          {hero.sub}
        </p>
      </div>
    </section>
  )
}

// ── Gear & Tech specs ─────────────────────────────────────────────────────────

function SpecGroup({ group, items, index, accent }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h4 className={`text-xs tracking-widest uppercase font-medium mb-3 ${accent.text}`}>
        {group}
      </h4>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex items-center gap-3 text-sm text-zinc-400">
            <span className={`w-3 h-px flex-shrink-0 bg-current opacity-50 ${accent.text}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GearSection({ specs, accent }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <section className="py-20 px-6 bg-zinc-900/40 border-y border-zinc-800/50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className={`${accent.text} text-xs tracking-[0.4em] uppercase mb-3`}>The Spec</p>
          <h2 className="font-cinzel text-3xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
            Gear & Technology
          </h2>
          <div className={`mt-4 w-12 h-px bg-gradient-to-r from-current to-transparent ${accent.text} opacity-60`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {specs.map((spec, i) => (
            <SpecGroup key={spec.group} group={spec.group} items={spec.items} index={i} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Process steps ─────────────────────────────────────────────────────────────

function ProcessStep({ step, title, desc, index, accent }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`relative flex gap-6 transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Step number */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <span className={`font-cinzel text-4xl font-semibold ${accent.text} opacity-30`} style={{ fontFamily: "'Cinzel', serif" }}>
          {step}
        </span>
        {index < 2 && <div className="flex-1 w-px bg-zinc-800 mt-2 min-h-[40px]" />}
      </div>
      <div className="pb-10">
        <h3 className="text-zinc-100 font-semibold text-base mb-2">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ProcessSection({ process, accent }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <section className="py-20 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className={`${accent.text} text-xs tracking-[0.4em] uppercase mb-3`}>How It Works</p>
          <h2 className="font-cinzel text-3xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
            The Process
          </h2>
          <div className={`mt-4 w-12 h-px bg-gradient-to-r from-current to-transparent ${accent.text} opacity-60`} />
        </div>

        <div className="max-w-2xl">
          {process.map((step, i) => (
            <ProcessStep key={step.step} {...step} index={i} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Contextual CTA ────────────────────────────────────────────────────────────

function BookCTA({ label, purpose, accent }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <section className="py-20 px-6 bg-zinc-900/30 border-t border-zinc-800/50">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <p className={`${accent.text} text-xs tracking-[0.4em] uppercase mb-4`}>Ready to Start?</p>
        <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-zinc-100 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          Let's Make It Happen
        </h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-xl mx-auto">
          Tell us about your project and we'll get back to you within one business day.
        </p>
        <Link
          to={`/?purpose=${encodeURIComponent(purpose)}#contact`}
          className="inline-block px-10 py-4 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
        >
          Book Now — {label}
        </Link>
        <p className="mt-4 text-zinc-700 text-xs">No commitment required. Free consultation.</p>
      </div>
    </section>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

export default function ServiceDetail({ config }) {
  const { seo, hero, accent, category, contactPurpose, specs, process } = config

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </Helmet>

      <ServiceHero hero={hero} accent={accent} />
      <GearSection specs={specs} accent={accent} />
      <ProcessSection process={process} accent={accent} />

      {/* Filtered portfolio */}
      <WorkGallery
        defaultCategory={category}
        showFilters={false}
        sectionTitle="Related Work"
        emptyMessage="Portfolio items for this service coming soon."
      />

      <BookCTA label={hero.eyebrow} purpose={contactPurpose} accent={accent} />
    </>
  )
}
