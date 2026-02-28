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
  salaryMin?: string
  returnerFriendly?: string
  contractType?: string
  officeDaysMax?: string
}

const FLEX_TAGS = [
  { value: 'FOUR_DAY_WEEK', label: '4-Day Week', icon: '📅' },
  { value: 'SCHOOL_HOURS', label: 'School Hours', icon: '🏫' },
  { value: 'TERM_TIME', label: 'Term-Time', icon: '📚' },
  { value: 'JOB_SHARE', label: 'Job Share', icon: '🤝' },
  { value: 'ASYNC', label: 'Async', icon: '💬' },
  { value: 'COMPRESSED_HOURS', label: 'Compressed', icon: '⏰' },
  { value: 'FLEXIBLE_START_FINISH', label: 'Flex Start/Finish', icon: '🕐' },
]

const SECTORS = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Operations', 'HR', 'Legal', 'Retail',
]

const CONTRACT_TYPES = [
  { value: 'PERMANENT', label: 'Permanent' },
  { value: 'FTC', label: 'Fixed-term' },
  { value: 'CONTRACT', label: 'Contract' },
]

export default function JobFilters({ current }: { current: Filters }) {
  const router = useRouter()
  const pathname = usePathname()

  const [q, setQ] = useState(current.q ?? '')
  const [location, setLocation] = useState(current.location ?? '')
  const [remote, setRemote] = useState(current.remote === 'true')
  const [tags, setTags] = useState<string[]>(current.tag ? current.tag.split(',') : [])
  const [hours, setHours] = useState(current.hours ?? '')
  const [sector, setSector] = useState(current.sector ?? '')
  const [salaryMin, setSalaryMin] = useState(current.salaryMin ?? '')
  const [returnerFriendly, setReturnerFriendly] = useState(current.returnerFriendly === 'true')
  const [contractType, setContractType] = useState(current.contractType ?? '')
  const [officeDaysMax, setOfficeDaysMax] = useState(current.officeDaysMax ?? '')

  const apply = useCallback((overrides: Partial<Filters> = {}) => {
    const params: Record<string, string> = {}
    const merged = {
      q, location,
      remote: remote ? 'true' : '',
      tag: tags.join(','), hours, sector, salaryMin,
      returnerFriendly: returnerFriendly ? 'true' : '',
      contractType, officeDaysMax,
      ...overrides,
    }
    Object.entries(merged).forEach(([k, v]) => { if (v) params[k] = v })
    router.push(`${pathname}?${new URLSearchParams(params)}`)
  }, [q, location, remote, tags, hours, sector, salaryMin, returnerFriendly, contractType, officeDaysMax, router, pathname])

  function toggleTag(value: string) {
    const next = tags.includes(value) ? tags.filter(t => t !== value) : [...tags, value]
    setTags(next)
    apply({ tag: next.join(',') })
  }

  function clearAll() {
    setQ(''); setLocation(''); setRemote(false); setTags([]); setHours('')
    setSector(''); setSalaryMin(''); setReturnerFriendly(false); setContractType(''); setOfficeDaysMax('')
    router.push(pathname)
  }

  const hasFilters = q || location || remote || tags.length > 0 || hours || sector || salaryMin || returnerFriendly || contractType || officeDaysMax

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-teal-600 hover:underline">Clear all</button>
        )}
      </div>

      {/* Keyword */}
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

      {/* Career break */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={returnerFriendly}
          onChange={e => { setReturnerFriendly(e.target.checked); apply({ returnerFriendly: e.target.checked ? 'true' : '' }) }}
          className="w-4 h-4 text-teal-600 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Career break welcome</span>
      </label>

      {/* Flexibility */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Flexibility type</label>
        <div className="space-y-1">
          {FLEX_TAGS.map(t => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={tags.includes(t.value)}
                onChange={() => toggleTag(t.value)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="text-sm text-gray-700">{t.icon} {t.label}</span>
            </label>
          ))}
          {tags.length > 0 && (
            <button onClick={() => { setTags([]); apply({ tag: '' }) }} className="text-xs text-teal-600 hover:underline mt-1">
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

      {/* Contract type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contract type</label>
        <select
          value={contractType}
          onChange={e => { setContractType(e.target.value); apply({ contractType: e.target.value }) }}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Any</option>
          {CONTRACT_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
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

      {/* Office days */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Max office days: {officeDaysMax !== '' ? `${officeDaysMax} day${officeDaysMax === '1' ? '' : 's'}/wk` : 'Any'}
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={officeDaysMax !== '' ? officeDaysMax : 5}
          onChange={e => setOfficeDaysMax(e.target.value === '5' ? '' : e.target.value)}
          onMouseUp={() => apply()}
          onTouchEnd={() => apply()}
          className="w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Remote</span>
          <span>On-site</span>
        </div>
      </div>

      {/* Min salary */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Min salary: {salaryMin ? `£${parseInt(salaryMin).toLocaleString()}+` : 'Any'}
        </label>
        <input
          type="range"
          min={0}
          max={150000}
          step={5000}
          value={salaryMin || 0}
          onChange={e => setSalaryMin(e.target.value === '0' ? '' : e.target.value)}
          onMouseUp={() => apply()}
          onTouchEnd={() => apply()}
          className="w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Any</span>
          <span>£150k+</span>
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
