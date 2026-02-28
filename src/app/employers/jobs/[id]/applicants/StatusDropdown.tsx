'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'] as const

export default function StatusDropdown({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return
    setLoading(true)
    await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={currentStatus}
      onChange={e => updateStatus(e.target.value)}
      disabled={loading}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
      ))}
    </select>
  )
}
