import { Inject, Injectable } from '@nestjs/common'
import { EnhancedPrismaService } from './enhanced-prisma.service'
import { ExampleSchema } from '@workspace/core/schemas/example'

@Injectable()
export class ExampleService {
    constructor(@Inject(EnhancedPrismaService) private readonly prisma: EnhancedPrismaService) {}

    async getExamples(ownerId: string) {
        const result = await this.prisma.enhancedPrisma.example.findMany({
            where: {
                ownerId,
            },
        })

        return result.map((example) => ExampleSchema.parse(example))
    }
}
