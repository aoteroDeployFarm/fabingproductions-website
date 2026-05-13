import { useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useInView } from 'react-intersection-observer'

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Work',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'Video',
    label: 'Video',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          d="M16 10l5-3v10l-5-3v-4z" />
      </svg>
    ),
    accent: 'text-gold-400',
    activeBorder: 'border-gold-500',
    activeBg: 'bg-gold-500/5',
  },
  {
    id: 'Audio',
    label: 'Audio',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    accent: 'text-sky-400',
    activeBorder: 'border-sky-500',
    activeBg: 'bg-sky-500/5',
  },
  {
    id: 'Live Events',
    label: 'Live Events',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          d="M9 3h6l1 5H8L9 3zM8 8L5 21M16 8l3 13" />
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 8h8" />
      </svg>
    ),
    accent: 'text-violet-400',
    activeBorder: 'border-violet-500',
    activeBg: 'bg-violet-500/5',
  },
]

const BADGE_STYLES = {
  Video:       'text-gold-400   bg-zinc-950/80',
  Audio:       'text-sky-400    bg-zinc-950/80',
  'Live Events': 'text-violet-400 bg-zinc-950/80',
}

// ── Masonry card ──────────────────────────────────────────────────────────────

function MasonryCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  // Vary card height for masonry effect — tall every 3rd card starting at index 1
  const isTall = index % 3 === 1

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-700 ease-out ${
        isTall ? 'row-span-2' : ''
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-zinc-800 ${isTall ? 'aspect-[3/4]' : 'aspect-video'}`}>
        {item.thumbnailUrl && item.thumbnailUrl.trim() !== '' ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaceholderIcon category={item.category} />
          </div>
        )}

        {/* Play overlay */}
        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-300"
            aria-label={`Open ${item.title}`}
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        )}

        {/* Category badge */}
        {item.category && (
          <span className={`absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1 font-medium ${BADGE_STYLES[item.category] ?? 'text-zinc-400 bg-zinc-950/80'}`}>
            {item.category}
          </span>
        )}

        {/* Year badge */}
        {item.year && (
          <span className="absolute top-3 right-3 text-xs text-zinc-500 tabular-nums bg-zinc-950/80 px-2 py-1">
            {item.year}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-cinzel text-sm font-semibold text-zinc-100 mb-1 group-hover:text-gold-400 transition-colors duration-200"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
        )}
      </div>

      {/* Gold underline on hover */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}

function PlaceholderIcon({ category }) {
  if (category === 'Audio') {
    return (
      <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1" d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    )
  }
  if (category === 'Live Events') {
    return (
      <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" d="M9 3h6l1 5H8L9 3zM8 8L5 21M16 8l3 13M8 8h8M5 14h14" />
      </svg>
    )
  }
  return (
    <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
    </svg>
  )
}

function Skeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`bg-zinc-900 animate-pulse ${i % 3 === 1 ? 'row-span-2' : ''}`}>
          <div className={`bg-zinc-800 ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-video'}`} />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const [productions, setProductions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(collection(db, 'productions'), orderBy('year', 'desc'))
        const snap = await getDocs(q)
        setProductions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error(
          '[WorkPage] Firestore fetch failed',
          '\n  code   :', err.code    ?? 'n/a',
          '\n  message:', err.message ?? String(err),
          '\n  hint   : VITE_USE_EMULATOR =', import.meta.env.VITE_USE_EMULATOR,
        )
        setError(`Could not load portfolio. (${err.code ?? 'unknown'})`)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return productions
    return productions.filter(p => p.category === activeCategory)
  }, [productions, activeCategory])

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)

  return (
    <>
      <Helmet>
        <title>Portfolio | Fabing Productions</title>
        <meta
          name="description"
          content="Browse the Fabing Productions portfolio — music videos, recording sessions, podcast productions, and live event coverage across Audio, Video, and Live Events."
        />
        <meta property="og:title" content="Portfolio | Fabing Productions" />
        <meta property="og:description" content="Browse our full portfolio: recording, video, podcast, and live events." />
      </Helmet>

      {/* ── Hero bar ── */}
      <section className="relative pt-32 pb-16 px-6 bg-zinc-950 border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-6 text-xs tracking-widest uppercase text-zinc-600">
            <Link to="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold-400">Portfolio</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Portfolio</p>
              <h1
                className="font-cinzel text-5xl md:text-6xl font-semibold text-zinc-100"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Our Work
              </h1>
            </div>
            {!loading && (
              <p className="text-zinc-600 text-sm tabular-nums">
                {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
                {activeCategory !== 'all' && ` in ${activeCategory}`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-16 z-30 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-3 overflow-x-auto" role="tablist" aria-label="Filter portfolio by category">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              const borderClass = isActive ? (cat.activeBorder ?? 'border-gold-500') : 'border-transparent'
              const bgClass    = isActive ? (cat.activeBg    ?? 'bg-gold-500/5')     : ''
              const textClass  = isActive ? (cat.accent      ?? 'text-gold-400')     : 'text-zinc-500 hover:text-zinc-300'
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase border-b-2 whitespace-nowrap transition-all duration-200 ${borderClass} ${bgClass} ${textClass}`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="py-12 px-6 bg-zinc-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {loading && <Skeletons />}

          {error && (
            <div className="py-24 text-center">
              <p className="text-zinc-500 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-zinc-700 text-xs tracking-widest uppercase">
                {activeCategory === 'all'
                  ? 'Portfolio coming soon.'
                  : `No ${activeCategory} projects yet — check back soon.`}
              </p>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-4 text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-4"
                >
                  View all work
                </button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto" style={{ gridAutoRows: '1fr' }}>
              {filtered.map((item, i) => (
                <MasonryCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Dev schema hint */}
          {import.meta.env.DEV && !loading && productions.length === 0 && (
            <details className="mt-16 border border-zinc-800 p-6 text-left max-w-xl mx-auto">
              <summary className="text-xs tracking-widest uppercase text-zinc-600 cursor-pointer hover:text-zinc-400">
                Firestore schema (dev only)
              </summary>
              <pre className="mt-4 text-xs text-zinc-500 leading-relaxed overflow-x-auto">{`// Collection: productions
{
  title:        string,
  category:     "Video" | "Audio" | "Live Events",
  year:         number,
  description:  string,
  thumbnailUrl: string | null,
  externalUrl:  string | null
}`}</pre>
            </details>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-zinc-900/40 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-500 text-sm mb-4">Want to be in the next project?</p>
          <Link
            to="/book"
            className="inline-block px-10 py-4 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
          >
            Book a Session
          </Link>
        </div>
      </section>
    </>
  )
}
