const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#studio',   label: 'Studio' },
  { href: '#work',     label: 'Work' },
  { href: '#contact',  label: 'Book a Session' },
]

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <span
              className="font-cinzel text-base font-semibold tracking-widest text-gold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              FABING
              <span className="text-zinc-500 font-light"> PRODUCTIONS</span>
            </span>
            <p className="mt-2 text-zinc-600 text-xs leading-relaxed max-w-xs">
              Sound. Sight. Stage. — Full-service production for recording,
              video, podcast, and live events.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-xs tracking-widest uppercase text-zinc-600 hover:text-gold-400 transition-colors duration-200"
                  >
                    {label}
                  </a>
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
