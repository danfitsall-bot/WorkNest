'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  jobId: string
  jobTitle: string
  company: string
  applyUrl: string | null
  initialSaved?: boolean
}

export default function ApplySection({ jobId, jobTitle, company, applyUrl, initialSaved = false }: Props) {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(initialSaved)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSave() {
    if (!session) return
    const newSaved = !saved
    setSaved(newSaved)
    await fetch('/api/saved-jobs', {
      method: newSaved ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    })
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, coverLetter }),
    })
    setLoading(false)
    if (res.ok) {
      setApplied(true)
      setShowForm(false)
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <h3 className="font-bold text-gray-900">Apply for this role</h3>

      {applied ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold">Application sent! ✓</p>
          <p className="text-green-600 text-sm mt-1">We&apos;ll notify you of updates.</p>
        </div>
      ) : applyUrl ? (
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors"
        >
          Apply now →
        </a>
      ) : session ? (
        showForm ? (
          <form onSubmit={handleApply} className="space-y-3">
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell them why you&apos;re a great fit (optional)…"
              rows={5}
              maxLength={10000}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Sending…' : 'Submit application'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full text-gray-400 text-sm hover:text-gray-600">
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Apply now
          </button>
        )
      ) : (
        <Link
          href={`/auth/signin?callbackUrl=/jobs/${jobId}`}
          className="block w-full bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors"
        >
          Sign in to apply
        </Link>
      )}

      <div className="flex gap-2 pt-1">
        {session && (
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-sm font-medium transition-colors ${
              saved ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {saved ? '♥ Saved' : '♡ Save'}
          </button>
        )}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {copied ? '✓ Copied!' : '↗ Share'}
        </button>
      </div>
    </div>
  )
}
