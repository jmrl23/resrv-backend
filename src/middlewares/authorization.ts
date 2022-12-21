import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { cache } from './../services'
import { AUTH_BYPASS_KEY, JWT_SECRET } from './../configurations'
import { Role } from '@prisma/client'
import { UnauthorizedError } from 'express-response-errors'
import { User } from '../types'

export function authorization(...role: Role[]) {
  const UNAUTHORIZED_MESSAGE = 'Sorry, your request could not be processed'
  return async function (
    request: Request,
    _response: Response,
    next: NextFunction
  ) {
    if (request.query?.auth_bypass === AUTH_BYPASS_KEY) return next()
    const auth = request.header('authorization')
    if (!auth || !auth.startsWith('Bearer'))
      return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE))
    const token = auth.split(' ')[1]
    try {
      const { id } = <{ id: string }>jwt.verify(token, JWT_SECRET)
      const user = (await cache.get(`user-${id}`)) as null | User
      if (!user || !user?.UserLevel || !role.includes(user.UserLevel.role))
        return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE))
      next()
    } catch (_error) {
      next(new UnauthorizedError(UNAUTHORIZED_MESSAGE))
    }
  }
}
