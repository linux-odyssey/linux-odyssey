/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    newUser?: Express.PendingUser // Adjust the type according to your newUser structure
  }
}
