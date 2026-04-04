/** Shared constants used across forms, filters, and API validation. */

export const FLEX_TAGS = [
  { value: 'FOUR_DAY_WEEK', label: '4-Day Week' },
  { value: 'SCHOOL_HOURS', label: 'School Hours' },
  { value: 'TERM_TIME', label: 'Term-Time' },
  { value: 'JOB_SHARE', label: 'Job Share' },
  { value: 'ASYNC', label: 'Async' },
  { value: 'COMPRESSED_HOURS', label: 'Compressed Hours' },
  { value: 'FLEXIBLE_START_FINISH', label: 'Flexible Start/Finish' },
] as const

export const SECTORS = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Operations', 'HR', 'Legal', 'Retail', 'Other',
] as const

export const CONTRACT_TYPES = [
  { value: 'PERMANENT', label: 'Permanent' },
  { value: 'FTC', label: 'Fixed-term contract' },
  { value: 'CONTRACT', label: 'Contract / freelance' },
] as const

export const VALID_CONTRACT_TYPES: string[] = CONTRACT_TYPES.map(c => c.value)

export const VALID_TAGS: string[] = FLEX_TAGS.map(t => t.value)
