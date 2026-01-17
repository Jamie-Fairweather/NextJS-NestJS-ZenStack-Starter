import { z } from 'zod'
import { ExampleSchema as ExampleSchemaBase } from '@workspace/database/zod/models'

export const ExampleSchema = ExampleSchemaBase.extend({
    extended: z.string().nullable().optional(),
}).strict()

export type Example = z.infer<typeof ExampleSchema>
