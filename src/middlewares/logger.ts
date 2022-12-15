import type { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { NODE_ENV } from '../configurations'

export function logger(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  switch (NODE_ENV) {
    case 'production':
      return morgan('common')(request, response, next)
    case 'development':
      return morgan('dev')(request, response, next)
    default:
      next()
  }
}
