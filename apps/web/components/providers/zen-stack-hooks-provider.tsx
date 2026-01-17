'use client'

import { Provider, FetchFn } from '@workspace/database/hooks'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not set')

export default function ZenStackHooksProvider({ children, getToken }: { children: React.ReactNode; getToken: () => Promise<string | null> }) {
    const myFetch: FetchFn = async (url, options) => {
        // Get a fresh token on each request
        const token = await getToken()

        options = options ?? {}
        options.headers = {
            ...options.headers,
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token ?? ''}`,
        }
        return fetch(url, options)
    }

    return <Provider value={{ endpoint: `${apiUrl}/crud`, fetch: myFetch }}>{children}</Provider>
}
