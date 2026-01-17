import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
    try {
        const userAuth = await auth()
        const user = await currentUser()

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        if (!userAuth.isAuthenticated || !user) {
            return NextResponse.redirect(new URL('/sign-in', baseUrl))
        }

        const { searchParams } = new URL(request.url)
        const redirect = searchParams.get('redirect') || '/'

        const accessToken = await userAuth.getToken()

        if (!accessToken) {
            throw new Error('No access token available')
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

        const findUserResponse = await fetch(`${apiUrl}/crud/user/findUnique?q={"where":{"authId":"${user.id}"}}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!findUserResponse.ok) {
            const errorText = await findUserResponse.text()
            throw new Error(`Failed to check user: ${findUserResponse.status} ${errorText}`)
        }

        const findUserData = await findUserResponse.json()
        const existingUser = findUserData?.data

        if (!existingUser) {
            const createUserResponse = await fetch(`${apiUrl}/crud/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    data: {
                        authId: user.id,
                    },
                }),
            })

            if (!createUserResponse.ok) {
                const errorText = await createUserResponse.text()
                throw new Error(`Failed to create user: ${createUserResponse.status} ${errorText}`)
            }

            const findUserResponse = await fetch(`${apiUrl}/crud/user/findUnique?q={"where":{"authId":"${user.id}"}}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!findUserResponse.ok) {
                const errorText = await findUserResponse.text()
                throw new Error(`Failed to check user: ${findUserResponse.status} ${errorText}`)
            }
        }

        return NextResponse.redirect(new URL(redirect, baseUrl))
    } catch (error) {
        console.error('Setup API error:', error)

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const { searchParams } = new URL(request.url)
        const redirect = searchParams.get('redirect') || '/'

        return NextResponse.redirect(new URL(`/error?message=Setup failed&redirect=${encodeURIComponent(redirect)}`, baseUrl))
    }
}
