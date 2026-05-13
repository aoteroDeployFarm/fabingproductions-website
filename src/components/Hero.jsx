export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Film-grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Gold radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(245,158,11,0.07)_0%,transparent_70%)] pointer-events-none" />

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-10 bg-black/70" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-black/70" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="text-gold-400 text-xs tracking-[0.5em] uppercase mb-8 font-light">
          Full-Service Production House
        </p>

        {/* Primary headline */}
        <h1
          className="font-cinzel mb-6 leading-none"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="block text-6xl md:text-8xl lg:text-9xl font-semibold text-gold">
            Sound.
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl font-semibold text-zinc-200 mt-1">
            Sight.
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl font-light text-zinc-500 mt-1">
            Stage.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-zinc-400 text-base md:text-lg font-light max-w-2xl mx-auto mt-10 mb-12 leading-relaxed">
          Crafting stories through professional recording, cinematic video,
          and live event production.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="px-8 py-3 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 transition-colors duration-200"
          >
            Our Services
          </a>
          <a
            href="#work"
            className="px-8 py-3 border border-zinc-700 text-zinc-300 font-light text-sm tracking-widest uppercase hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-zinc-700 text-zinc-300 font-light text-sm tracking-widest uppercase hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
          >
            Book a Session
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-zinc-700 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  )
}
