import { router, publicProcedure } from '../trpc.js'
import { linkRouter } from './linkRouter.js'
import { questRouter } from './questRouter.js'
import { userRouter } from './userRouter.js'
import { sessionRouter } from './sessionRouter.js'

export const appRouter = router({
  userList: publicProcedure.query(async (opts) => {
    // Retrieve users from a datasource, this is an imaginary database
    return opts.ctx
  }),
  links: linkRouter,
  quests: questRouter,
  users: userRouter,
  session: sessionRouter,
})

export type AppRouter = typeof appRouter
