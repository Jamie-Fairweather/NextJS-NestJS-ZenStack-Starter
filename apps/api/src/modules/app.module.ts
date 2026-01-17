import { Module } from '@nestjs/common'

import { CrudModule } from './crud.module'
import { ZenStackGlobalModule } from './zenstack.module'
import { ORPCGlobalModule } from './orpc.module'
import { AuthModule } from './auth.module'
import { DatabaseModule } from './database.module'

declare module '@orpc/nest' {
    /**
     * Extend oRPC global context to make it type-safe inside your handlers/middlewares
     */
    interface ORPCGlobalContext {
        request: Request & { user?: { id: string } }
    }
}

@Module({
    imports: [AuthModule, DatabaseModule, ZenStackGlobalModule, ORPCGlobalModule, CrudModule],
})
export class AppModule {}
