import { useState } from 'react'
import emailjs from '@emailjs/browser'

const INQUIRY_OPTIONS = [
  { value: '', label: 'Select a service…' },
  { value: 'Recording Session', label: 'Recording Session' },
  { value: 'Podcast Production', label: 'Podcast Production' },
  { value: 'Live Event Booking', label: 'Live Event Booking' },
  { value: 'Video Production', label: 'Video Production' },
  { value: 'Other', label: 'Other / General Inquiry' },
]

const INITIAL = { name: '', email: '', purpose: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.purpose) return // guard — select is required
    setStatus('sending')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          purpose: form.purpose,
          message: form.message,
          to_name: 'Fabing Productions',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setStatus('success')
      setForm(INITIAL)
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-gold-500 transition-colors duration-200'

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Get in Touch</p>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Book a Session
          </h2>
          <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="mt-5 text-zinc-400 text-sm leading-relaxed">
            Tell us what you need and we'll get back to you within one business day.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-20 border border-zinc-800">
            <div className="w-12 h-12 rounded-full border border-gold-500 flex items-center justify-center mx-auto mb-5">
              <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-zinc-200 font-light text-base mb-1">Message received.</p>
            <p className="text-zinc-500 text-sm">We'll be in touch within one business day.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                  Name <span className="text-gold-600">*</span>
                </label>
                <input
                  id="name" name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                  Email <span className="text-gold-600">*</span>
                </label>
                <input
                  id="email" name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Purpose of Inquiry dropdown */}
            <div>
              <label htmlFor="purpose" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                Purpose of Inquiry <span className="text-gold-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="purpose" name="purpose" required
                  value={form.purpose} onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer ${!form.purpose ? 'text-zinc-600' : 'text-zinc-100'}`}
                >
                  {INQUIRY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Chevron */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                Message <span className="text-gold-600">*</span>
              </label>
              <textarea
                id="message" name="message" required rows={5}
                value={form.message} onChange={handleChange}
                placeholder="Tell us about your project, timeline, and any specific requirements…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center py-1">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !form.purpose}
              className="w-full py-4 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            <p className="text-zinc-700 text-xs text-center">
              Fields marked <span className="text-gold-600">*</span> are required.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
