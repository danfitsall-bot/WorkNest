import SignUpForm from './signup-form'

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { role?: string }
}) {
  return <SignUpForm role={searchParams.role ?? 'SEEKER'} />
}
