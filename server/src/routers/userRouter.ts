import { UserProfile } from '../../../packages/models'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, router } from '../trpc.js'

export const userRouter = router({
  getMyProfile: protectedProcedure.query(async (opts) => {
    const { id, username, email } = opts.ctx.user

    const userProfile = await UserProfile.findOne({
      user: id,
    })
    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `UserProfile not found for user ${username} ${id}!`,
      })
    }
    const { progress } = userProfile
    return {
      username,
      email,
      progress,
    }
  }),
})
