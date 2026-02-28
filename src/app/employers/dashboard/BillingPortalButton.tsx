'use client'

import { useState } from 'react'

export default function BillingPortalButton({ label = 'Manage billing' }: { label?: string }) {
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
    >
      {loading ? 'Loading…' : label}
    </button>
  )
}
