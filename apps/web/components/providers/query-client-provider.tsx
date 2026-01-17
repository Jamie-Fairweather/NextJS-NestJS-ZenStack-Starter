'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@workspace/database/hooks'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 30, // Data is fresh for 30 seconds
                gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
                refetchOnMount: false, // Don't refetch if data is fresh
                refetchOnWindowFocus: false, // Don't refetch on every window focus to avoid hammering API
                refetchOnReconnect: true, // Refetch when internet connection is restored
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: use singleton pattern to keep the same query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
    // Use useState to ensure we only create the client once per component lifecycle
    const [queryClient] = useState(() => getQueryClient())

    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
}
