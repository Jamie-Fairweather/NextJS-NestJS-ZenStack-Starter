import 'server-only'

import type { JsonifiedClient } from '@orpc/openapi-client'
import type { ContractRouterClient } from '@orpc/contract'
import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { router } from '@workspace/contracts'
import { headers } from 'next/headers'

const link = new OpenAPILink(router, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/rpc`,
    headers: await headers(),
})

globalThis.$client = createORPCClient(link) as JsonifiedClient<ContractRouterClient<typeof router>>
