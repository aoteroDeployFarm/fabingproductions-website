export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-cinzel text-sm tracking-widest text-zinc-600" style={{ fontFamily: "'Cinzel', serif" }}>
          FABING PRODUCTIONS
        </span>
        <p className="text-zinc-700 text-xs">
          &copy; {new Date().getFullYear()} Fabing Productions. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
