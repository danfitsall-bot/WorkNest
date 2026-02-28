import SignUpForm from './signup-form'

export const dynamic = 'force-dynamic'

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { role?: string }
}) {
  return (
    <SignUpForm
      role={searchParams.role ?? 'SEEKER'}
      googleConfigured={!!process.env.GOOGLE_CLIENT_ID}
    />
  )
}
