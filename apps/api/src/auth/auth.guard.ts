import { type ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class UserAuthGuard extends AuthGuard('user-clerk') {
    constructor() {
        super()
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }
}
