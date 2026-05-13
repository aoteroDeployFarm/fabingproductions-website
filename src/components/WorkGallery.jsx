import { useEffect, useState } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useInView } from 'react-intersection-observer'

function ProductionCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden bg-zinc-900 transition-all duration-700 ease-out ${
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
            <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="1"
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
              />
            </svg>
          </div>
        )}

        {/* Play overlay */}
        {item.videoUrl && (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300"
            aria-label={`Watch ${item.title}`}
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        )}

        {/* Category badge */}
        {item.category && (
          <span className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1 bg-zinc-950/80 text-gold-400 font-medium">
            {item.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-cinzel text-base font-semibold text-zinc-100 mb-1 group-hover:text-gold-400 transition-colors duration-200" style={{ fontFamily: "'Cinzel', serif" }}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {item.year && (
          <p className="text-zinc-700 text-xs mt-3 tracking-wider">{item.year}</p>
        )}
      </div>

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}

export default function WorkGallery() {
  const [productions, setProductions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <section id="work" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Portfolio</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
            Our Work
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 animate-pulse aspect-video" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-zinc-500">{error}</p>
        )}

        {!loading && !error && productions.length === 0 && (
          <p className="text-center text-zinc-600 tracking-wider text-sm uppercase">
            Productions coming soon.
          </p>
        )}

        {!loading && !error && productions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productions.map((item, i) => (
              <ProductionCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
