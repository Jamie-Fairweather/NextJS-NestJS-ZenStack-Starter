import { router as exampleRouter } from './example.contract.js'

export const router: {
    example: typeof exampleRouter
} = {
    example: exampleRouter,
}
