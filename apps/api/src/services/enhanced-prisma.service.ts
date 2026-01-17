import { enhance } from '@workspace/database/prisma'
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class EnhancedPrismaService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        @Inject(ClsService) private readonly cls: ClsService
    ) {}

    get enhancedPrisma() {
        return enhance(this.prisma, { user: this.cls.get('auth') }) as unknown as typeof this.prisma
    }
}
