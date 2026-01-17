import { populateContractRouterPaths } from '@orpc/nest'
import { router } from '@workspace/contracts'

export const contract = populateContractRouterPaths(router)
