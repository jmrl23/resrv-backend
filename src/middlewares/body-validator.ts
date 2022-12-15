import { NextFunction, Request, Response } from 'express'
import { plainToInstance, type ClassConstructor } from 'class-transformer'
import { validate } from 'class-validator'
import { BadRequestError } from 'express-response-errors'

export function body<T extends object>(Cls: T) {
  return async function (
    request: Request,
    _response: Response,
    next: NextFunction
  ) {
    if (!request.headers['content-type']?.startsWith('application/json'))
      return next(new BadRequestError('Invalid Content-Type'))
    const instance = plainToInstance<typeof Cls, unknown>(
      Cls as ClassConstructor<T>,
      request.body ?? {}
    )
    const constraints = (
      await validate(instance, {
        whitelist: true,
        stopAtFirstError: true
      })
    )[0]?.constraints
    for (const key in constraints) {
      return next(new BadRequestError(constraints[key]))
    }
    request.body = instance
    next()
  }
}
