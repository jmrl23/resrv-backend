import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { cached, db } from '../services'
import { JWT_SECRET } from '../configurations'
import { User } from '../types'

export async function requestUser(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const auth = request.header('authorization')
  if (!auth) return next()
  const authenticate = auth.split(' ')
  const [scheme, token] = authenticate
  if (authenticate.length !== 2 || scheme !== 'Bearer') return next()
  try {
    const { id } = <{ id: string }>jwt.verify(token, JWT_SECRET)
    const user = await cached(
      `user-${id}`,
      () =>
        db.user.findUnique({
          where: { id },
          include: {
            UserLevel: true,
            StudentInformation: true
          }
        }),
      60_000
    )
    request.user = <User>user
  } catch (_) {
    /* empty */
  } finally {
    next()
  }
}
