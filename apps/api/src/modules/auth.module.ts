import { Module } from '@nestjs/common'
import { UserClerkStrategy } from '../auth/user-clerk.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserClerkClientProvider, AdminClerkClientProvider } from 'src/providers/clerk-client.provider'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ClsModule } from 'nestjs-cls'
import { AuthInterceptor } from '../auth/auth.interceptor'
import { UserAuthGuard } from '../auth/auth.guard'

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
            },
        }),
        PassportModule,
    ],
    providers: [
        UserClerkStrategy,
        UserClerkClientProvider,
        AdminClerkClientProvider,
        UserAuthGuard,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuthInterceptor,
        },
    ],
    exports: [PassportModule, UserClerkClientProvider, AdminClerkClientProvider, UserAuthGuard],
})
export class AuthModule {}
