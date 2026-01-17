import 'dotenv/config'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import type { Request, Response, NextFunction } from 'express'

import { apiReference } from '@scalar/nestjs-api-reference'
import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'

import * as openapi from '@workspace/database/openapi'
import { contract } from './contracts'

// Logging middleware for all requests
function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()
    const { method, originalUrl, path } = req

    res.on('finish', () => {
        const responseTime = Date.now() - startTime
        const statusCode = res.statusCode
        console.log(`${method} ${path || originalUrl} ${statusCode} - ${responseTime}ms`)
    })

    next()
}

function getCorsOrigins(): string[] {
    const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()) : []
    return corsOrigins
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Apply logging middleware to all requests
    app.use(loggingMiddleware)
    // app.use(blockingMiddleware)

    // Get CORS origins and enable CORS
    const corsOrigins = getCorsOrigins()
    if (corsOrigins.length > 0) {
        app.enableCors({
            origin: corsOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        })
        console.log('✅ CORS enabled for origins:', corsOrigins.join(', '))
    } else {
        console.warn('⚠️  CORS_ORIGINS not set - CORS is disabled')
        app.enableCors({
            origin: false, // Explicitly block all origins
        })
    }

    const openAPIGenerator = new OpenAPIGenerator({
        schemaConverters: [new ZodToJsonSchemaConverter()],
    })

    const specFromContract = await openAPIGenerator.generate(contract, {
        info: {
            title: 'API',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:4000' }],
    })

    app.use(
        '/reference',
        apiReference({
            theme: 'saturn',
            layout: 'classic',
            sources: [
                {
                    title: 'API (CRUD)',
                    content: openapi,
                    default: true,
                },
                {
                    title: 'API',
                    content: specFromContract,
                },
            ],
        })
    )
    await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
