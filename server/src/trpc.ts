import { initTRPC, TRPCError } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export const createContext = async (opts: CreateNextContextOptions) => {
  const { session, user, ip, isAuthenticated } = opts.req
  return {
    session,
    user,
    ip,
    isAuthenticated,
  }
}

export type AppContext = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<AppContext>().create()
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router, procedure: publicProcedure } = t

export const protectedProcedure = publicProcedure.use(async (opts) => {
  if (opts.ctx.isAuthenticated() && !('newUser' in opts.ctx.user)) {
    return opts.next()
  }
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Login required',
  })
})
