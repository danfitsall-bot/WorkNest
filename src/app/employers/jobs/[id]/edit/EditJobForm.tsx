'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const FLEX_TAGS = [
  { value: 'FOUR_DAY_WEEK', label: '4-Day Week' },
  { value: 'SCHOOL_HOURS', label: 'School Hours' },
  { value: 'TERM_TIME', label: 'Term-Time' },
  { value: 'JOB_SHARE', label: 'Job Share' },
  { value: 'ASYNC', label: 'Async' },
  { value: 'COMPRESSED_HOURS', label: 'Compressed Hours' },
]

const SECTORS = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Operations', 'HR', 'Legal', 'Retail', 'Other',
]

interface Props {
  jobId: string
  canFeature: boolean
  initial: {
    title: string
    description: string
    requirements: string
    location: string
    remote: boolean
    partTime: boolean
    salaryMin: number | null
    salaryMax: number | null
    sector: string
    applyUrl: string
    tags: string[]
    featured: boolean
    closingDate: string
    status: string
  }
}

export default function EditJobForm({ jobId, canFeature, initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)
  const [requirements, setRequirements] = useState(initial.requirements)
  const [location, setLocation] = useState(initial.location)
  const [remote, setRemote] = useState(initial.remote)
  const [partTime, setPartTime] = useState(initial.partTime)
  const [salaryMin, setSalaryMin] = useState(initial.salaryMin?.toString() ?? '')
  const [salaryMax, setSalaryMax] = useState(initial.salaryMax?.toString() ?? '')
  const [sector, setSector] = useState(initial.sector)
  const [applyUrl, setApplyUrl] = useState(initial.applyUrl)
  const [tags, setTags] = useState<string[]>(initial.tags)
  const [featured, setFeatured] = useState(initial.featured)
  const [closingDate, setClosingDate] = useState(initial.closingDate)
  const [status, setStatus] = useState(initial.status)

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, requirements, location, remote, partTime,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        sector, applyUrl, tags, featured, status,
        closingDate: closingDate || null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Failed to update job')
      return
    }
    router.push('/employers/dashboard')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Delete this job? This cannot be undone.')) return
    const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/employers/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Job details</h2>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="London, Manchester…" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select sector</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min salary (£)</label>
            <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} step={1000} min={0}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="30000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max salary (£)</label>
            <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} step={1000} min={0}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="50000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">External apply URL (optional)</label>
          <input type="url" value={applyUrl} onChange={e => setApplyUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="https://yoursite.com/apply" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Closing date</label>
          <input type="date" value={closingDate} onChange={e => setClosingDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
            <span className="text-sm text-gray-700">Remote</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={partTime} onChange={e => setPartTime(e.target.checked)} className="w-4 h-4 text-teal-600 rounded" />
            <span className="text-sm text-gray-700">Part-time</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-1">Flexibility type</h2>
        <p className="text-gray-400 text-sm mb-4">Select all that apply</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FLEX_TAGS.map(t => (
            <label key={t.value} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
              tags.includes(t.value) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <input type="checkbox" checked={tags.includes(t.value)} onChange={() => toggleTag(t.value)} className="sr-only" />
              <span className="text-sm font-medium">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Job description</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About the role *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={8}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (optional)</label>
          <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
      </div>

      {canFeature && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 text-teal-600 rounded mt-0.5" />
            <div>
              <span className="font-semibold text-gray-900 text-sm">Feature this listing</span>
              <p className="text-gray-400 text-xs mt-0.5">Featured jobs appear at the top of search results and on the homepage.</p>
            </div>
          </label>
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="flex-1 bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={handleDelete}
          className="border border-red-200 text-red-600 font-medium py-3 px-6 rounded-xl hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>
    </form>
  )
}
