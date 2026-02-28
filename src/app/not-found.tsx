import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/jobs" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm">
            Browse jobs
          </Link>
          <Link href="/" className="border border-gray-200 text-gray-600 font-medium py-2.5 px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
