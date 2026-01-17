import { User, verifyToken } from '@clerk/backend'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { Request } from 'express'
import { ClerkClient } from '@clerk/backend'

@Injectable()
export class UserClerkStrategy extends PassportStrategy(Strategy, 'user-clerk') {
    constructor(
        @Inject('UserClerkClient')
        private readonly clerkClient: ClerkClient
    ) {
        super()
    }

    async validate(req: Request): Promise<User> {
        const token = req.headers.authorization?.split(' ').pop()

        if (!token) {
            throw new UnauthorizedException('No token provided')
        }

        try {
            const tokenPayload = await verifyToken(token, {
                secretKey: process.env.USER_CLERK_SECRET_KEY,
            })

            const user = await this.clerkClient.users.getUser(tokenPayload.sub)

            return user
        } catch (error) {
            console.error(error)
            throw new UnauthorizedException('Invalid token')
        }
    }
}
