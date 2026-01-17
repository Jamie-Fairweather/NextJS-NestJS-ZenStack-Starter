import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const { sessionId } = await auth()
    const clerk = await clerkClient()

    if (sessionId) {
        await clerk.sessions.revokeSession(sessionId)
    }

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
