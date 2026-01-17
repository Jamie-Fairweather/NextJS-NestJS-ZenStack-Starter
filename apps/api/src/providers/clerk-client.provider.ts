import { createClerkClient } from '@clerk/backend'

export const UserClerkClientProvider = {
    provide: 'UserClerkClient',
    useFactory: () => {
        return createClerkClient({
            publishableKey: process.env.USER_CLERK_PUBLISHABLE_KEY,
            secretKey: process.env.USER_CLERK_SECRET_KEY,
        })
    },
}

export const AdminClerkClientProvider = {
    provide: 'AdminClerkClient',
    useFactory: () => {
        return createClerkClient({
            publishableKey: process.env.ADMIN_CLERK_PUBLISHABLE_KEY,
            secretKey: process.env.ADMIN_CLERK_SECRET_KEY,
        })
    },
}
