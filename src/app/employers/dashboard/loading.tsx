export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="h-8 w-12 mx-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 mx-auto bg-gray-100 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
