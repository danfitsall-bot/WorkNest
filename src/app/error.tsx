'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">😓</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-6">An unexpected error occurred. Please try again.</p>
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
