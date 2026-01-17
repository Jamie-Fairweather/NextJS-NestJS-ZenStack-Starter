import { enhance } from '@zenstackhq/runtime'
import { prismaClient } from './db'

export async function getEnhancedPrisma(userId: string): Promise<typeof prismaClient> {
    const user =
        userId &&
        (await prismaClient.user.findUnique({
            where: { id: userId },
        }))

    const context = user ? { ...user } : undefined
    return enhance(prismaClient, { user: context }) as typeof prismaClient
}
