import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SERVICE_ROUTES } from '../data/services'

// ── Services dropdown (desktop) ───────────────────────────────────────────────

function ServicesDropdown({ open, onClose }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-zinc-900 border border-zinc-800 shadow-2xl transition-all duration-200 origin-top ${
        open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
      }`}
      role="menu"
    >
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-zinc-900 border-l border-t border-zinc-800" />
      <div className="py-1.5 relative">
        {SERVICE_ROUTES.map(svc => (
          <NavLink
            key={svc.id}
            to={svc.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest uppercase transition-colors duration-150 ${
                isActive
                  ? 'text-gold-400 bg-zinc-800/60'
                  : 'text-zinc-400 hover:text-gold-400 hover:bg-zinc-800/40'
              }`
            }
            role="menuitem"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
            {svc.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

// ── Mobile menu ───────────────────────────────────────────────────────────────

function MobileMenu({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    onClose()
    setServicesOpen(false)
  }, [pathname]) // eslint-disable-line

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-down panel */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 bg-zinc-950 border-b border-zinc-800 transition-transform duration-300 ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Logo row inside panel */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800/60">
          <Link to="/" onClick={onClose} className="font-cinzel text-sm font-semibold tracking-widest text-gold" style={{ fontFamily: "'Cinzel', serif" }}>
            FABING<span className="text-zinc-500 font-light"> PRODUCTIONS</span>
          </Link>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 p-1 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-1">
          {/* Services group */}
          <div>
            <button
              onClick={() => setServicesOpen(o => !o)}
              className="w-full flex items-center justify-between py-3 text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-expanded={servicesOpen}
            >
              Services
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${servicesOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pl-4 pb-2 space-y-0.5 border-l border-zinc-800 ml-1">
                {SERVICE_ROUTES.map(svc => (
                  <NavLink
                    key={svc.id}
                    to={svc.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block py-2 text-xs tracking-widest uppercase transition-colors ${
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

          {/* Studio / Work */}
          {[
            { to: '/studio', label: 'Studio' },
            { to: '/work',   label: 'Work' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `block py-3 text-xs tracking-widest uppercase transition-colors border-t border-zinc-800/40 ${
                  isActive ? 'text-gold-400' : 'text-zinc-400 hover:text-zinc-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Book CTA */}
          <div className="pt-4 border-t border-zinc-800/40">
            <Link
              to="/book"
              onClick={onClose}
              className="block w-full text-center py-3 border border-gold-500/60 text-gold-400 text-xs tracking-widest uppercase hover:bg-gold-500/10 transition-colors duration-200"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled,     setScrolled]   = useState(false)
  const [dropdownOpen, setDropdown]   = useState(false)
  const [mobileOpen,   setMobile]     = useState(false)
  const dropdownRef                   = useRef(null)
  const dropdownTimer                 = useRef(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    function h(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function openDropdown()  { clearTimeout(dropdownTimer.current); setDropdown(true)  }
  function closeDropdown() { dropdownTimer.current = setTimeout(() => setDropdown(false), 180) }

  const navLinkClass = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition-colors duration-200 ${
      isActive ? 'text-gold-400' : 'text-zinc-400 hover:text-zinc-100'
    }`

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-zinc-950/92 backdrop-blur-md border-b border-zinc-800' : ''
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="font-cinzel text-base font-semibold tracking-widest flex-shrink-0 text-gold"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            FABING<span className="text-zinc-500 font-light"> PRODUCTIONS</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7 ml-auto">
            {/* Services dropdown */}
            <li
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                onClick={() => setDropdown(o => !o)}
                onFocus={openDropdown}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-1 text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
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

            {/* Studio */}
            <li>
              <NavLink to="/studio" className={navLinkClass}>Studio</NavLink>
            </li>

            {/* Work */}
            <li>
              <NavLink to="/work" className={navLinkClass}>Work</NavLink>
            </li>

            {/* Book — distinct CTA outlined ring */}
            <li>
              <NavLink
                to="/book"
                className={({ isActive }) =>
                  `text-xs tracking-widest uppercase px-4 py-1.5 border transition-colors duration-200 ${
                    isActive
                      ? 'border-gold-400 text-gold-400 bg-gold-500/10'
                      : 'border-zinc-600 text-zinc-300 hover:border-gold-400 hover:text-gold-400'
                  }`
                }
              >
                Book
              </NavLink>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors ml-auto"
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
