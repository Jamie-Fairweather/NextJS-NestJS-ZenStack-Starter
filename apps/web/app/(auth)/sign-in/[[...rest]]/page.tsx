import { SignIn } from '@clerk/nextjs'

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ redirect_url?: string }> }) {
    const params = await searchParams
    const originalRedirect = params.redirect_url || '/'
    const newRedirect = `/api/setup?redirect=${encodeURIComponent(originalRedirect)}`
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn forceRedirectUrl={newRedirect} />
        </div>
    )
}
