import { ARIO, Wayfinder, PriorityGatewayRouter, StaticGatewaysProvider, HashVerifier, TrustedGatewaysHashProvider } from '@ar.io/sdk'
import axios from 'axios'

// initialize ARIO client on mainnet
const ario = ARIO.mainnet()

const priorityRouter = new PriorityGatewayRouter({
    ario,
    sortBy: 'operatorStake',
    sortOrder: 'desc',
    limit: 10,
})

// set up a router that picks a random gateway each time
export const wayfinder = new Wayfinder({
    priorityRouter,
    // @ts-expect-error - axios is not typed
     httpClient: fetch,
     verifier: new HashVerifier({
        trustedHashProvider: new TrustedGatewaysHashProvider({
          gatewaysProvider: new StaticGatewaysProvider({
            gateways: ['https://permagate.io'],
          }),
        }),
      }),
    })

