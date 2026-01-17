import { auth } from '@clerk/nextjs/server'

async function handleRequest(request: Request, { params }: { params: Promise<{ rest?: string[] }> }) {
    const userAuth = await auth()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const { rest = [] } = await params
    const path = rest.length > 0 ? `/${rest.join('/')}` : ''
    const url = new URL(request.url)
    const targetUrl = `${apiUrl}${path}${url.search}`

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.delete('connection')
    headers.set('Authorization', `Bearer ${await userAuth.getToken()}`)

    const body = request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null

    const fetchOptions: RequestInit & { duplex?: 'half' } = {
        method: request.method,
        headers,
        body: body as BodyInit | null,
    }

    // Add duplex option when sending a body (required for ReadableStream bodies)
    if (body) {
        fetchOptions.duplex = 'half'
    }

    const response = await fetch(targetUrl, fetchOptions)

    return response
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
