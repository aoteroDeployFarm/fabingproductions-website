import { useRef, useState, useEffect, useCallback } from 'react'

// ── Utility ──────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ── Waveform visualiser (static decorative bars, no canvas needed) ────────────

function WaveformBars({ progress }) {
  const BARS = 48
  // Pre-computed pseudo-random heights so the visual is stable across renders
  const heights = Array.from({ length: BARS }, (_, i) => {
    const v = Math.sin(i * 1.7 + 0.5) * 0.4 + Math.sin(i * 0.9 + 1.2) * 0.35 + 0.25
    return Math.max(0.08, Math.min(1, Math.abs(v)))
  })

  return (
    <div className="flex items-center gap-[2px] h-10 flex-1 mx-3" aria-hidden="true">
      {heights.map((h, i) => {
        const pct = (i / BARS) * 100
        const played = pct <= progress
        return (
          <div
            key={i}
            className={`flex-1 rounded-[1px] transition-colors duration-150 ${
              played ? 'bg-gold-400' : 'bg-zinc-700'
            }`}
            style={{ height: `${h * 100}%` }}
          />
        )
      })}
    </div>
  )
}

// ── Single track player ───────────────────────────────────────────────────────

function Track({ track, isActive, onActivate }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)    // 0–100
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  // When another track becomes active, pause this one
  useEffect(() => {
    if (!isActive && playing) {
      audioRef.current?.pause()
      setPlaying(false)
    }
  }, [isActive, playing])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    onActivate()
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }, [playing, onActivate])

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio) return
    setCurrent(audio.currentTime)
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current?.duration ?? 0)
  }

  function handleEnded() {
    setPlaying(false)
    setProgress(0)
    setCurrent(0)
  }

  function handleScrub(e) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
    setProgress(ratio * 100)
  }

  return (
    <div className="group flex flex-col gap-3 p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors duration-200">
      {/* Row 1: play button + track info */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:border-gold-500 hover:text-gold-400 transition-colors duration-200"
        >
          {playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-zinc-100 text-sm font-medium truncate">{track.title}</p>
          <p className="text-zinc-600 text-xs tracking-wider truncate">{track.artist}</p>
        </div>

        <span className="text-zinc-600 text-xs tabular-nums flex-shrink-0">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>

      {/* Row 2: scrubber + waveform */}
      <div
        className="relative cursor-pointer select-none"
        onClick={handleScrub}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`Seek ${track.title}`}
        tabIndex={0}
        onKeyDown={e => {
          const audio = audioRef.current
          if (!audio) return
          if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
          if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5)
        }}
      >
        <WaveformBars progress={progress} />
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

/**
 * AudioPlayer
 * Props:
 *   tracks — array of { id, title, artist, src }
 *             src can be a URL or an imported asset path.
 *             Set src to null/'' to render a placeholder (no audio element).
 */
export default function AudioPlayer({ tracks = [] }) {
  const [activeId, setActiveId] = useState(null)

  if (tracks.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-600 text-sm tracking-wider border border-zinc-800">
        Audio samples coming soon.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tracks.map(track => (
        <Track
          key={track.id}
          track={track}
          isActive={activeId === track.id}
          onActivate={() => setActiveId(track.id)}
        />
      ))}
    </div>
  )
}
