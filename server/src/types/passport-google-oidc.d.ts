/* eslint-disable no-unused-vars */
declare module 'passport-google-oidc' {
  // Add specific type declarations here as needed.
  // For example, if you're only using it as a middleware in Express:
  import { Strategy as PassportStrategy } from 'passport'
  import { Request } from 'express'

  interface StrategyOptions {
    clientID: string
    clientSecret: string
    callbackURL: string
  }

  interface VerifyFunction {
    (
      issuer: string,
      profile: any,
      done: (error: any, user?: any, info?: any) => void
    ): void
  }

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction)
  }
}
