import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SERVICE_ROUTES } from '../data/services'

const TOP_LINKS = [
  { to: '/#studio',  label: 'Studio' },
  { to: '/#work',    label: 'Work' },
  { to: '/#contact', label: 'Book' },
]

// ── Services dropdown (desktop) ───────────────────────────────────────────────

function ServicesDropdown({ open, onClose }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-zinc-900 border border-zinc-800 shadow-xl transition-all duration-200 origin-top ${
        open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
      }`}
      role="menu"
    >
      <div className="py-1">
        {SERVICE_ROUTES.map(svc => (
          <NavLink
            key={svc.id}
            to={svc.path}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2.5 text-xs tracking-widest uppercase transition-colors duration-150 ${
                isActive ? 'text-gold-400 bg-zinc-800/60' : 'text-zinc-400 hover:text-gold-400 hover:bg-zinc-800/40'
              }`
            }
            role="menuitem"
          >
            {svc.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

// ── Mobile menu ───────────────────────────────────────────────────────────────

function MobileMenu({ open, onClose }) {
  const [servicesExpanded, setServicesExpanded] = useState(false)

  // Close when route changes
  const { pathname } = useLocation()
  useEffect(() => { onClose(); setServicesExpanded(false) }, [pathname]) // eslint-disable-line

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel — slides in from top */}
      <nav
        className={`relative z-50 bg-zinc-950 border-b border-zinc-800 pt-20 pb-8 px-6 transition-transform duration-300 ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Services expandable group */}
        <div className="border-b border-zinc-800/60 pb-4 mb-4">
          <button
            onClick={() => setServicesExpanded(e => !e)}
            className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase text-zinc-300 hover:text-gold-400 transition-colors duration-150"
            aria-expanded={servicesExpanded}
          >
            Services
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${servicesExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              servicesExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 pt-2 space-y-1 border-l border-zinc-800 ml-2">
              {SERVICE_ROUTES.map(svc => (
                <NavLink
                  key={svc.id}
                  to={svc.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block py-2 text-xs tracking-widest uppercase transition-colors duration-150 ${
                      isActive ? 'text-gold-400' : 'text-zinc-500 hover:text-zinc-200'
                    }`
                  }
                >
                  {svc.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Other links */}
        <div className="space-y-1">
          {TOP_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="block py-2 text-sm tracking-widest uppercase text-zinc-300 hover:text-gold-400 transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [dropdownOpen, setDropdown]   = useState(false)
  const [mobileOpen, setMobile]       = useState(false)
  const dropdownRef                   = useRef(null)
  const dropdownTimer                 = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function openDropdown()  { clearTimeout(dropdownTimer.current); setDropdown(true) }
  function scheduleClose() { dropdownTimer.current = setTimeout(() => setDropdown(false), 180) }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800' : ''
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-cinzel text-base font-semibold tracking-widest text-gold flex-shrink-0" style={{ fontFamily: "'Cinzel', serif" }}>
            FABING<span className="text-zinc-500 font-light"> PRODUCTIONS</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {/* Services with dropdown */}
            <li ref={dropdownRef} className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
              <button
                onClick={() => setDropdown(o => !o)}
                onFocus={openDropdown}
                className="flex items-center gap-1 text-xs tracking-widest uppercase text-zinc-400 hover:text-gold-400 transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Services
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24"
                >
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <ServicesDropdown open={dropdownOpen} onClose={() => setDropdown(false)} />
            </li>

            {TOP_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-xs tracking-widest uppercase text-zinc-400 hover:text-gold-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            onClick={() => setMobile(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobile(false)} />
    </>
  )
}
