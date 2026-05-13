export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Cinematic film-grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-10 bg-black/60" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-black/60" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-6 font-inter font-light">
          Cinematic · Media · Production
        </p>

        <h1
          className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 leading-none text-gold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          FABING
          <br />
          <span className="text-zinc-200 font-light" style={{ fontFamily: "'Cinzel', serif" }}>
            PRODUCTIONS
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed">
          We craft stories that demand attention — from concept through final frame.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#work"
            className="px-8 py-3 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase rounded-none hover:bg-gold-400 transition-colors duration-200"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-zinc-700 text-zinc-300 font-light text-sm tracking-widest uppercase hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-zinc-600 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  )
}
