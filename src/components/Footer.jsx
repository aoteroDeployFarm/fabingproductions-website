import { Link } from 'react-router-dom'
import { SERVICE_ROUTES } from '../data/services'

const MAIN_LINKS = [
  { to: '/#studio',   label: 'Studio' },
  { to: '/#work',     label: 'Work' },
  { to: '/#contact',  label: 'Book a Session' },
]

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-cinzel text-base font-semibold tracking-widest text-gold" style={{ fontFamily: "'Cinzel', serif" }}>
              FABING<span className="text-zinc-500 font-light"> PRODUCTIONS</span>
            </Link>
            <p className="mt-3 text-zinc-600 text-xs leading-relaxed">
              Sound. Sight. Stage. — Full-service production for recording,
              video, podcast, and live events.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services navigation">
            <p className="text-xs tracking-widest uppercase text-zinc-700 mb-3">Services</p>
            <ul className="space-y-2">
              {SERVICE_ROUTES.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-xs tracking-wide text-zinc-600 hover:text-gold-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Site */}
          <nav aria-label="Site navigation">
            <p className="text-xs tracking-widest uppercase text-zinc-700 mb-3">Navigate</p>
            <ul className="space-y-2">
              {MAIN_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-xs tracking-wide text-zinc-600 hover:text-gold-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">
            &copy; {new Date().getFullYear()} Fabing Productions. All rights reserved.
          </p>
          <p className="text-zinc-800 text-xs tracking-widest uppercase">
            Recording Studio · Event Production · Video
          </p>
        </div>
      </div>
    </footer>
  )
}
