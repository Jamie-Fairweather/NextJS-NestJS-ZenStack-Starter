import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { verifyToken } from '@clerk/backend'
import { Request } from 'express'

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(@Inject(ClsService) private readonly cls: ClsService) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest<Request>()
        const token = req.headers.authorization?.split(' ').pop()

        try {
            if (!token) {
                this.cls.set('auth', null)
                return next.handle()
            }

            // Try user token first
            try {
                const tokenPayload = await verifyToken(token, {
                    secretKey: process.env.USER_CLERK_SECRET_KEY,
                })

                if (tokenPayload?.sub) {
                    this.cls.set('auth', { id: tokenPayload.sub, type: 'user' })
                    return next.handle()
                }
            } catch {
                //
            }

            // next try admin token... (example)

            this.cls.set('auth', null)
        } catch {
            this.cls.set('auth', null)
        }

        return next.handle()
    }
}
