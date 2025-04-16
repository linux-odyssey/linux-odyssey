import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from 'server/src/routers'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   }
      // },
    }),
  ],
})
