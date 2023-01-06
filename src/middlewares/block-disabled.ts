import type { NextFunction, Request, Response } from 'express'
import { User } from '../types'
import { UnauthorizedError } from 'express-response-errors'

export function blockDisabled(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const user = <User>request.user
  if (!user || user?.enabled) return next()
  if (!user.enabled) next(new UnauthorizedError('Account is disabled'))
}
