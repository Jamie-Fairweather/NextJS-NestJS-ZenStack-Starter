import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { PrismaClient } from '@prisma/client'
import { getEnhancedPrisma } from '../prisma/getPrisma'

const prisma = new PrismaClient()

export async function createContext({ req, res }: CreateExpressContextOptions) {
    const user = req.user ?? null
    const z = getEnhancedPrisma(user?.id)
    return { req, res, prisma, z, user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
