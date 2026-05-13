import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import AudioPlayer from '../components/AudioPlayer'

// ── Data ──────────────────────────────────────────────────────────────────────

const DEMO_TRACKS = [
  { id: 'mix-1', title: 'Full Band Mix — Room A',          artist: 'Fabing Productions', src: '' },
  { id: 'mix-2', title: 'Acoustic Session — Vocal + Guitar', artist: 'Fabing Productions', src: '' },
  { id: 'mix-3', title: 'Mastered Single — Radio Edit',     artist: 'Fabing Productions', src: '' },
]

const FACILITY_FEATURES = [
  {
    title: 'Isolation Booths',
    desc: 'Acoustically treated rooms for drum tracking, vocal overdubs, and live instrument isolation — designed for minimal bleed and maximum vibe.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          d="M9 3a3 3 0 000 6h6a3 3 0 000-6H9zM3 10h18M9 14h6M12 14v7" />
      </svg>
    ),
  },
  {
    title: 'Control Room',
    desc: 'Flat-response monitoring environment with a calibrated mix position, industry-standard console, and outboard signal chain for critical listening.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
  {
    title: 'Hosted Events',
    desc: 'Private listening sessions, label showcases, record release parties, and small live performances in an intimate, professionally controlled environment.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Video-Ready',
    desc: 'Integrated camera positions, stage lighting rigs, and broadcast-grade cabling for live session recordings, EPKs, and content capture.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: 'Green Room',
    desc: 'Comfortable artist lounge adjacent to the tracking floor — couch, monitor, Wi-Fi, and a coffee setup so the session never stalls between takes.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke="currentColor" strokeWidth="1.4" d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    title: 'Load-In Access',
    desc: 'Street-level dock access for backline, drum kits, and production gear. No stairs, no freight elevators — straight onto the floor.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z" />
        <circle cx="7" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="17" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
]

const GEAR_SECTIONS = [
  {
    category: 'Mic Locker',
    color: 'text-gold-400',
    items: [
      { name: 'Neumann U87 Ai',    use: 'Vocals, acoustic instruments' },
      { name: 'AKG C414 XLII',     use: 'Overheads, room, strings' },
      { name: 'Shure SM7B',        use: 'Vocals, voice-over, broadcast' },
      { name: 'Sennheiser MD 421', use: 'Toms, guitar cab, brass' },
      { name: 'Shure Beta 52A',    use: 'Kick drum, bass cab' },
      { name: 'Royer R-121',       use: 'Ribbon for guitar cab and amp' },
      { name: 'Telefunken M80',    use: 'Live vocals and dynamic tracking' },
      { name: 'DPA 4006A',         use: 'Stereo room and ensemble capture' },
    ],
  },
  {
    category: 'Preamps & Outboard',
    color: 'text-sky-400',
    items: [
      { name: 'API 3124+',              use: '4-channel discrete transistor' },
      { name: 'Universal Audio 610',    use: 'Tube preamp — warmth and color' },
      { name: 'Neve 1073 (clone)',       use: 'Classic British transformer sound' },
      { name: 'SSL G-Bus Compressor',   use: 'Mix bus glue and punch' },
      { name: 'Empirical Labs Distressor', use: 'Versatile track compression' },
      { name: 'Avalon VT-737sp',        use: 'Tube channel strip for vocals' },
    ],
  },
  {
    category: 'DAW & Interfaces',
    color: 'text-violet-400',
    items: [
      { name: 'Pro Tools HDX',             use: 'Primary DAW and playback' },
      { name: 'Logic Pro X',               use: 'MIDI production and scoring' },
      { name: 'Universal Audio Apollo X16', use: '16-channel thunderbolt interface' },
      { name: 'Antelope Orion32+',         use: 'Expanded I/O and conversion' },
      { name: 'Avid MTRX Studio',          use: 'Monitoring and patching hub' },
    ],
  },
  {
    category: 'Monitoring',
    color: 'text-rose-400',
    items: [
      { name: 'Yamaha NS10M',      use: 'Near-field mix reference' },
      { name: 'Adam Audio S3V',    use: 'Wide-sweet-spot studio monitors' },
      { name: 'Avantone MixCubes', use: 'Consumer simulation check' },
      { name: 'Sonarworks SoundID', use: 'Room correction calibration' },
      { name: 'Beyerdynamic DT 1990', use: 'Reference headphone monitoring' },
    ],
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function FacilityCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <div
      ref={ref}
      className={`flex gap-4 p-5 bg-zinc-900 border border-zinc-800 group hover:border-zinc-700 transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="flex-shrink-0 w-10 h-10 border border-zinc-700 flex items-center justify-center text-gold-400 group-hover:border-gold-600/50 transition-colors duration-200">
        {item.icon}
      </div>
      <div>
        <h3 className="text-zinc-100 text-sm font-semibold mb-1">{item.title}</h3>
        <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

function GearRow({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-0 transition-all duration-500 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <span className="text-zinc-200 text-sm">{item.name}</span>
      <span className="text-zinc-600 text-xs tracking-wide text-right ml-4">{item.use}</span>
    </div>
  )
}

function GearCategory({ section, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs tracking-widest uppercase font-medium ${section.color}`}>{section.category}</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div>
        {section.items.map((item, i) => (
          <GearRow key={item.name} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudioFullPage() {
  const { ref: heroRef, inView: heroIn } = useInView({ triggerOnce: true })

  return (
    <>
      <Helmet>
        <title>Recording Studio & Facility | Fabing Productions</title>
        <meta
          name="description"
          content="Tour the Fabing Productions recording facility — isolation booths, a curated mic locker, reference control room, and a venue space for hosted events and showcases."
        />
        <meta property="og:title" content="Recording Studio & Facility | Fabing Productions" />
        <meta property="og:description" content="Professional recording studio with isolation booths, top-tier gear, and hosted event capabilities." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden bg-zinc-950 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-8 bg-black/60" />

        <div
          ref={heroRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 pb-16 transition-all duration-1000 ${heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <nav className="flex items-center gap-2 mb-8 text-xs tracking-widest uppercase text-zinc-600">
            <Link to="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold-400">The Studio</span>
          </nav>

          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">The Facility</p>
          <h1
            className="font-cinzel text-5xl md:text-7xl font-semibold leading-none mb-6"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span className="text-gold block">The</span>
            <span className="text-zinc-100 block">Studio.</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light max-w-xl leading-relaxed mb-10">
            A professional recording environment built for artists and bands — with the
            infrastructure to host events, live broadcasts, and cinematic shoots.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/book?purpose=Recording+Session"
              className="px-8 py-3 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
            >
              Book a Session
            </Link>
            <a
              href="#gear"
              className="px-8 py-3 border border-zinc-700 text-zinc-300 text-sm tracking-widest uppercase hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
            >
              View Gear List
            </a>
          </div>
        </div>
      </section>

      {/* ── Facility features ── */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">What's Inside</p>
            <h2 className="font-cinzel text-3xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
              Facility Overview
            </h2>
            <div className="mt-4 w-12 h-px bg-gradient-to-r from-gold-500 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACILITY_FEATURES.map((item, i) => (
              <FacilityCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Audio player ── */}
      <section className="py-20 px-6 bg-zinc-900/40 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Listen</p>
              <h2 className="font-cinzel text-3xl font-semibold text-zinc-100 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Studio Samples
              </h2>
              <div className="w-12 h-px bg-gradient-to-r from-gold-500 to-transparent mb-6" />
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                These tracks were tracked, mixed, and mastered entirely in-house.
                Add your audio files to the track slots below to showcase work here.
              </p>
              <Link
                to="/book?purpose=Recording+Session"
                className="inline-block px-7 py-3 bg-gold-500 text-zinc-950 font-semibold text-xs tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
              >
                Book Studio Time
              </Link>
            </div>
            <div>
              <AudioPlayer tracks={DEMO_TRACKS} />
              <p className="mt-4 text-zinc-700 text-xs text-center tracking-wide">
                All recordings produced at Fabing Productions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gear list ── */}
      <section id="gear" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">The Spec</p>
            <h2 className="font-cinzel text-3xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
              Full Gear List
            </h2>
            <div className="mt-4 w-12 h-px bg-gradient-to-r from-gold-500 to-transparent mb-2" />
            <p className="text-zinc-600 text-sm mt-4">
              Our full equipment inventory — updated as the locker grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {GEAR_SECTIONS.map((section, i) => (
              <GearCategory key={section.category} section={section} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-zinc-900/40 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Ready?</p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-zinc-100 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Let's Make Something Great
          </h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Studio time fills up fast. Reach out to check availability and lock in your dates.
          </p>
          <Link
            to="/book?purpose=Recording+Session"
            className="inline-block px-10 py-4 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
          >
            Book Studio Time
          </Link>
        </div>
      </section>
    </>
  )
}
