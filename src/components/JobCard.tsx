import Link from 'next/link'

const TAG_STYLES: Record<string, string> = {
  FOUR_DAY_WEEK: 'bg-purple-100 text-purple-700',
  SCHOOL_HOURS: 'bg-green-100 text-green-700',
  TERM_TIME: 'bg-amber-100 text-amber-700',
  JOB_SHARE: 'bg-rose-100 text-rose-700',
  ASYNC: 'bg-blue-100 text-blue-700',
  COMPRESSED_HOURS: 'bg-indigo-100 text-indigo-700',
  FLEXIBLE_START_FINISH: 'bg-cyan-100 text-cyan-700',
}

const TAG_LABELS: Record<string, string> = {
  FOUR_DAY_WEEK: '4-Day Week',
  SCHOOL_HOURS: 'School Hours',
  TERM_TIME: 'Term Time',
  JOB_SHARE: 'Job Share',
  ASYNC: 'Async',
  COMPRESSED_HOURS: 'Compressed Hours',
  FLEXIBLE_START_FINISH: 'Flex Start/Finish',
}

const CONTRACT_LABELS: Record<string, string> = {
  PERMANENT: 'Permanent',
  FTC: 'Fixed-term',
  CONTRACT: 'Contract',
}

interface JobCardProps {
  id: string
  slug: string
  title: string
  company: { name: string; logo: string | null; parentFriendlyBadge: boolean }
  location: string | null
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
  tags: { tag: string }[]
  featured: boolean
  createdAt: Date
  returnerFriendly?: boolean
  contractType?: string | null
  officeDaysPerWeek?: number | null
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return ''
  const fmt = (n: number) => `£${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (max) return `up to ${fmt(max)}`
  return `from ${fmt(min!)}`
}

function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function officeDaysLabel(days: number): string {
  if (days === 0) return 'Fully remote'
  if (days === 5) return 'On-site'
  return `${days}d in office`
}

export default function JobCard({
  slug, title, company, location, remote, salaryMin, salaryMax, tags, featured, createdAt,
  returnerFriendly, contractType, officeDaysPerWeek,
}: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax)

  return (
    <Link href={`/jobs/${slug}`} className={`block bg-white rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 p-5 ${featured ? 'border-coral-200 shadow-sm' : 'border-gray-100'}`}>
      {featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs font-semibold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">Featured</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {company.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-gray-400">{company.name[0]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">{company.name}</span>
            {company.parentFriendlyBadge && (
              <span className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-medium">✓ Parent Friendly</span>
            )}
            {returnerFriendly && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Career break welcome</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mt-0.5 truncate">{title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 flex-wrap">
            {location && <span>{location}</span>}
            {remote && <span className="text-blue-600 font-medium">Remote</span>}
            {officeDaysPerWeek != null && <span>{officeDaysLabel(officeDaysPerWeek)}</span>}
            {contractType && <span>{CONTRACT_LABELS[contractType] ?? contractType}</span>}
            {salary && <span className="font-medium text-gray-600">{salary}</span>}
            <span>{timeAgo(createdAt)}</span>
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.slice(0, 3).map(({ tag }) => (
            <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[tag] ?? 'bg-gray-100 text-gray-600'}`}>
              {TAG_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
