import { All, Controller, Inject, UseGuards } from '@nestjs/common'

import { ApiHandlerService } from '@zenstackhq/server/nestjs'
import { UserAuthGuard } from 'src/auth/auth.guard'

@Controller('crud')
@UseGuards(UserAuthGuard)
export class CrudController {
    constructor(@Inject(ApiHandlerService) private readonly apiHandlerService: ApiHandlerService) {}

    @All('*path')
    async all() {
        return this.apiHandlerService.handleRequest({
            baseUrl: '/crud',
        })
    }
}
