import { Controller, Inject, UseGuards } from '@nestjs/common'
import { implement, Implement } from '@orpc/nest'
import { UserAuthGuard } from 'src/auth/auth.guard'
import { contract } from 'src/contracts'
import { ExampleService } from 'src/services/example.service'

@Controller()
export class ExampleController {
    constructor(@Inject(ExampleService) private readonly exampleService: ExampleService) {}

    @UseGuards(UserAuthGuard)
    @Implement(contract.example.get)
    getExamples() {
        return implement(contract.example.get).handler(async ({ input }) => {
            const { ownerId } = input
            return await this.exampleService.getExamples(ownerId)
        })
    }
}
