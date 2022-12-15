import type { NextFunction, Request, Response } from 'express'
import { NotFoundError } from 'express-response-errors'

export function notFound(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  next(new NotFoundError(`Cannot ${request.method} ${request.url}`))
}
