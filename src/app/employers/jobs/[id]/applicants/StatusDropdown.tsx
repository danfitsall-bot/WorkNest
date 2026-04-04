'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES: { value: string; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'REJECTED', label: 'Rejected' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  REVIEWED: 'text-blue-700 bg-blue-50 border-blue-200',
  SHORTLISTED: 'text-green-700 bg-green-50 border-green-200',
  REJECTED: 'text-red-600 bg-red-50 border-red-200',
}

export default function StatusDropdown({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: string) {
    if (newStatus === status) return
    setStatus(newStatus)
    setLoading(true)
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    } else {
      // Revert on failure
      setStatus(currentStatus)
    }
  }

  return (
    <select
      value={status}
      onChange={e => updateStatus(e.target.value)}
      disabled={loading}
      className={`text-xs border rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 cursor-pointer transition-colors ${STATUS_COLORS[status] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}
    >
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
