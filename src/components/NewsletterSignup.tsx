'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white/10 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <p className="font-semibold text-lg">You&apos;re subscribed!</p>
        <p className="text-teal-200 text-sm mt-1">Watch your inbox for the best flexible roles.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-xl transition-colors whitespace-nowrap"
      >
        {loading ? 'Subscribing…' : 'Subscribe free'}
      </button>
    </form>
  )
}
