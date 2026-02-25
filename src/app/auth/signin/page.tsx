import SignInForm from './signin-form'

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  return <SignInForm callbackUrl={searchParams.callbackUrl ?? '/'} />
}
