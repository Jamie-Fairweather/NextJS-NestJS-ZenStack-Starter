'use client'

import { UserProfile } from '@clerk/nextjs'
import { Button } from '@workspace/ui/components/core/button'
import { useRouter } from 'next/navigation'
export default function UserProfilePage() {
    const router = useRouter()
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <UserProfile />
            <Button
                onClick={() => {
                    router.push('/dashboard')
                }}
            >
                Return to Dashboard
            </Button>
        </div>
    )
}
