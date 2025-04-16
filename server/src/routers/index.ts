import { router, publicProcedure } from '../trpc.js'
import { linkRouter } from './linkRouter.js'

export const appRouter = router({
  userList: publicProcedure.query(async (opts) => {
    // Retrieve users from a datasource, this is an imaginary database
    return opts.ctx
  }),
  links: linkRouter,
})

export type AppRouter = typeof appRouter
