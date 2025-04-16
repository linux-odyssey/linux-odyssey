import { router, publicProcedure } from '../trpc.js'

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return 'hello'
  }),
})
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
