'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

interface Filters {
  q?: string
  location?: string
  remote?: string
  tag?: string
  hours?: string
  sector?: string
  salaryMax?: string
}

const FLEX_TAGS = [
  { value: 'FOUR_DAY_WEEK', label: '4-Day Week', icon: '📅' },
  { value: 'SCHOOL_HOURS', label: 'School Hours', icon: '🏫' },
  { value: 'TERM_TIME', label: 'Term-Time', icon: '📚' },
  { value: 'JOB_SHARE', label: 'Job Share', icon: '🤝' },
  { value: 'ASYNC', label: 'Async', icon: '💬' },
  { value: 'COMPRESSED_HOURS', label: 'Compressed', icon: '⏰' },
]

const SECTORS = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Operations', 'HR', 'Legal', 'Retail',
]

export default function JobFilters({ current }: { current: Filters }) {
  const router = useRouter()
  const pathname = usePathname()

  const [q, setQ] = useState(current.q ?? '')
  const [location, setLocation] = useState(current.location ?? '')
  const [remote, setRemote] = useState(current.remote === 'true')
  const [tag, setTag] = useState(current.tag ?? '')
  const [hours, setHours] = useState(current.hours ?? '')
  const [sector, setSector] = useState(current.sector ?? '')
  const [salaryMax, setSalaryMax] = useState(current.salaryMax ?? '')

  const apply = useCallback((overrides: Partial<Filters> = {}) => {
    const params: Record<string, string> = {}
    const merged = { q, location, remote: remote ? 'true' : '', tag, hours, sector, salaryMax, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params[k] = v })
    router.push(`${pathname}?${new URLSearchParams(params)}`)
  }, [q, location, remote, tag, hours, sector, salaryMax, router, pathname])

  function clearAll() {
    setQ(''); setLocation(''); setRemote(false); setTag(''); setHours(''); setSector(''); setSalaryMax('')
    router.push(pathname)
  }

  const hasFilters = q || location || remote || tag || hours || sector || salaryMax

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-teal-600 hover:underline">Clear all</button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Keyword</label>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder="Title, skill…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder="City or postcode"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Remote */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={remote}
          onChange={e => { setRemote(e.target.checked); apply({ remote: e.target.checked ? 'true' : '' }) }}
          className="w-4 h-4 text-teal-600 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Remote only</span>
      </label>

      {/* Flexibility */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Flexibility type</label>
        <div className="space-y-1">
          {FLEX_TAGS.map(t => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="radio"
                name="tag"
                value={t.value}
                checked={tag === t.value}
                onChange={() => { setTag(t.value); apply({ tag: t.value }) }}
                className="w-4 h-4 text-teal-600"
              />
              <span className="text-sm text-gray-700">{t.icon} {t.label}</span>
            </label>
          ))}
          {tag && (
            <button onClick={() => { setTag(''); apply({ tag: '' }) }} className="text-xs text-teal-600 hover:underline mt-1">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Hours */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hours</label>
        <select
          value={hours}
          onChange={e => { setHours(e.target.value); apply({ hours: e.target.value }) }}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Any</option>
          <option value="full">Full-time</option>
          <option value="part">Part-time</option>
        </select>
      </div>

      {/* Sector */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sector</label>
        <select
          value={sector}
          onChange={e => { setSector(e.target.value); apply({ sector: e.target.value }) }}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All sectors</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Salary */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Max salary: {salaryMax ? `£${parseInt(salaryMax).toLocaleString()}` : 'Any'}
        </label>
        <input
          type="range"
          min={20000}
          max={200000}
          step={5000}
          value={salaryMax || 200000}
          onChange={e => setSalaryMax(e.target.value === '200000' ? '' : e.target.value)}
          onMouseUp={() => apply()}
          onTouchEnd={() => apply()}
          className="w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>£20k</span>
          <span>£200k+</span>
        </div>
      </div>

      <button
        onClick={() => apply()}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        Apply filters
      </button>
    </div>
  )
}
