import SignInForm from './signin-form'

export const dynamic = 'force-dynamic'

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  return <SignInForm callbackUrl={searchParams.callbackUrl ?? '/'} />
}
