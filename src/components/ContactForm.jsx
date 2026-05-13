import { useState } from 'react'
import emailjs from '@emailjs/browser'

const INITIAL = { name: '', email: '', subject: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...form, to_name: 'Fabing Productions' },
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
    <section id="contact" className="py-24 px-6 bg-zinc-900/50">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4">Let's Talk</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-semibold text-zinc-100" style={{ fontFamily: "'Cinzel', serif" }}>
            Contact
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="mt-6 text-zinc-400 text-sm leading-relaxed">
            Ready to bring your vision to life? Tell us about your project.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-16 border border-zinc-800">
            <div className="w-12 h-12 rounded-full border border-gold-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-zinc-300 font-light">Message received. We'll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="Project inquiry, collaboration…"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your project…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 bg-gold-500 text-zinc-950 font-semibold text-sm tracking-widest uppercase hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
