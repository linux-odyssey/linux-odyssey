import { Request, Response, NextFunction } from 'express'
import { LoginAttempt } from '@linux-odyssey/models'

export async function recordLogin(
  req: Request,
  success: boolean,
  message: string
) {
  await LoginAttempt.create({
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    success,
    time: new Date(),
    username: req.body.username,
    message
  })
}

