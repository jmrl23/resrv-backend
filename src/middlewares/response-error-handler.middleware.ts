import type { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-response-errors'

export function responseErrorHandler(
  error: HttpError,
  _request: Request,
  response: Response,
  next?: NextFunction | undefined
) {
  if (!(error instanceof HttpError) ?? response.headersSent) {
    if (typeof next !== 'undefined') return next(error)
  }
  const { code, message, name } = error
  response.status(code).json({
    statusCode: code,
    message: message,
    error: name
      .replace(/([A-Z])/g, ' $1')
      .replace(/Error$/g, '')
      .trim()
  })
}
