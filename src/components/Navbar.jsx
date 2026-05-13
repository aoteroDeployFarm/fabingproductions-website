import { useState, useEffect } from 'react'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#studio',   label: 'Studio' },
  { href: '#work',     label: 'Work' },
  { href: '#contact',  label: 'Book' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-cinzel text-lg font-semibold tracking-widest text-gold">
          FABING<span className="text-zinc-400 font-light"> PRODUCTIONS</span>
        </a>
        <ul className="flex gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm tracking-wider uppercase text-zinc-400 hover:text-gold-400 transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
