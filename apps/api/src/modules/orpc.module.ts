import { onError, ORPCModule } from '@orpc/nest'
import { Global, Module } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

@Global()
@Module({
    imports: [
        ORPCModule.forRootAsync({
            useFactory: (request: Request) => ({
                interceptors: [
                    onError((error) => {
                        console.error(error)
                    }),
                ],
                context: { request },
                eventIteratorKeepAliveInterval: 5000,
                customJsonSerializers: [],
                plugins: [],
            }),
            inject: [REQUEST],
        }),
    ],
})
export class ORPCGlobalModule {}
