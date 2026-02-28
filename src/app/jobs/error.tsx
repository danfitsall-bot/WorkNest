'use client'

export default function JobsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😓</p>
        <h3 className="font-semibold text-gray-700 mb-2">Failed to load jobs</h3>
        <p className="text-gray-400 text-sm mb-6">Something went wrong loading the job listings. Please try again.</p>
        <button
          onClick={reset}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
