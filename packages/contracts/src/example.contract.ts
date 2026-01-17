import { oc } from '@orpc/contract'
import { ExampleSchema } from '@workspace/core/schemas/example'
import * as z from 'zod'

export const GetExamplesInputSchema = z.object({
    ownerId: z.string(),
})

export const getExamplesContract = oc
    .route({
        method: 'GET',
        path: '/',
    })
    .input(GetExamplesInputSchema)
    .output(z.array(ExampleSchema))

export const router = oc.prefix('/backgroundVideo').tag('backgroundVideo').router({
    get: getExamplesContract,
})
