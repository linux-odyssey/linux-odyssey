import config from '../config.js'
import { publicProcedure, router } from '../trpc.js'

export const linkRouter = router({
  surveyLink: publicProcedure.query(() => {
    return config.surveyUrl
  }),
  bugReportLink: publicProcedure.query(() => {
    return config.bugReportUrl
  }),
})
