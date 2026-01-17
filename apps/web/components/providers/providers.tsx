'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import QueryClientProvider from './query-client-provider'
import ZenStackHooksProvider from './zen-stack-hooks-provider'
import { useAuth } from '@clerk/nextjs'

export function Providers({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth()

    return (
        <QueryClientProvider>
            <ZenStackHooksProvider getToken={getToken}>
                <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange enableColorScheme>
                    {children}
                </NextThemesProvider>
            </ZenStackHooksProvider>
        </QueryClientProvider>
    )
}
