import { initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export const createContext = async (opts: CreateNextContextOptions) => {
  const { session, user, ip } = opts.req
  return {
    session,
    user,
    ip,
  }
}

export type AppContext = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<AppContext>().create()
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router, procedure: publicProcedure } = t
