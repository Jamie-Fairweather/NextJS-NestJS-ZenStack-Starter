import { Global, Module } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'
import { EnhancedPrismaService } from '../services/enhanced-prisma.service'

@Global()
@Module({
    providers: [PrismaService, EnhancedPrismaService],
    exports: [PrismaService, EnhancedPrismaService],
})
export class DatabaseModule {}
