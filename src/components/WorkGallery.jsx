import { useEffect, useState, useMemo } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useInView } from 'react-intersection-observer'

// ---------------------------------------------------------------------------
// Category config — defines the filter tabs and their display icons
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    id: 'all',
    label: 'All',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          d="M4 6h16M4 12h16M4 18h16" />
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
  },
  {
    id: 'Audio',
    label: 'Audio',
    // Firestore category tag: "Audio"
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'Live Events',
    label: 'Live Events',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          d="M9 3h6l1 5H8L9 3zM8 8L5 21M16 8l3 13" />
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          d="M8 8h8" />
      </svg>
    ),
  },
]

// Category badge accent colours — keyed by Firestore category value
const BADGE_STYLES = {
  Video:        'bg-zinc-950/80 text-gold-400',
  Audio:        'bg-zinc-950/80 text-sky-400',
  'Live Events': 'bg-zinc-950/80 text-violet-400',
}

// Default thumbnail placeholder icon per category
function PlaceholderIcon({ category }) {
  if (category === 'Audio') {
    return (
      <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1"
          d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    )
  }
  if (category === 'Live Events') {
    return (
      <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="1" strokeLinecap="round"
          d="M9 3h6l1 5H8L9 3zM8 8L5 21M16 8l3 13M8 8h8M5 14h14" />
      </svg>
    )
  }
  // Video (default)
  return (
    <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeWidth="1"
        d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Production card
// ---------------------------------------------------------------------------

function ProductionCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden bg-zinc-900 border border-zinc-800/50 transition-all duration-700 ease-out hover:border-zinc-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {item.thumbnailUrl ? (
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

        {/* Play / listen / view overlay */}
        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300"
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
          <span className={`absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1 font-medium ${BADGE_STYLES[item.category] ?? 'bg-zinc-950/80 text-zinc-400'}`}>
            {item.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3
          className="font-cinzel text-base font-semibold text-zinc-100 mb-1 group-hover:text-gold-400 transition-colors duration-200"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {item.year && (
          <p className="text-zinc-700 text-xs mt-3 tracking-wider">{item.year}</p>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function Skeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-zinc-900 animate-pulse">
          <div className="aspect-video bg-zinc-800" />
          <div className="p-5 space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main gallery
// ---------------------------------------------------------------------------

/**
 * Props:
 *   defaultCategory — pre-selected filter tab (default: 'all')
 *   showFilters     — whether to show the filter tab bar (default: true)
 *   sectionTitle    — heading text (default: 'Our Work')
 *   emptyMessage    — custom empty-state copy
 */
export default function WorkGallery({
  defaultCategory = 'all',
  showFilters = true,
  sectionTitle = 'Our Work',
  emptyMessage = 'Productions coming soon.',
}) {
  const [productions, setProductions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(defaultCategory)

  useEffect(() => {
    async function fetchProductions() {
      try {
        const q = query(collection(db, 'productions'), orderBy('year', 'desc'))
        const snapshot = await getDocs(q)
        setProductions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error('Firestore fetch error:', err)
        setError('Could not load productions.')
      } finally {
        setLoading(false)
      }
    }
    fetchProductions()
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return productions
    return productions.filter(p => p.category === activeCategory)
  }, [productions, activeCategory])

  return (
    <section id="work" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Portfolio</p>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {sectionTitle}
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        {/* Category filter tabs — hidden on service detail pages */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-200 ${
                    isActive
                      ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Content states */}
        {loading && <Skeletons />}

        {error && (
          <p className="text-center text-zinc-500 py-12">{error}</p>
        )}

        {!loading && !error && productions.length === 0 && (
          <p className="text-center text-zinc-600 tracking-wider text-sm uppercase py-12">
            {emptyMessage}
          </p>
        )}

        {!loading && !error && productions.length > 0 && filtered.length === 0 && (
          <p className="text-center text-zinc-600 tracking-wider text-sm uppercase py-12">
            {emptyMessage}
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <ProductionCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Firestore schema hint — only visible in dev */}
        {import.meta.env.DEV && productions.length === 0 && !loading && (
          <details className="mt-16 border border-zinc-800 p-6 text-left max-w-2xl mx-auto">
            <summary className="text-xs tracking-widest uppercase text-zinc-600 cursor-pointer hover:text-zinc-400">
              Firestore schema reference (dev only)
            </summary>
            <pre className="mt-4 text-xs text-zinc-500 leading-relaxed overflow-x-auto">{`// Collection: productions
// Required fields:
{
  title:        string,
  category:     "Video" | "Audio" | "Live Events",
  year:         number,
  description:  string,
  thumbnailUrl: string | null,
  externalUrl:  string | null   // video link, SoundCloud, etc.
}`}</pre>
          </details>
        )}
      </div>
    </section>
  )
}
