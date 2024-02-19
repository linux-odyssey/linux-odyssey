/* eslint-disable no-unused-vars */
declare namespace Express {
  export type SocialLogin = {
    provider: string
    id: string
    displayName?: string
  }

  export type PendingUser = {
    email: string
    socialLogin: SocialLogin
  }

  export interface ExistingUser {
    id: string
    username: string
    email: string
  }

  export interface NewUser {
    newUser?: PendingUser
  }

  export type User = ExistingUser | NewUser
}
