import { Global, Module } from '@nestjs/common'
import { ZenStackModule } from '@zenstackhq/server/nestjs'
import { enhance } from '@workspace/database/prisma'
import { PrismaService } from '../services/prisma.service'
import { ClsService } from 'nestjs-cls'
import { ApiHandlerService } from '@zenstackhq/server/nestjs'

@Global()
@Module({
    imports: [
        ZenStackModule.registerAsync({
            useFactory: (...args: unknown[]) => {
                const prisma = args[0] as PrismaService
                const cls = args[1] as ClsService
                return {
                    getEnhancedPrisma: () => enhance(prisma, { user: cls.get('auth') }),
                }
            },
            inject: [PrismaService, ClsService],
            extraProviders: [PrismaService],
        }),
    ],
    providers: [ApiHandlerService],
    exports: [ZenStackModule, ApiHandlerService],
})
export class ZenStackGlobalModule {}
